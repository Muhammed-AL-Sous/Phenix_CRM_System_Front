// ========= React ========= //
import { useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";

// ========= Redux ========= //
import { useSelector, useDispatch } from "react-redux";

// ========= Role Config ========= //
import { getPostAuthDestination } from "../../../logic/auth/postAuthRedirect";

// ========= Login Slice ========= //
import { useLoginMutation } from "../authApiSlice";
import { setCredentials } from "../authSlice";

// ========= External Libraries ========= //
import { useTranslation } from "react-i18next";
import { notify } from "../../../lib/notify";
import { patchClearFieldError } from "../../../lib/patchClearFieldError.js";
import { getLoginFormErrors } from "../validation/authFormValidators.js";

const useLoginPageHook = () => {
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
  const { t } = useTranslation("auth");

  // ========= Redux ========= //
  const { direction } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  // ========= API Mutation ========= //
  const [login, { isLoading }] = useLoginMutation();

  // ========= Validate Login Form ========= //
  const validateLoginForm = () => {
    const newErrors = getLoginFormErrors(loginForm);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========= Handle Change Function ========= //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => patchClearFieldError(prev, name));
  };

  // ========= Handle Submit Function ========= //
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateLoginForm();
    if (!isValid) return; // توقف هنا ولا ترسل للسيرفر

    try {
      const loginPromise = login(loginForm).unwrap();

      const response = await loginPromise;

      notify("auth:success.welcome_back", "success");

      const { user } = response.data;

      dispatch(setCredentials({ user }));

      const destination = getPostAuthDestination(user, {
        fallbackPath: location.state?.from?.pathname,
      });

      navigate(destination, { replace: true });
    } catch (err) {
      console.error("Logging detail error:", err);
      const status = err.status;
      const message = err.data?.message || "";

      const isNotVerified =
        status === 403 || message.toLowerCase().includes("not verified");

      if (isNotVerified) {
        const pendingUser = err.data?.errors?.user;

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

  return {
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
  };
};

export default useLoginPageHook;
