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
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { t } = useTranslation(["common"]);
  const { direction } = useSelector((state) => state.ui);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const forgotPasswordPromise = forgotPassword(email).unwrap();

    notifyPromise(forgotPasswordPromise, {
      loading: "sending_link",
      success: "reset_link_sent",
    });

    try {
      await forgotPasswordPromise;
    } catch (err) {
      console.log(err);
      if (err.status === 404) {
        notify(t("email_not_found"), "error"); // "الإيميل غير مسجل."
      } else if (err.status === 422) {
        notify(t("The email field is required."), "error"); // "الإيميل غير مسجل."
      } else if (err.status !== 419) {
        // 419 عادة تعني فشل الـ CSRF
        notify(t("server_error"), "error");
      }
    }
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
      </div>

      {/* ============= Continue Button ============= */}
      <button
        type="submit"
        disabled={isLoading || isCsrfLoading}
        style={{
          fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
        }}
        className="w-full py-3 my-6 bg-red-500 hover:bg-red-600 duration-300 text-white font-bold rounded-3xl shadow-lg shadow-red-500/30 transition-all transform active:scale-[0.98] cursor-pointer"
      >
        {isLoading ? t("sending_link") : t("continue")}
      </button>
    </form>
  );
};

export default ForgotPasswordPage;
