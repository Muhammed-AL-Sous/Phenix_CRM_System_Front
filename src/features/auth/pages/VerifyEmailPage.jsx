// ========= React Hooks ========= //
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ========= React Router ========= //
import { useNavigate, useLocation } from "react-router";

// ========= React Redux ========= //
import { useSelector } from "react-redux";

// ========= Verify Email & Resend Verification Code Slice ========= //
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "../authApiSlice";

// ========= Auth Slice ========= //
import { selectCurrentUser } from "../authSlice";

// ========= Notification Toast ========= //
import { notify, notifyPromise } from "../../../lib/notify";

// ========= Translation Hook ========= //
import { useTranslation } from "react-i18next";

// ========= Roles Config  ========= //
import { ROLES_CONFIG } from "../../../routes/roles.config";

const VerifyEmailPage = () => {
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { direction } = useSelector((state) => state.ui);
  const user = useSelector(selectCurrentUser);

  // ========= States ========= //
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(() => {
    // 1. الأولوية للـ SessionStorage (في حال الـ Refresh)
    const expiry = sessionStorage.getItem("otp_expiry");
    if (expiry) {
      const remaining = Math.floor((parseInt(expiry) - Date.now()) / 1000);
      if (remaining > 0) return remaining;
    }

    // 2. الأولوية الثانية للبيانات القادمة من السيرفر (Redux أو Location State)
    const serverRetryAfter =
      user?.retry_after || location.state?.user?.retry_after;
    if (serverRetryAfter > 0) return serverRetryAfter;

    // 3. القيمة الافتراضية
    return 60;
  });

  // ========= RTK Query Hooks ========= //
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: resendLoading }] =
    useResendVerificationMutation();

  // ========= Translation ========= //
  const { t } = useTranslation(["auth"]);

  // ========= Update Timer Function ========= //
  // دالة موحدة لتحديث التايمر في الـ State والـ Storage
  // داخل المكون:
  const updateTimerValue = useCallback((seconds) => {
    const expiryTime = Date.now() + seconds * 1000;
    sessionStorage.setItem("otp_expiry", expiryTime.toString());
    setTimer(seconds);
  }, []); // مصفوفة فارغة لأنها لا تعتمد على متغيرات خارجية متغيرة

  // حساب حالة الإرسال برمجياً (Derived State) - حل مشكلة Cascading Renders
  // مشتقة من التايمر مباشرة (تغني عن useEffects إضافية للتحقق)
  const canResend = useMemo(() => timer <= 0, [timer]);

  // محاولة جلب البيانات من 3 مصادر بالترتيب:
  // 1. الـ state (القادم من التنقل المباشر)
  // 2. الـ sessionStorage (في حال عمل Refresh)
  // 3. قيمة افتراضية فارغة
  const [email] = useState(
    () =>
      location.state?.email ||
      sessionStorage.getItem("pending_verify_email") ||
      "",
  );

  const [role] = useState(
    () =>
      location.state?.role ||
      sessionStorage.getItem("pending_verify_role") ||
      "",
  );

  // ========== Effects ========== //

  useEffect(() => {
    // إذا لم نجد الإيميل في أي مكان، فهذا يعني أن الدخول غير شرعي للصفحة
    if (!email && !user) {
      navigate("/login", { replace: true });
    }
  }, [email, user, navigate]);

  // تحديث الـ SessionStorage مرة واحدة فقط عند "ولادة" المكون إذا كان هناك وقت قادم من السيرفر
  useEffect(() => {
    const serverRetryAfter =
      user?.retry_after || location.state?.user?.retry_after;
    if (serverRetryAfter > 0) {
      const expiryTime = Date.now() + serverRetryAfter * 1000;
      sessionStorage.setItem("otp_expiry", expiryTime.toString());
    }
  }, []); // تشغيل مرة واحدة فقط عند الـ Mount

  // ===================== Input Logic =====================
  // ========= Handle Change Function ========= //
  const handleChange = (value, index) => {
    // منع الإدخال إذا كان في حالة تحميل أو القيمة ليست رقماً
    if (isLoading || !/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // إذا تم إدخال رقم وكان هناك حقل تالي
    if (value !== "" && index < 5) {
      // نستخدم setTimeout لضمان أن الـ React State تحديث
      // وأصبح الحقل التالي غير مقفل (Not Disabled)
      setTimeout(() => {
        if (inputsRef.current[index + 1]) {
          inputsRef.current[index + 1].focus();
        }
      }, 10);
    }
  };

  // ========= Handle KeyDown Function ========= //
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ========= Handle Paste Function ========= //
  const handlePaste = (e) => {
    // منع السلوك الافتراضي للصق
    e.preventDefault();

    const pasteData = e.clipboardData.getData("text").trim();
    // التأكد أن البيانات الملصقة هي أرقام فقط ونأخذ أول 6 خانات
    const paste = pasteData.slice(0, 6);

    if (!/^\d+$/.test(paste)) return; // تحقق أنها أرقام فقط

    const newCode = paste.split("");
    // إكمال المصفوفة بStrings فارغة إذا كان النص الملصق أقل من 6 أرقام
    const finalCode = [...newCode, ...Array(6 - newCode.length).fill("")].slice(
      0,
      6,
    );

    setCode(finalCode);

    // الانتظار قليلاً حتى يتم تحديث الحالة وتفعيل الحقول (Disabled -> Enabled)
    setTimeout(() => {
      const lastIndex = Math.min(paste.length - 1, 5);
      if (inputsRef.current[lastIndex]) {
        inputsRef.current[lastIndex].focus();
      }

      // إرسال الكود فقط إذا كان كاملاً (6 أرقام)
      if (paste.length === 6) {
        submitCode(paste);
      }
    }, 10);
  };

  // ========= Format Time Function ========= //
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // إضافة صفر على اليسار إذا كان الرقم أقل من 10 (مثلاً 09 بدلاً من 9)
    const paddedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${paddedMinutes}:${paddedSeconds}`;
  };

  // ===================== VERIFY LOGIC =====================
  // ========= Submit Code Function ========= //
  const submitCode = async (finalCode) => {
    if (isLoading) return; // منع الطلبات المتكررة

    try {
      const verifyEmailPromise = verifyEmail({
        email,
        code: finalCode,
      }).unwrap();

      // مسح البيانات المؤقتة لأنها لم تعد مطلوبة
      sessionStorage.removeItem("pending_verify_email");
      sessionStorage.removeItem("pending_verify_role");
      sessionStorage.removeItem("otp_expiry");

      const response = await verifyEmailPromise;

      notify("auth:success.Email_verified_successfully", "success");

      // 2. تحديد الدور: نأخذه من استجابة السيرفر (أكثر أماناً)
      // أو نستخدم المخزن كاحتياط (fallback)
      const userRole = response.data.user.role || role;

      const rolePrefix = ROLES_CONFIG[userRole]?.prefix || "";

      navigate(`/${rolePrefix}`, { replace: true });
    } catch (err) {
      if (err.status === 429) {
        const retryAfter = err?.data?.retry_after || 60;
        updateTimerValue(retryAfter);
        notify(t("auth:error.too_many_requests"), "error");
      } else {
        const errorMessage = err?.data?.message || "Verification failed";
        notify("auth:error." + errorMessage, "error");
        setCode(["", "", "", "", "", ""]);
        inputsRef.current?.focus();
      }
    }
  };
  // ===================== Resend Logic =====================
  // ========= Handle Resend Function ========= //
  const handleResend = async () => {
    if (!canResend || resendLoading) return;

    try {
      const resendVerifyPromise = resendVerification({ email }).unwrap();

      notifyPromise(resendVerifyPromise, {
        loading: "auth:loading.The verification code is being resent",
        success: "auth:success.Code resent successfully",
      });

      await resendVerifyPromise;

      updateTimerValue(60); // إعادة التايمر للقيمة الافتراضية بعد النجاح
    } catch (err) {
      if (err.status === 429) {
        const serverRetryAfter =
          err?.data?.retry_after || err?.data?.errors?.user?.retry_after;
        if (serverRetryAfter) {
          updateTimerValue(serverRetryAfter);
        }
        notify(t("auth:error.too_many_requests"), "error");
      } else {
        const msgError = err?.data?.message || "Resend failed";
        notify(msgError, "error");
      }
    }
  };

  // ===================== Timer Effect =====================
  useEffect(() => {
    if (timer <= 0) {
      sessionStorage.removeItem("otp_expiry"); // تنظيف التخزين عند انتهاء الوقت
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        const nextValue = prev - 1;
        return nextValue <= 0 ? 0 : nextValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ===================== UI Rendering =====================
  return (
    <div className="flex items-center justify-center">
      <div className=" px-8 py-0 rounded-2xl w-full max-w-md text-center">
        <p
          className="text-slate-600 dark:text-slate-400 mb-6 text-sm font-semibold"
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}
        >
          <span>{` {{ ${email} }} `}</span>
          <span className="block mt-2 text-red-600 text-xs">
            {" "}
            {t("code.It expires in 10 minutes.")}
          </span>
        </p>

        {/* ========= Code Section ========= */}
        <div
          className="flex justify-between gap-2 mb-6"
          style={{ direction: "ltr" }}
        >
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              // التعديل هنا: الحقل متاح فقط إذا كان الأول أو إذا كان الذي قبله ممتلئ
              disabled={isLoading || (index > 0 && code[index - 1] === "")}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-2xl dark:text-white text-gray-700
               font-bold border-2 rounded-xl border-gray-400
                focus:border-red-600 focus:ring-red-500 focus:ring-2 outline-none transition-all
                 dark:disabled:bg-zinc-900 disabled:bg-gray-300 disabled:text-gray-400 caret-red-500 disabled:cursor-not-allowed"
            />
          ))}
        </div>

        {/* ========= Verify Button ========= */}
        <button
          onClick={() => submitCode(code.join(""))}
          disabled={code.some((d) => d === "") || isLoading}
          className="w-full bg-red-600 text-white py-3 rounded-xl
           font-semibold hover:bg-red-700 transition active:scale-[0.98]
            disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="w-6 h-6 block border-3 border-white border-t-transparent rounded-full animate-spin"></span>
            </span>
          ) : (
            t("email.Verify Account")
          )}
        </button>

        {/* ========= Resend Code Section ========= */}
        <div className="mt-6 text-sm">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-red-600 font-bold hover:underline
               disabled:text-gray-400 cursor-pointer"
            >
              {resendLoading
                ? t("loading.Sending code")
                : t("code.Resend Verification Code")}
            </button>
          ) : (
            <p className="text-gray-500 font-bold flex items-center justify-center gap-1">
              {t("code.Resend available after")}
              <span className="text-red-500 font-mono w-8 text-center text-lg">
                {formatTime(timer)}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
