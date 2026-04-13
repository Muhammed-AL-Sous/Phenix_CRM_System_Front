// ========= React ========= //
import { useState } from "react";

// ========= Redux ========= //
import { useSelector } from "react-redux";

// ========= Forgot Password Slice ========= //
import { useForgotPasswordMutation } from "../authApiSlice.js";

// ========= External Libraries ========= //
import { useTranslation } from "react-i18next";
import { notify } from "../../../lib/notify";

const useForgotPasswordPageHook = () => {
  // ========= States ========= //
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [timer, setTimer] = useState(0);

  // ========= RTK Query Hooks ========= //
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  // ========= Translation ========= //
  const { t } = useTranslation(["auth"]);

  // ========= Redux ========= //
  const { direction } = useSelector((state) => state.ui);

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
    formatTime,
    handleSubmit,
    isLoading,
    direction,
    t,
  };
};

export default useForgotPasswordPageHook;
