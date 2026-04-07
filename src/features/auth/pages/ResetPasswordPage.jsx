// ========= React ========= //
import { useCallback, useRef, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router";

// ========= Redux ========= //
import { useSelector, useDispatch } from "react-redux";

// ========= Role Config ========= //
import { ROLES_CONFIG } from "../../../routes/roles.config";

// ========= Reset Password Slice ========= //
import {
  useResetPasswordMutation,
  useGetCsrfCookieMutation,
} from "../authApiSlice";
import { setCredentials } from "../authSlice";

// ========= External Libraries ========= //
import { useTranslation } from "react-i18next";
import { notify } from "../../../lib/notify";

// ========= Icons ========= //
import { Eye, EyeOff, Mail, Lock, LockKeyhole } from "lucide-react";

import { Spinner } from "../../../components/common/GlobalLoader";

const ResetPasswordPage = () => {
  // ========= Router ========= //
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ========= States ========= //
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetPasswordForm, setResetPasswordForm] = useState({
    email: searchParams.get("email") || "",
    token: searchParams.get("token") || "",
    password: "",
    password_confirmation: "",
  });

  // ========= Refs ========= //
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  // ========= Translation ========= //
  const { t } = useTranslation(["auth"]);

  // ========= Redux ========= //
  const { direction } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  // ========= RTK Query Hooks ========= //
  const [fetchCsrfCookie, { isLoading: isCsrfLoading }] =
    useGetCsrfCookieMutation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // ========= Validate Reset Password Form ========= //
  const validateResetPassForm = () => {
    let newErrors = {};

    // Password validation
    if (!resetPasswordForm.password) {
      newErrors.password = "error.password_required";
    } else if (
      resetPasswordForm.password.length < 8 ||
      !/[a-zA-Z]/.test(resetPasswordForm.password) || // يجب أن تحتوي على حرف
      !/[0-9]/.test(resetPasswordForm.password) // يجب أن تحتوي على رقم
    ) {
      newErrors.password = "error.password_length_letter_error";
    }

    // Confirm Password validation
    if (!resetPasswordForm.password_confirmation) {
      newErrors.password_confirmation = "error.confirm_password_required";
    } else if (
      resetPasswordForm.password !== resetPasswordForm.password_confirmation
    ) {
      newErrors.password_confirmation = "error.passwords_dont_match";
    }

    setErrors(newErrors);
    // إذا كان كائن الأخطاء فارغاً، فهذا يعني أن البيانات صالحة
    return Object.keys(newErrors).length === 0;
  };

  // ========= Handle Change Function ========= //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordForm((prev) => ({ ...prev, [name]: value }));

    // مسح الخطأ الخاص بهذا الحقل فقط عند الكتابة
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // ========= Handle Submit Function ========= //
  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق المحلي أولاً
    const isValid = validateResetPassForm();
    if (!isValid) return; // توقف هنا ولا ترسل للسيرفر

    try {
      await fetchCsrfCookie().unwrap();

      const resetPassPromise = resetPassword(resetPasswordForm).unwrap();

      const response = await resetPassPromise;

      notify(
        "auth:success.The password has been successfully changed",
        "success",
      );

      const { user } = response.data; // استخراج اليوزر مباشرة
      dispatch(setCredentials({ user }));

      const rolePrefix = ROLES_CONFIG[user.role]?.prefix || "";

      const origin = location.state?.from?.pathname || `/${rolePrefix}`;

      setTimeout(() => navigate(origin, { replace: true }), 2000);
    } catch (err) {
      notify(err.data.message, "error");
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

        {/* ======= Input Email ======= */}
        <input
          type="email"
          name="email"
          style={{
            fontFamily: "Livvic",
            fontWeight: "500",
          }}
          value={resetPasswordForm.email}
          readOnly
          disabled
          className={`w-full px-4 py-3 rounded-xl text-slate-700 bg-gray-300 dark:bg-zinc-900 border border-gray-300 dark:border-transparent outline-none transition-all dark:text-white focus:ring-2`}
        />
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
            name="password"
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            style={{
              fontFamily: "Livvic",
              fontWeight: "500",
              letterSpacing:
                !showPassword && resetPasswordForm.password.length > 0
                  ? "0.2em"
                  : "normal",
            }}
            value={resetPasswordForm.password}
            onChange={handleChange}
            dir={resetPasswordForm.password.length > 0 ? "ltr" : "inherit"}
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
          {t("password.Confirm_password")}
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
                resetPasswordForm.password_confirmation.length > 0
                  ? "0.2em"
                  : "normal",
            }}
            value={resetPasswordForm.password_confirmation}
            onChange={handleChange}
            dir={
              resetPasswordForm.password_confirmation.length > 0
                ? "ltr"
                : "inherit"
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
                className="text-red-500 text-xs font-semibold px-1"
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

      {/* ======= Reset Password Button ======= */}
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
            <Spinner size="sm" variant="onPrimary" />
          </span>
        ) : (
          t("common.Confirm")
        )}
      </button>
    </form>
  );
};

export default ResetPasswordPage;
