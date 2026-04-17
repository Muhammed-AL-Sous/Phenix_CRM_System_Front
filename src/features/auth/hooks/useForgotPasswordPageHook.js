// ========= React ========= //
import { useState } from "react";

// ========= Redux ========= //
import { useSelector } from "react-redux";

// ========= Forgot Password Slice ========= //
import { useForgotPasswordMutation } from "../authApiSlice.js";

// ========= External Libraries ========= //
import { useTranslation } from "react-i18next";
import { notify } from "../../../lib/notify";
import { formatTimeMmSs } from "../../../lib/formatTimeMmSs.js";
import { getForgotPasswordEmailErrors } from "../validation/authFormValidators.js";

const useForgotPasswordPageHook = () => {
  // ========= States ========= //
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSent, setIsSent] = useState(false);
  const [timer, setTimer] = useState(0);

  // ========= RTK Query Hooks ========= //
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  // ========= Translation ========= //
  const { t } = useTranslation("auth");

  // ========= Redux ========= //
  const { direction } = useSelector((state) => state.ui);

  // ========= Validate Forgot Password Form ========= //
  const validateForgotPasswordForm = () => {
    const newErrors = getForgotPasswordEmailErrors(email);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  // ========= Handle Submit Function ========= //
  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق المحلي أولاً
    const isValid = validateForgotPasswordForm();
    if (!isValid || timer > 0) return; // منع الإرسال إذا كان العداد يعمل

    try {
      await forgotPassword(email.trim()).unwrap();

      notify("auth:success.reset_link_sent", "success");

      setIsSent(true);

      startCountdown(60); // ابدأ عد تنازلي لمدة دقيقة قبل السماح بإعادة الإرسال
    } catch (err) {
      if (err.status === 429) {
        // قراءة الثواني القادمة من Laravel (مثلاً 60 أو 900 ثانية)
        const waitSeconds = err.data?.errors?.retry_after || 60;
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

  return {
    email,
    setEmail,
    setErrors,
    errors,
    isSent,
    timer,
    formatTime: formatTimeMmSs,
    handleSubmit,
    isLoading,
    direction,
    t,
  };
};

export default useForgotPasswordPageHook;
