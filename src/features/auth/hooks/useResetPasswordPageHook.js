// ========= React ========= //
import { useCallback, useRef, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router";

// ========= Redux ========= //
import { useSelector, useDispatch } from "react-redux";

// ========= Role Config ========= //
import { getPostAuthDestination } from "../../../logic/auth/postAuthRedirect";

// ========= Reset Password Slice ========= //
import { useResetPasswordMutation } from "../authApiSlice";
import { setCredentials } from "../authSlice";

// ========= External Libraries ========= //
import { useTranslation } from "react-i18next";
import { notify } from "../../../lib/notify";

const useResetPasswordPageHook = () => {
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
  const { t } = useTranslation("auth");

  // ========= Redux ========= //
  const { direction } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  // ========= RTK Query Hooks ========= //
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
      const resetPassPromise = resetPassword(resetPasswordForm).unwrap();

      const response = await resetPassPromise;

      notify(
        "auth:success.The password has been successfully changed",
        "success",
      );

      const { user } = response.data;
      dispatch(setCredentials({ user }));

      const destination = getPostAuthDestination(user, {
        fallbackPath: location.state?.from?.pathname,
      });

      setTimeout(() => navigate(destination, { replace: true }), 2000);
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

  return {
    showPassword,
    showConfirmPassword,
    errors,
    resetPasswordForm,
    passwordRef,
    passwordConfirmRef,
    isLoading,
    handleChange,
    handleSubmit,
    handleToggle,
    t,
    direction,
  };
};

export default useResetPasswordPageHook;
