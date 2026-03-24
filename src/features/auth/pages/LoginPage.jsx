// ========= React Hooks ========= //
import { useState, useRef, useCallback } from "react";

// ========= React Router ========= //
import { Link, useNavigate, useLocation } from "react-router";

// ========= Role Config ========= //
import { ROLES_CONFIG } from "../../../routes/roles.config";

// ========= React Redux ========= //
import { useSelector } from "react-redux";

// ========= Login Slice ========= //
import { useLoginMutation, useLazyGetCsrfTokenQuery } from "../authApiSlice";

// ========= Translation Hook ========= //
import { useTranslation } from "react-i18next";

// ========= Notification Toast ========= //
import { notify } from "../../../lib/notify";

// ========= Icons ========= //
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const LoginPage = () => {
  // ========= React State ========= //
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});

  // ========= Refs ========= //
  const passwordRef = useRef(null);

  // ========= Router ========= //
  const navigate = useNavigate();
  const location = useLocation();

  // ========= Translation ========= //
  const { t } = useTranslation(["auth"]);

  // ========= Redux ========= //
  const { direction } = useSelector((state) => state.ui);

  // ========= API Mutation ========= //
  const [login, { isLoading }] = useLoginMutation();
  const [getCsrfToken, { isLoading: isCsrfLoading }] =
    useLazyGetCsrfTokenQuery();

  // ========= Validate Login Form ========= //
  const validateLoginForm = () => {
    let newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginForm.email.trim()) {
      newErrors.email = "error.email_required";
    } else if (!emailRegex.test(loginForm.email)) {
      newErrors.email = "error.email_invalid";
    }

    // Password validation
    if (!loginForm.password) {
      newErrors.password = "error.password_required";
    } else if (
      loginForm.password.length < 8 ||
      !/[a-zA-Z]/.test(loginForm.password) || // يجب أن تحتوي على حرف
      !/[0-9]/.test(loginForm.password) // يجب أن تحتوي على رقم
    ) {
      newErrors.password = "error.password_length_letter_error";
    }

    setErrors(newErrors);
    // إذا كان كائن الأخطاء فارغاً، فهذا يعني أن البيانات صالحة
    return Object.keys(newErrors).length === 0;
  };

  // ========= Handle Change Function ========= //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));

    // مسح الخطأ الخاص بهذا الحقل فقط عند الكتابة
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // ========= Handle Submit Function ========= //
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateLoginForm();
    if (!isValid) return; // توقف هنا ولا ترسل للسيرفر

    try {
      await getCsrfToken().unwrap();

      const loginPromise = login(loginForm).unwrap();

      const response = await loginPromise;

      notify("auth:success.welcome_back", "success");

      const { user } = response.data;

      const rolePrefix = ROLES_CONFIG[user.role]?.prefix || "";

      const origin = location.state?.from?.pathname || `/${rolePrefix}`;

      navigate(origin, { replace: true });
    } catch (err) {
      console.error("Logging detail error:", err);
      const status = err.status;
      const message = err.data?.message || "";

      const isNotVerified =
        status === 403 || message.toLowerCase().includes("not verified");

      if (isNotVerified) {

        const pendingUser = err.data?.errors?.user || err.data?.user;

        if (pendingUser) {
          navigate("/verify-email", {
            state: {
              email: pendingUser.email,
              role: pendingUser.role,
              retry_after: pendingUser.retry_after,
            },
          });

          notify("auth:error.Account_not_verified", "error");
          return;
        }
      }

      // معالجة الـ 401 (بيانات خاطئة)
      if (status === 401) {
        notify("auth:error.Invalid Email Or Password", "error");
        return;
      }

      notify("auth:error.login_failed", "error");
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
        disabled={isLoading || isCsrfLoading}
        style={{
          fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
        }}
        className={`w-full py-3 bg-red-500 
        hover:bg-red-600 duration-300 text-white font-bold 
        rounded-xl shadow-lg shadow-red-500/30 transition-all transform
         active:scale-[0.98] cursor-pointer
           ${
             isLoading || isCsrfLoading
               ? "bg-red-500 cursor-not-allowed opacity-80"
               : "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 cursor-pointer"
           }`}
      >
        {isLoading || isCsrfLoading ? (
          <span className="flex items-center justify-center">
            <span className="w-6 h-6 block border-3 border-white border-t-transparent rounded-full animate-spin"></span>
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

      <Link to="/forgot_password">
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
