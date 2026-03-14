// React Hook
import { useState } from "react";

// Translation Hook
import { useTranslation } from "react-i18next";

// React Redux
import { useSelector } from "react-redux";

// Icons
import { Mail } from "lucide-react";

import { notifyPromise, notify } from "../../../lib/notify.js";

import {
  useGetCsrfTokenQuery,
  useForgotPasswordMutation,
} from "../authApiSlice.js";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  // 1. استدعاء التوكن تلقائياً عند فتح الصفحة
  // بمجرد تحميل المكون، سيقوم RTK Query بجلب التوكن وتخزينه في كوكيز المتصفح
  const { isLoading: isCsrfLoading } = useGetCsrfTokenQuery();
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const { t } = useTranslation(["common"]);
  const { direction } = useSelector((state) => state.ui);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // منع الإرسال إذا كان الإيميل فارغاً أو الطلب قيد التنفيذ أصلاً
    if (!email || isLoading || isCsrfLoading) return;

    try {
      const forgotPasswordPromise = forgotPassword(email.trim()).unwrap();

      notifyPromise(forgotPasswordPromise, {
        loading: "sending_link",
        success: "reset_link_sent",
      });

      // 3. انتظار النتيجة لمعالجة الأخطاء الخاصة (مثل 404)
      await forgotPasswordPromise;
    } catch (err) {
      // معالجة الأخطاء المخصصة فقط
      if (err.status === 404) {
        notify(t("email_not_found"), "error");
      } else if (err.status === 422) {
        notify(t("auth.validation_error"), "error");
      } else {
        notify(t("auth.server_error"), "error");
      }
      // ملاحظة: لا داعي لعمل notify للـ server_error هنا لأن notifyPromise قامت بذلك
    }
  };

  // دالة بسيطة للتحقق
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ============= Email ============= */}
      <div>
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
          {t("email")}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
          placeholder="name@company.com"
          style={{
            fontFamily: "Livvic",
            fontWeight: "500",
          }}
        />
        {email && !isValidEmail(email) && (
          <p
            className="text-red-500 text-xs font-medium animate-pulse mt-2 mb-0"
            style={{
              fontFamily: direction === "rtl" ? "Almarai" : "Livvic",
            }}
          >
            {t("auth.invalid_email_format")}
          </p>
        )}
        {error?.status === 422 && error.data.message && (
          <p
            className="text-red-500 text-xs font-medium animate-pulse mt-2 mb-0"
            style={{
              fontFamily: direction === "rtl" ? "Almarai" : "Livvic",
            }}
          >
            {t(error.data.message)}
          </p>
        )}
      </div>

      {/* ============= Continue Button ============= */}

      <button
        type="submit"
        disabled={isLoading || isCsrfLoading || !isValidEmail(email)}
        style={{
          fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
        }}
        className={`w-full py-3 my-4 text-white font-bold rounded-3xl transition-all transform active:scale-[0.95] 
    ${!isValidEmail(email) ? "opacity-50 cursor-not-allowed" : "bg-red-500"}
          ${
            isLoading || isCsrfLoading
              ? "bg-slate-400 cursor-not-allowed opacity-70"
              : "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 cursor-pointer"
          }`}
      >
        {isCsrfLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {t("preparing...")}
          </span>
        ) : isLoading ? (
          t("sending_link")
        ) : (
          t("continue")
        )}
      </button>
    </form>
  );
};

export default ForgotPasswordPage;
