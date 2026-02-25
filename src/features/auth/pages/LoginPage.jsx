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

const LoginPage = () => {
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const { t } = useTranslation(["common"]);
  const { direction } = useSelector((state) => state.ui);

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
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
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
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
          placeholder="name@company.com"
          style={{
            fontFamily: "Livvic",
            fontWeight: "500",
          }}
        />
      </div>

      {/* ============= PassWord ============= */}
      <div className="relative">
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
          className={`w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
         ${direction === "rtl" ? "text-right" : "text-left"}`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onMouseDown={togglePassword}
          style={{
            position: "absolute",
            top: "70%",
            left: direction === "rtl" ? "15px" : "",
            right: direction === "rtl" ? "" : "15px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            zIndex: 10,
            color: "#6c757d",
            fontSize: "18px",
          }}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      {/* ============= Login Button ============= */}
      <button
        type="submit"
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
