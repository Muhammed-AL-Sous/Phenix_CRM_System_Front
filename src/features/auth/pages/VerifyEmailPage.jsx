// ========= React ========= //
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";

// ======== Auth API Slice & Slice ========= //
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "../authApiSlice";
import { selectCurrentUser, setCredentials } from "../authSlice";

// ======== Role Config ========= //
import { getPostAuthDestination } from "../../../logic/auth/postAuthRedirect";

// ========= External Libraries ========= //
import { notify, notifyPromise } from "../../../lib/notify";
import { useTranslation } from "react-i18next";

import { Spinner } from "../../../components/common/GlobalLoader";

const VerifyEmailPage = () => {
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { direction } = useSelector((state) => state.ui);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const { t } = useTranslation(["auth"]);

  const [code, setCode] = useState(["", "", "", "", "", ""]);

  // 1. حالة للوقت الحالي (لتجنب استخدام Date.now مباشرة في الرندر)
  const [now, setNow] = useState(() => Date.now());

  // 2. حالة وقت انتهاء الصلاحية
  const [expiry, setExpiry] = useState(() => {
    const saved = localStorage.getItem("otp_expiry");
    const initialNow = Date.now();
    if (saved && parseInt(saved, 10) > initialNow) return parseInt(saved, 10);

    const retryAfter = location.state?.retry_after || user?.retry_after || 0;
    return retryAfter > 0 ? initialNow + retryAfter * 1000 : 0;
  });

  // 3. حساب التايمر بشكل مشتق ونقي (Pure Calculation)
  // الآن هو مجرد طرح قيمتين موجودتين في الـ State
  const timer = useMemo(() => {
    return Math.max(0, Math.ceil((expiry - now) / 1000));
  }, [expiry, now]);

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: resendLoading }] =
    useResendVerificationMutation();

  const canResend = timer <= 0;
  const email = useMemo(
    () => location.state?.email || user?.email || "",
    [location.state, user],
  );
  const updateTimer = useCallback((seconds) => {
    const newNow = Date.now();
    const newExpiry = newNow + seconds * 1000;
    localStorage.setItem("otp_expiry", newExpiry.toString());
    setNow(newNow);
    setExpiry(newExpiry);
  }, []);

  // 4. الـ Effect المسؤول عن تحديث الوقت (Synchronization)
  useEffect(() => {
    if (expiry <= now) return;

    const interval = setInterval(() => {
      const currentTicket = Date.now();
      setNow(currentTicket);

      if (expiry <= currentTicket) {
        localStorage.removeItem("otp_expiry");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiry, now]);

  useEffect(() => {
    if (!email && !isLoading) navigate("/login", { replace: true });
  }, [email, navigate, isLoading]);

  // ================= Input Logic =================
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
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

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(paste)) return;
    const newCode = paste.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);
    const lastIdx = Math.min(paste.length, 5);
    inputsRef.current[lastIdx]?.focus();
    if (paste.length === 6) submitCode(paste.join ? paste.join("") : paste);
  };

  const submitCode = async (finalCode) => {
    const codeString = Array.isArray(finalCode)
      ? finalCode.join("")
      : finalCode;
    if (codeString.length !== 6 || isLoading) return;

    try {
      const response = await verifyEmail({ email, code: codeString }).unwrap();
      localStorage.removeItem("otp_expiry");
      notify("auth:success.Email_verified_successfully", "success");
      if (response.data?.user) {
        dispatch(setCredentials({ user: response.data.user }));
      }
      const verifiedUser = response.data?.user;
      if (verifiedUser) {
        navigate(getPostAuthDestination(verifiedUser), { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      if (err.status === 429) {
        updateTimer(err.data?.errors?.retry_after || 60);
      } else {
        notify(
          "auth:error." + (err.data?.message || "Verification failed"),
          "error",
        );
        setCode(["", "", "", "", "", ""]);
        inputsRef.current?.focus();
      }
    }
  };

  const handleResend = async () => {
    if (!canResend || resendLoading) return;
    try {
      const promise = resendVerification({ email }).unwrap();
      notifyPromise(promise, {
        loading: "auth:loading.The verification code is being resent",
        success: "auth:success.Code resent successfully",
      });
      const response = await promise;
      updateTimer(response?.data?.user?.retry_after ?? 60);
    } catch (err) {
      if (err.status === 429)
        updateTimer(err.data?.errors?.retry_after || 60);
      notify(err.data?.message || "Resend failed", "error");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="px-8 py-0 rounded-2xl w-full max-w-md text-center">
        <p
          className="text-slate-600 dark:text-slate-400 mb-6 text-sm font-semibold"
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}
        >
          <span>{email}</span>
          <span className="block mt-2 text-red-600 text-xs">
            {t("code.It expires in 10 minutes.")}
          </span>
        </p>

        <div
          className="flex justify-between gap-2 mb-6"
          style={{ direction: "ltr" }}
        >
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              ref={(el) => (inputsRef.current[index] = el)}
              value={digit}
              disabled={isLoading || (index > 0 && !code[index - 1])}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-2xl dark:text-white text-gray-700 font-bold border-2 rounded-xl border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-600 outline-none transition-all disabled:bg-gray-300 dark:disabled:bg-zinc-900"
            />
          ))}
        </div>

        <button
          onClick={() => submitCode(code)}
          disabled={code.includes("") || isLoading}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 transition-all disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <Spinner
              size="sm"
              variant="onPrimary"
              className="cursor-not-allowed"
            />
          ) : (
            t("email.Verify Account")
          )}
        </button>

        <div className="mt-6 text-sm">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-red-600 font-bold"
            >
              {resendLoading ? (
                <span className="cursor-not-allowed">
                  {t("loading.Sending code")}
                </span>
              ) : (
                <span className="cursor-pointer hover:underline">
                  {t("code.Resend Verification Code")}
                </span>
              )}
            </button>
          ) : (
            <p className="text-gray-500 font-bold">
              {t("code.Resend available after")}{" "}
              <span className="text-red-500 font-mono text-lg ps-1">
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
