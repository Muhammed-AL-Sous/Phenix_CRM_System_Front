// Translation Hook
import { useTranslation } from "react-i18next";

// React Router
import { Link } from "react-router";

// React Redux
import { useSelector } from "react-redux";

// Icons
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// React Hooks
import { useState, useRef, useCallback } from "react";

// Notification Toast
import { notifyPromise } from "../../../lib/notify";

// Login Slice
import { useLoginMutation } from "../authApiSlice";

const LoginPage = () => {
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const { t } = useTranslation(["common"]);
  const { direction } = useSelector((state) => state.ui);

  const [login, { error, isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginPromise = login(loginForm).unwrap();

      notifyPromise(loginPromise, {
        loading: "auth.logging_in",
        success: "auth.welcome_back",
        error: "auth.login_failed",
      });

      await loginPromise;
      // هنا يمكنك إضافة تحويل المستخدم لصفحة أخرى مثلاً
      // navigate('/verify-email');
    } catch (err) {
      // الأخطاء الفرعية (مثل 422) ستظهر تلقائياً في التنبيه بسبب notifyPromise
      // ولكننا نترك الـ catch هنا إذا أردت القيام بشيء إضافي (كطباعة الخطأ في الكونسول)
      console.error("Logging detail error:", err);
    }
  };

  // =============================
  // Toggle Password (Professional Fix)
  // =============================
  const togglePassword = useCallback((e) => {
    // منع سحب التركيز (يمنع اختفاء الكيبورد)
    e.preventDefault();

    const input = passwordRef.current;
    if (!input) return;

    // حفظ مكان المؤشر بدقة قبل التغيير
    const start = input.selectionStart;
    const end = input.selectionEnd;

    setShowPassword((prev) => !prev);

    // إعادة التركيز والمؤشر فوراً (بدون setTimeout إذا استخدمت onMouseDown)
    requestAnimationFrame(() => {
      input.setSelectionRange(start, end);
      input.focus();
    });
  }, []);

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* ============= Email ============= */}
      <div className="relative mb-7">
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
        <div className="relative">
          <input
            type="email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
            placeholder="name@company.com"
            style={{
              fontFamily: "Livvic",
              fontWeight: "500",
            }}
          />
          {error?.status === 422 && error.data.errors.email && (
            <div className="absolute left-1 right-1 top-[calc(100%+6px)] w-full">
              <p
                className="text-red-500 text-xs font-medium"
                style={{
                  fontFamily: direction === "rtl" ? "Almarai" : "Livvic",
                }}
              >
                {t(error.data.errors.email[0])}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============= PassWord ============= */}
      <div className="relative mb-7">
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
          {t("password")}
        </label>

        <div className="relative">
          <input
            ref={passwordRef}
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
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white
         ${direction === "rtl" ? "text-right" : "text-left"}`}
            placeholder="••••••••"
          />
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

          {error?.status === 422 && error.data.errors.password && (
            <div className="absolute left-1 right-1 top-[calc(100%+6px)] w-full">
              <p
                className="text-red-500 text-xs font-medium"
                style={{
                  fontFamily: direction === "rtl" ? "Almarai" : "Livvic",
                }}
              >
                {t(error.data.errors.password[0])}
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
          {t("remember_me")}
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
        className="w-full py-3 bg-red-500 hover:bg-red-600 duration-300 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all transform active:scale-[0.98] cursor-pointer"
      >
        {t("login")}
      </button>

      {/* ============= Register Button ============= */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t("dont_have_account")}{" "}
        <Link
          to="/register"
          className="text-red-500 hover:text-red-600 transition-all duration-200 font-bold hover:underline ms-1.5"
        >
          {t("register")}
        </Link>
      </p>

      {/* ============= Forgot PassWord ============= */}

      <Link to="/forgot_password">
        <p
          className="text-center text-sm text-slate-500 dark:text-slate-400
        transition-all duration-200 font-bold hover:underline"
        >
          {t("forgot_password")}{" "}
        </p>
      </Link>
    </form>
  );
};

export default LoginPage;
