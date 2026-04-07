// ========= React ========= //
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";

// ========= Redux ========= //
import { useSelector } from "react-redux";

// ========= Register Slice ========= //
import { useRegisterMutation, useGetCsrfCookieMutation } from "../authApiSlice";

// ========= External Libraries ========= //
import { notify } from "../../../lib/notify";

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

  // ========= Redux ========= //
  const { direction } = useSelector((state) => state.ui);

  // ========= API Mutation ========= //
  const [fetchCsrfCookie, { isLoading: isCsrfLoading }] =
    useGetCsrfCookieMutation();
  const [register, { isLoading }] = useRegisterMutation();

  // ========= Validate Register Form ========= //
  const validateRegisterForm = () => {
    let newErrors = {};

    // Name validation
    if (!registerForm.name.trim()) {
      newErrors.name = "error.name_required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerForm.email.trim()) {
      newErrors.email = "error.email_required";
    } else if (!emailRegex.test(registerForm.email)) {
      newErrors.email = "error.email_invalid";
    }

    // Password validation
    if (!registerForm.password) {
      newErrors.password = "error.password_required";
    } else if (
      registerForm.password.length < 8 ||
      !/[a-zA-Z]/.test(registerForm.password) || // يجب أن تحتوي على حرف
      !/[0-9]/.test(registerForm.password) // يجب أن تحتوي على رقم
    ) {
      newErrors.password = "error.password_length_letter_error";
    }

    // Confirm Password validation
    if (!registerForm.password_confirmation) {
      newErrors.password_confirmation = "error.confirm_password_required";
    } else if (registerForm.password !== registerForm.password_confirmation) {
      newErrors.password_confirmation = "error.passwords_dont_match";
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

  // ========= Handle Submit Function ========= //
  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق المحلي أولاً
    const isValid = validateRegisterForm();
    if (!isValid) return; // توقف هنا ولا ترسل للسيرفر

    try {
      await fetchCsrfCookie().unwrap();

      const registrationPromise = register(registerForm).unwrap();

      const response = await registrationPromise;

      notify("auth:success.register_success", "success");

      const { user } = response.data; // استخراج اليوزر مباشرة

      if (!user.is_active) {
        navigate("/verify-email", {
          state: {
            email: user.email,
            role: user.role,
          },
        });
      }
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

  // Return all necessary states and handlers
  return {
    showPassword,
    showConfirmPassword,
    registerForm,
    errors,
    direction,
    isLoading,
    isCsrfLoading,
    handleChange,
    handleSubmit,
    handleToggle,
    passwordRef,
    passwordConfirmRef,
  };
};

export default useRegisterPageHook;
