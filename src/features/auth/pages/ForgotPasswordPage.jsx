import { useNavigate } from "react-router";
import { BadgeCheck, Mail } from "lucide-react";
import { Spinner } from "../../../components/common/GlobalLoader";
import useForgotPasswordPageHook from "../hooks/useForgotPasswordPageHook.js";

const ForgotPasswordPage = () => {
  const {
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
  } = useForgotPasswordPageHook();

  const navigate = useNavigate();

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
              setErrors({});
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
    ${errors.email ? "border-red-500 ring-red-500/20" : "focus:ring-red-500/20"}`}
            placeholder="name@company.com"
            style={{
              fontFamily: "Livvic",
              fontWeight: "500",
            }}
          />

          {/* ======= Errors Email ======= */}
          {errors.email && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] w-full">
              <p
                className="text-red-500 text-xs font-semibold px-1"
                style={{
                  fontFamily: direction === "rtl" ? "Almarai" : "Livvic",
                }}
              >
                {t(errors.email)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============= Continue Button ============= */}
      <button
        type="submit"
        disabled={isLoading || timer > 0}
        style={{
          fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
        }}
        className={`w-full py-3 bg-red-500
    hover:bg-red-600 duration-300 text-white font-bold
    rounded-3xl shadow-lg shadow-red-500/30 transition-all transform
     active:scale-[0.98] cursor-pointer
       ${
         isLoading || timer > 0
           ? "bg-red-500 cursor-not-allowed opacity-70"
           : "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 cursor-pointer"
       }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Spinner size="sm" variant="onPrimary" />
          </span>
        ) : timer > 0 ? (
          <span
            className="flex items-center justify-center gap-2"
            style={{
              fontFamily: direction === "rtl" ? "Almarai" : "Inter",
            }}
          >
            {/* عرض الوقت بتنسيق 01:30 مثلاً */}
            <span>{t("auth:email.resend_in")}</span>
            <span className="font-mono font-bold text-lg">
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
            className="text-blue-600 text-sm font-semibold hover:underline cursor-pointer"
            style={{
              fontFamily: direction === "rtl" ? "Vazirmatn" : "Livvic",
            }}
          >
            {t("auth:common.back_to_login")}
          </button>
        </div>
      )}
    </form>
  );
};

export default ForgotPasswordPage;
