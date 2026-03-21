// ========= React Hooks ========= //
import { useState } from "react";

// ========= Translation Hook ========= //
import { useTranslation } from "react-i18next";

// ========= React Redux ========= //
import { useSelector } from "react-redux";

// Icons
import { BadgeCheck, Mail } from "lucide-react";

// ========= Notification Toast ========= //
import { notify } from "../../../lib/notify.js";

// ========= Forgot Password Slice ========= //
import {
  useLazyGetCsrfTokenQuery,
  useForgotPasswordMutation,
} from "../authApiSlice.js";

// ========= React Router ========= //
import { useNavigate } from "react-router";

const ForgotPasswordPage = () => {
  // ========= States ========= //
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [timer, setTimer] = useState(0);

  // ========= API Mutation ========= //
  const [getCsrfToken, { isLoading: isCsrfLoading }] =
    useLazyGetCsrfTokenQuery();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  // ========= Translation ========= //
  const { t } = useTranslation(["auth"]);

  // ========= Redux ========= //
  const { direction } = useSelector((state) => state.ui);

  // ========= Router ========= //
  const navigate = useNavigate();

  // ========= Validate Forgot Password Form ========= //
  const validateForogtPassForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setErrors("error.email_required");
      return false; // توقف هنا وأعد "فشل"
    }

    if (!emailRegex.test(email)) {
      setErrors("error.email_invalid");
      return false; // توقف هنا وأعد "فشل"
    }

    setErrors(""); // تنظيف الأخطاء إذا كان الإدخال صحيحاً
    return true; // نجاح
  };

  // ========= Timer Count Down Function ========= //
  const startCountdown = (seconds = 60) => {
    setTimer(seconds);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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

  // ========= Handle Submit Function ========= //
  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق المحلي أولاً
    const isValid = validateForogtPassForm();
    if (!isValid || timer > 0) return; // منع الإرسال إذا كان العداد يعمل

    try {
      await getCsrfToken().unwrap();

      await forgotPassword(email.trim()).unwrap();

      notify("auth:success.reset_link_sent", "success");

      setIsSent(true);

      startCountdown(60); // ابدأ عد تنازلي لمدة دقيقة قبل السماح بإعادة الإرسال
    } catch (err) {
      if (err.status === 429) {
        // قراءة الثواني القادمة من Laravel (مثلاً 60 أو 900 ثانية)
        const waitSeconds = err.data?.retry_after || 60;
        // إذا كان لارافيل قد حظر المستخدم فعلياً (RateLimiter)
        notify(t("auth:error.too_many_requests"), "error");
        // تشغيل العداد بناءً على تعليمات السيرفر
        startCountdown(waitSeconds);
      } else if (err.status === 404) {
        notify(t("auth:error.email_not_found"), "error");
      } else if (err.status === 422) {
        notify(t("auth:error.email_not_valid"), "error");
      } else {
        notify(t("auth:error.server_error"), "error");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isSent && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl">
          <BadgeCheck className="text-green-600 w-5 h-5" />
          <p className="text-sm text-green-700 dark:text-green-400">
            {t("auth:success.We sent the link to")} <strong>{email}</strong>
          </p>
        </div>
      )}

      {/* ============= Email ============= */}
      <div className="relative mb-7">
        {/* ======= Label Email ======= */}
        <label
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
          }}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          <span>
            <Mail
              style={{
                top: direction === "rtl" ? "-2px" : "",
              }}
              className="w-4 h-4 relative"
            />
          </span>
          {t("email.email")}
        </label>
        <div className="relative">
          {/* ======= Input Email ======= */}
          <input
            type="text"
            name="email"
            disabled={isLoading || timer > 0} // تعطيل الإدخال أثناء الإرسال أو الانتظار
            value={email}
            onChange={(e) => {
              setErrors("");
              setEmail(e.target.value);
            }}
            autoComplete="email"
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2
    /* الألوان في الوضع العادي */
    text-slate-700 bg-slate-50 border-slate-200 
    /* الألوان في الوضع الليلي */
    dark:bg-zinc-800 dark:text-white dark:border-zinc-700 
    ${isLoading || timer > 0 ? "opacity-70 cursor-not-allowed" : ""}
    /* حالة الخطأ */
    ${errors ? "border-red-500 ring-red-500/20" : "focus:ring-red-500/20"}`}
            placeholder="name@company.com"
            style={{
              fontFamily: "Livvic",
              fontWeight: "500",
            }}
          />

          {/* ======= Errors Email ======= */}
          {errors && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] w-full">
              <p
                className="text-red-500 text-xs font-semibold px-1"
                style={{
                  fontFamily: direction === "rtl" ? "Almarai" : "Livvic",
                }}
              >
                {t(errors)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============= Continue Button ============= */}

      <button
        type="submit"
        disabled={isLoading || isCsrfLoading || timer > 0}
        style={{
          fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
        }}
        className={`w-full py-3 bg-red-500
    hover:bg-red-600 duration-300 text-white font-bold
    rounded-3xl shadow-lg shadow-red-500/30 transition-all transform
     active:scale-[0.98] cursor-pointer
       ${
         isLoading || isCsrfLoading || timer > 0
           ? "bg-red-500 cursor-not-allowed opacity-70"
           : "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 cursor-pointer"
       }`}
      >
        {isLoading || isCsrfLoading ? (
          <span className="flex items-center justify-center">
            <span className="w-6 h-6 block border-3 border-white border-t-transparent rounded-full animate-spin"></span>
          </span>
        ) : timer > 0 ? (
          <span className="flex items-center justify-center gap-2">
            {/* عرض الوقت بتنسيق 01:30 مثلاً */}
            <span>{t("auth:email.resend_in")}</span>
            <span className="font-mono font-bold tracking-wider">
              {formatTime(timer)}
            </span>
          </span>
        ) : isSent ? (
          t("auth:email.resend_link") // إعادة إرسال الرابط
        ) : (
          t("common.continue")
        )}
      </button>

      {isSent && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 text-sm hover:underline cursor-pointer"
          >
            {t("auth:common.back_to_login")}
          </button>
        </div>
      )}
    </form>
  );
};

export default ForgotPasswordPage;
