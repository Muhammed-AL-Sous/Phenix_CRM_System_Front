// ========= React Hooks ========= //
import { useState, useRef, useCallback } from "react";

// ========= React Router ========= //
import { Link } from "react-router";

// ========= React Redux ========= //
import { useSelector } from "react-redux";

// ========= Register Slice ========= //
import {
  useRegisterMutation,
  useLazyGetCsrfTokenQuery,
} from "../../auth/authApiSlice";

// ========= Notification Toast ========= //
import { notify, notifyPromise } from "../../../lib/notify";

// ========= Translation Hook ========= //
import { useTranslation } from "react-i18next";

// ========= Icons ========= //
import {
  Eye,
  EyeOff,
  UserRoundPlus,
  Mail,
  Lock,
  LockKeyhole,
} from "lucide-react";

const RegisterPage = () => {
  // ========= React State ========= //
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});

  // ========= Refs ========= //
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  // ========= Translation ========= //
  const { t } = useTranslation(["auth"]);

  // ========= Redux ========= //
  const { direction } = useSelector((state) => state.ui);

  // ========= API Mutation ========= //
  const [getCsrfToken, { isLoading: isCsrfLoading }] =
    useLazyGetCsrfTokenQuery();
  const [register, { isLoading }] = useRegisterMutation();

  // ========= Validate Register Form ========= //
  const validateRegisterForm = () => {
    let newErrors = {};

    // Name validation
    if (!registerForm.name.trim()) {
      newErrors.name = "auth.name.name_required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerForm.email.trim()) {
      newErrors.email = "auth.email.email_required";
    } else if (!emailRegex.test(registerForm.email)) {
      newErrors.email = "auth.email.email_invalid";
    }

    // Password validation
    if (!registerForm.password) {
      newErrors.password = "auth.password.password_required";
    } else if (
      registerForm.password.length < 6 ||
      registerForm.password.length > 12
    ) {
      newErrors.password = "auth.password.password_length_error";
    }

    // Confirm Password validation
    if (!registerForm.password_confirmation) {
      newErrors.password_confirmation =
        "auth.password.confirm_password_required";
    } else if (registerForm.password !== registerForm.password_confirmation) {
      newErrors.password_confirmation = "auth.password.passwords_dont_match";
    }

    setErrors(newErrors);
    // إذا كان كائن الأخطاء فارغاً، فهذا يعني أن البيانات صالحة
    return Object.keys(newErrors).length === 0;
  };

  // ========= Handle Change Function ========= //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));

    // مسح الخطأ الخاص بهذا الحقل فقط عند الكتابة
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق المحلي أولاً
    const isValid = validateRegisterForm();
    if (!isValid) return; // توقف هنا ولا ترسل للسيرفر

    try {
      // 1. اطلب التوكن أولاً (سيقوم السيرفر بإرسال الكوكيز للمتصفح)
      // استدعاء يدوي لتهيئة الكوكيز قبل التسجيل
      await getCsrfToken().unwrap();
      const registrationPromise = register(registerForm).unwrap();

      notifyPromise(registrationPromise, {
        loading: "auth:auth.register.registering",
        success: "auth:auth.register.welcome_message",
        error: "auth:auth.register.failed_try_again",
      });

      await registrationPromise;
      // navigate('/verify-email');
    } catch (err) {
      console.error("Registration detail error:", err);
      if (err.status === 422) {
        const serverMessage = err.data.message;

        // إذا كان الخطأ أن الإيميل مأخوذ مسبقاً
        if (serverMessage.includes("already been taken")) {
          setErrors({
            ...errors,
            email: "auth.email.The email has already been taken.",
          });
        } else {
          // أي خطأ Validation آخر
          notify("auth:auth.error.validation_error", "error");
        }
      }
    }
  };

  // =============================
  // Toggle Logic (Keyboard Fix)
  // =============================
  const handleToggle = useCallback((e, type) => {
    e.preventDefault(); // يمنع فقدان التركيز (إغلاق الكيبورد)

    const isMain = type === "password";
    const input = isMain ? passwordRef.current : passwordConfirmRef.current;

    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;

    if (isMain) setShowPassword((prev) => !prev);
    else setShowConfirmPassword((prev) => !prev);

    requestAnimationFrame(() => {
      input.setSelectionRange(start, end);
      input.focus();
    });
  }, []);

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {/* ============= Full Name ============= */}
      <div className="relative mb-7">
        {/* ======= Label Name ======= */}
        <label
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
          }}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          <span>
            <UserRoundPlus
              style={{
                top: direction === "rtl" ? "-2px" : "",
              }}
              className="w-4 h-4 relative"
            />
          </span>
          {t("auth.name.name")}
        </label>

        {/* ======= Input Name ======= */}
        <input
          type="text"
          name="name"
          value={registerForm.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border outline-none transition-all dark:text-white focus:ring-2 
        ${errors.name ? "border-red-500 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-red-500/20"}`}
          placeholder="John Doe"
          style={{
            fontFamily: "Livvic",
            fontWeight: "500",
          }}
        />
        {/* ======= Errors Name ======= */}
        {errors.name && (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] w-full">
            <p
              className="text-red-500 text-[10px] sm:text-xs font-medium px-1"
              style={{
                fontFamily: direction === "rtl" ? "Almarai" : "Livvic",
              }}
            >
              {t(errors.name)}
            </p>
          </div>
        )}
      </div>

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
          {t("auth.email.email")}
        </label>

        {/* ======= Input Email ======= */}
        <input
          type="email"
          name="email"
          style={{
            fontFamily: "Livvic",
            fontWeight: "500",
          }}
          value={registerForm.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border outline-none transition-all dark:text-white focus:ring-2 
        ${errors.email ? "border-red-500 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-red-500/20"}`}
          placeholder="name@company.com"
        />

        {/* ======= Errors Email ======= */}
        {errors.email && (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] w-full">
            <p
              className="text-red-500 text-[10px] sm:text-xs font-medium px-1"
              style={{
                fontFamily: direction === "rtl" ? "Almarai" : "Livvic",
              }}
            >
              {t(errors.email)}
            </p>
          </div>
        )}
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
          {t("auth.password.password")}
        </label>

        <div className="relative">
          {/* ======= Input Password ======= */}
          <input
            name="password"
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            style={{
              fontFamily: "Livvic",
              fontWeight: "500",
              letterSpacing:
                !showPassword && registerForm.password.length > 0
                  ? "0.2em"
                  : "normal",
            }}
            value={registerForm.password}
            onChange={handleChange}
            // ذكاء الاتجاه: LTR فقط عند وجود نص ليبقى الـ placeholder في مكانه
            dir={registerForm.password.length > 0 ? "ltr" : "inherit"}
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
            className={`absolute top-1/2 -translate-y-1/2
          ${direction === "rtl" ? "left-4" : "right-4"}`}
            onMouseDown={(e) => handleToggle(e, "password")}
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
                className="text-red-500 text-[10px] sm:text-xs font-medium px-1"
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

      {/* ============= PassWord Confirmation ============= */}
      <div className="relative mb-8">
        {/* ======= Label Password Confirmation ======= */}
        <label
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
          }}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          <span>
            <LockKeyhole
              style={{
                top: direction === "rtl" ? "-2px" : "",
              }}
              className="w-4 h-4 relative"
            />
          </span>
          {t("auth.password.Confirm_password")}
        </label>

        <div className="relative">
          {/* ======= Input Password Confirmation ======= */}
          <input
            name="password_confirmation"
            ref={passwordConfirmRef}
            type={showConfirmPassword ? "text" : "password"}
            style={{
              fontFamily: "Livvic",
              fontWeight: "500",
              letterSpacing:
                !showConfirmPassword &&
                registerForm.password_confirmation.length > 0
                  ? "0.2em"
                  : "normal",
            }}
            value={registerForm.password_confirmation}
            onChange={handleChange}
            dir={
              registerForm.password_confirmation.length > 0 ? "ltr" : "inherit"
            }
            className={`w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border outline-none transition-all dark:text-white focus:ring-2 
        ${
          errors.password_confirmation
            ? "border-red-500 ring-red-500/20"
            : "border-slate-200 dark:border-zinc-700 focus:ring-red-500/20"
        } 
        ${direction === "rtl" ? "text-right" : "text-left"}`}
            placeholder="••••••••"
          />

          {/* ======= Icon Show Hide Password Confirmation ======= */}
          <button
            type="button"
            className={`absolute top-1/2 -translate-y-1/2
          ${direction === "rtl" ? "left-4" : "right-4"}`}
            onMouseDown={(e) => handleToggle(e, "confirm")}
            style={{
              cursor: "pointer",
              zIndex: 10,
              color: "#6c757d",
              fontSize: "18px",
            }}
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>

          {/* ======= Errors Password Confirmation ======= */}
          {errors.password_confirmation && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] w-full">
              <p
                className="text-red-500 text-[10px] sm:text-xs font-medium px-1"
                style={{
                  fontFamily: direction === "rtl" ? "Almarai" : "Livvic",
                }}
              >
                {t(errors.password_confirmation)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ======= Register Button ======= */}
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
                   ? "bg-slate-400 cursor-not-allowed opacity-70"
                   : "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 cursor-pointer"
               }`}
      >
        {isLoading || isCsrfLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {t("auth.common.preparing...")}
          </span>
        ) : (
          t("auth.register.register")
        )}
      </button>

      {/* ======= Login Link ======= */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t("auth.common.already_have_account")}
        <Link
          to="/login"
          className="text-red-500 transition-all duration-200 hover:text-red-600 font-bold hover:underline ms-1.5"
        >
          {t("auth.login.login")}
        </Link>
      </p>
    </form>
  );
};

export default RegisterPage;
