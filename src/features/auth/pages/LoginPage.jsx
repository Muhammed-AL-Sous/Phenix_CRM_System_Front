import { Link } from "react-router";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Spinner } from "../../../components/common/SpinnerFallback";
import useLoginPageHook from "../hooks/useLoginPageHook";

const LoginPage = () => {
  const {
    showPassword,
    loginForm,
    setLoginForm,
    errors,
    isLoading,
    direction,
    t,
    passwordRef,
    handleChange,
    handleSubmit,
    togglePassword,
  } = useLoginPageHook();

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
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
            type="email"
            name="email"
            value={loginForm.email}
            onChange={handleChange}
            autoComplete="email"
            className={`w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border outline-none transition-all dark:text-white focus:ring-2 
        ${errors.email ? "border-red-500 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-red-500/20"}`}
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

      {/* ============= PassWord ============= */}
      <div className="relative mb-7">
        {/* ======= Label Password ======= */}
        <label
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
          }}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          <span>
            <Lock
              style={{
                top: direction === "rtl" ? "-2px" : "",
              }}
              className="w-4 h-4 relative"
            />
          </span>
          {t("password.password")}
        </label>

        <div className="relative">
          {/* ======= Input Password ======= */}
          <input
            ref={passwordRef}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            inputMode="text"
            // الخدعة هنا: إذا كان هناك نص، اجعله LTR، إذا كان فارغاً اتركه لاتجيار الصفحة
            dir={loginForm.password.length > 0 ? "ltr" : "inherit"}
            style={{
              fontFamily: "Livvic",
              fontWeight: "500",
              letterSpacing:
                !showPassword && loginForm.password.length > 0
                  ? "0.2em"
                  : "normal",
            }}
            value={loginForm.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border outline-none transition-all dark:text-white focus:ring-2 
        ${
          errors.password
            ? "border-red-500 ring-red-500/20"
            : "border-slate-200 dark:border-zinc-700 focus:ring-red-500/20"
        } 
        ${direction === "rtl" ? "text-right" : "text-left"}`}
            placeholder="••••••••"
          />

          {/* ======= Icon Show Hide Password ======= */}
          <button
            type="button"
            onMouseDown={togglePassword}
            className={`absolute top-1/2 -translate-y-1/2
          ${direction === "rtl" ? "left-4" : "right-4"}`}
            style={{
              cursor: "pointer",
              zIndex: 10,
              color: "#6c757d",
              fontSize: "18px",
            }}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>

          {/* ======= Errors Password ======= */}
          {errors.password && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] w-full">
              <p
                className="text-red-500 text-xs font-semibold px-1"
                style={{
                  fontFamily: direction === "rtl" ? "Almarai" : "Livvic",
                }}
              >
                {t(errors.password)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============= Remember Me Smooth Switch ============= */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="remember"
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
          }}
          className="text-md font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          {t("common.remember_me")}
        </label>

        <button
          type="button"
          role="switch"
          aria-checked={loginForm.remember}
          onClick={() =>
            setLoginForm({ ...loginForm, remember: !loginForm.remember })
          }
          className={`
      relative w-14 h-7 rounded-full
      transition-colors duration-300 ease-out
      ${
        loginForm.remember
          ? "bg-red-500 shadow-lg shadow-red-500/30"
          : "bg-slate-300 dark:bg-zinc-700"
      }
    `}
        >
          <span
            className={`
        absolute top-1
        h-5 w-5 rounded-full bg-white shadow-md
        transition-transform duration-300 ease-out
        ${direction === "rtl" ? "right-1" : "left-1"}
        ${
          loginForm.remember
            ? direction === "rtl"
              ? "-translate-x-7"
              : "translate-x-7"
            : "translate-x-0"
        }
      `}
          />
        </button>
      </div>

      {/* ============= Login Button ============= */}
      <button
        type="submit"
        disabled={isLoading}
        style={{
          fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
        }}
        className={`w-full py-3 bg-red-500 
        hover:bg-red-600 duration-300 text-white font-bold 
        rounded-xl shadow-lg shadow-red-500/30 transition-all transform
         active:scale-[0.98] cursor-pointer
           ${
             isLoading
               ? "bg-red-500 cursor-not-allowed opacity-80"
               : "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 cursor-pointer"
           }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Spinner size="sm" variant="onPrimary" />
          </span>
        ) : (
          t("common.login")
        )}
      </button>

      {/* ============= Register Button ============= */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t("common.dont_have_account")}{" "}
        <Link
          to="/register"
          className="text-red-500 hover:text-red-600 transition-all duration-200 font-bold hover:underline ms-1.5"
        >
          {t("common.register")}
        </Link>
      </p>

      {/* ============= Forgot PassWord ============= */}

      <Link to="/forgot-password">
        <p
          className="text-center text-sm text-slate-500 dark:text-slate-400
        transition-all duration-200 font-bold hover:underline"
        >
          {t("password.forgot_password")}{" "}
        </p>
      </Link>
    </form>
  );
};

export default LoginPage;
