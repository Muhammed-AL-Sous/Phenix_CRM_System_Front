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
import { patchClearFieldError } from "../../../lib/patchClearFieldError.js";
import { getResetPasswordFormErrors } from "../validation/authFormValidators.js";
import { handleDualPasswordFieldToggle } from "../utils/dualPasswordFieldToggle.js";

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
    const newErrors = getResetPasswordFormErrors(resetPasswordForm);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========= Handle Change Function ========= //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => patchClearFieldError(prev, name));
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
  const handleToggle = useCallback(
    (e, type) =>
      handleDualPasswordFieldToggle(e, type, {
        passwordRef,
        passwordConfirmRef,
        setShowPassword,
        setShowConfirmPassword,
      }),
    [],
  );

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
