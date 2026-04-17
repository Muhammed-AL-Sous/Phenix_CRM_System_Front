// ========= React ========= //
import { useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";

// ========= Redux ========= //
import { useSelector, useDispatch } from "react-redux";

// ========= Register Slice ========= //
import { useRegisterMutation } from "../authApiSlice";
import { setCredentials } from "../authSlice";
import { getPostAuthDestination } from "../../../logic/auth/postAuthRedirect";

// ========= External Libraries ========= //
import { notify } from "../../../lib/notify";
import { useTranslation } from "react-i18next";
import { patchClearFieldError } from "../../../lib/patchClearFieldError.js";
import { getRegisterFormErrors } from "../validation/authFormValidators.js";
import { handleDualPasswordFieldToggle } from "../utils/dualPasswordFieldToggle.js";

const useRegisterPageHook = () => {
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

  // ========= Router ========= //
  const navigate = useNavigate();
  const location = useLocation();

  // ========= Redux ========= //
  const { direction } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  // ========= API Mutation ========= //
  const [register, { isLoading }] = useRegisterMutation();

  // ========= Translation ========= //
  const { t } = useTranslation("auth");

  // ========= Validate Register Form ========= //
  const validateRegisterForm = () => {
    const newErrors = getRegisterFormErrors(registerForm);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========= Handle Change Function ========= //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => patchClearFieldError(prev, name));
  };

  // ========= Handle Submit Function ========= //
  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق المحلي أولاً
    const isValid = validateRegisterForm();
    if (!isValid) return; // توقف هنا ولا ترسل للسيرفر

    try {
      const registrationPromise = register(registerForm).unwrap();

      const response = await registrationPromise;

      notify("auth:success.register_success", "success");

      const { user } = response.data;

      const destination = getPostAuthDestination(user, {
        fallbackPath: location.state?.from?.pathname,
      });

      // حساب جديد غير مفعّل: التحقق أولاً (نفس قاعدة postAuthRedirect)
      if (destination === "/verify-email") {
        navigate(destination, {
          replace: true,
          state: {
            email: user.email,
            role: user.role,
            retry_after: user.retry_after,
          },
        });
        return;
      }

      dispatch(setCredentials({ user }));
      navigate(destination, { replace: true });
    } catch (err) {
      console.error("Registration detail error:", err);
      if (err.status === 422) {
        const serverMessage = err.data.message;
        if (serverMessage.includes("already been taken")) {
          setErrors({
            ...errors,
            email: "error.The email has already been taken.",
          });
        } else {
          notify("auth:error.failed_try_again", "error");
        }
      }
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

  // Return all necessary states and handlers
  return {
    showPassword,
    showConfirmPassword,
    registerForm,
    t,
    errors,
    direction,
    isLoading,
    handleChange,
    handleSubmit,
    handleToggle,
    passwordRef,
    passwordConfirmRef,
  };
};

export default useRegisterPageHook;
