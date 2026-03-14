// React Hooks
import { useState, useRef, useCallback } from "react";

// Register Slice
import { useRegisterMutation } from "../../auth/authApiSlice";

// Translation Hook
import { useTranslation } from "react-i18next";

// React Router
import { Link } from "react-router";

// React Redux
import { useSelector } from "react-redux";

// Icons
import {
  Eye,
  EyeOff,
  UserRoundPlus,
  Mail,
  Lock,
  LockKeyhole,
} from "lucide-react";

// Notification Toast
import { notifyPromise } from "../../../lib/notify";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  const { t } = useTranslation(["common"]);
  const { direction } = useSelector((state) => state.ui);
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // دالة الـ Register تعطينا الـ error ككائن جاهز
  const [register, { error, isLoading }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // نقوم بتعريف العملية في متغير دون تنفيذها بـ await هنا
    const registrationPromise = register(registerForm).unwrap();

    // نمرر العملية لـ notifyPromise وهي ستدير الـ Loading والـ Success والـ Error
    notifyPromise(registrationPromise, {
      loading: "auth.registering",
      success: "auth.welcome_message",
      error: "auth.failed_try_again",
    });

    try {
      await registrationPromise;
      // هنا يمكنك إضافة تحويل المستخدم لصفحة أخرى مثلاً
      // navigate('/verify-email');
    } catch (err) {
      // الأخطاء الفرعية (مثل 422) ستظهر تلقائياً في التنبيه بسبب notifyPromise
      // ولكننا نترك الـ catch هنا إذا أردت القيام بشيء إضافي (كطباعة الخطأ في الكونسول)
      console.error("Registration detail error:", err);
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
    <form className="space-y-2" onSubmit={handleSubmit}>
      {/* ============= Full Name ============= */}
      <div className="relative mb-7">
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
          {t("name")}
        </label>
        <input
          type="text"
          value={registerForm.name}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, name: e.target.value })
          }
          className="w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
          placeholder="John Doe"
          style={{
            fontFamily: "Livvic",
            fontWeight: "500",
          }}
        />
        {error?.status === 422 && error.data.errors.name && (
          <div className="absolute left-1 right-1 top-[calc(100%+6px)] w-full">
            <p className="text-red-500 text-xs font-medium font-[Livvic]">
              {t(error.data.errors.name[0])}
            </p>
          </div>
        )}
      </div>

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
        <input
          type="email"
          style={{
            fontFamily: "Livvic",
            fontWeight: "500",
          }}
          value={registerForm.email}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, email: e.target.value })
          }
          className="w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
          placeholder="name@company.com"
        />

        {error?.status === 422 && error.data.errors.email && (
          <div className="absolute left-1 right-1 top-[calc(100%+6px)] w-full">
            <p className="text-red-500 text-xs font-medium font-[Livvic]">
              {t(error.data.errors.email?.[0])}
            </p>
          </div>
        )}
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
            style={{
              fontFamily: "Livvic",
              fontWeight: "500",
              letterSpacing:
                !showPassword && registerForm.password.length > 0
                  ? "0.2em"
                  : "normal",
            }}
            value={registerForm.password}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, password: e.target.value })
            }
            // ذكاء الاتجاه: LTR فقط عند وجود نص ليبقى الـ placeholder في مكانه
            dir={registerForm.password.length > 0 ? "ltr" : "inherit"}
            className={`w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white
         ${direction === "rtl" ? "text-right" : "text-left"}`}
            placeholder="••••••••"
          />
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
          {error?.status === 422 && error.data.errors.password && (
            <div className="absolute left-1 right-1 top-[calc(100%+6px)] w-full">
              <p className="text-red-500 text-xs font-medium font-[Livvic]">
                {t(error.data.errors.password[0])}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============= PassWord Confirmation ============= */}
      <div className="relative mb-9">
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
          {t("Confirm_password")}
        </label>
        <div className="relative">
          <input
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
            onChange={(e) =>
              setRegisterForm({
                ...registerForm,
                password_confirmation: e.target.value,
              })
            }
            dir={
              registerForm.password_confirmation.length > 0 ? "ltr" : "inherit"
            }
            className={`w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white
         ${direction === "rtl" ? "text-right" : "text-left"}`}
            placeholder="••••••••"
          />
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

          {error?.status === 422 && error.data.errors.password && (
            <div className="absolute left-0 top-[calc(100%+4px)] w-full">
              <p className="text-red-500 text-xs font-medium font-[Livvic]">
                {t(error.data.errors.password[0])}
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
        }}
        className="w-full py-3 bg-red-500 hover:bg-red-600 duration-300 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all transform active:scale-[0.98] cursor-pointer"
      >
        {t("register")}
      </button>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t("already_have_account")}{" "}
        <Link
          to="/login"
          className="text-red-500 transition-all duration-200 hover:text-red-600 font-bold hover:underline ms-1.5"
        >
          {t("login")}
        </Link>
      </p>
    </form>
  );
};

export default RegisterPage;
