// ========= React ========= //
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";

// ======== Auth API Slice & Slice ========= //
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "../authApiSlice";
import { selectCurrentUser, setCredentials } from "../authSlice";

// ======== Role Config ========= //
import { getPostAuthDestination } from "../../../logic/auth/postAuthRedirect";

// ========= External Libraries ========= //
import {
  notifySonner,
  notifySonnerPromise,
  sonnerToast,
} from "../../../lib/notifySonner";
import { useTranslation } from "react-i18next";
import { formatTimeMmSs } from "../../../lib/formatTimeMmSs.js";

const useVerifyEmailPageHook = () => {
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const { direction } = useSelector((state) => state.ui);

  const { t } = useTranslation("auth");

  const [code, setCode] = useState(["", "", "", "", "", ""]);

  // 1. حالة للوقت الحالي (لتجنب استخدام Date.now مباشرة في الرندر)
  const [now, setNow] = useState(() => Date.now());

  // 2. حالة وقت انتهاء الصلاحية
  const [expiry, setExpiry] = useState(() => {
    const saved = localStorage.getItem("otp_expiry");
    const initialNow = Date.now();
    if (saved && parseInt(saved, 10) > initialNow) return parseInt(saved, 10);

    const retryAfter = location.state?.retry_after || user?.retry_after || 0;
    return retryAfter > 0 ? initialNow + retryAfter * 1000 : 0;
  });

  // 3. حساب التايمر بشكل مشتق ونقي (Pure Calculation)
  // الآن هو مجرد طرح قيمتين موجودتين في الـ State
  const timer = useMemo(() => {
    return Math.max(0, Math.ceil((expiry - now) / 1000));
  }, [expiry, now]);

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: resendLoading }] =
    useResendVerificationMutation();

  const canResend = timer <= 0;
  const email = useMemo(
    () => location.state?.email || user?.email || "",
    [location.state, user],
  );
  const updateTimer = useCallback((seconds) => {
    const newNow = Date.now();
    const newExpiry = newNow + seconds * 1000;
    localStorage.setItem("otp_expiry", newExpiry.toString());
    setNow(newNow);
    setExpiry(newExpiry);
  }, []);

  // 4. الـ Effect المسؤول عن تحديث الوقت (Synchronization)
  useEffect(() => {
    if (expiry <= now) return;

    const interval = setInterval(() => {
      const currentTicket = Date.now();
      setNow(currentTicket);

      if (expiry <= currentTicket) {
        localStorage.removeItem("otp_expiry");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiry, now]);

  useEffect(() => {
    if (!email && !isLoading) navigate("/login", { replace: true });
  }, [email, navigate, isLoading]);

  // ================= Input Logic =================
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    // إذا تم إدخال رقم وكان هناك حقل تالي
    if (value !== "" && index < 5) {
      // نستخدم setTimeout لضمان أن الـ React State تحديث
      // وأصبح الحقل التالي غير مقفل (Not Disabled)
      setTimeout(() => {
        if (inputsRef.current[index + 1]) {
          inputsRef.current[index + 1].focus();
        }
      }, 10);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(paste)) return;
    const newCode = paste.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);
    const lastIdx = Math.min(paste.length, 5);
    inputsRef.current[lastIdx]?.focus();
    if (paste.length === 6) submitCode(paste.join ? paste.join("") : paste);
  };

  const submitCode = async (finalCode) => {
    const codeString = Array.isArray(finalCode)
      ? finalCode.join("")
      : finalCode;
    if (codeString.length !== 6 || isLoading) return;

    try {
      const response = await verifyEmail({ email, code: codeString }).unwrap();
      localStorage.removeItem("otp_expiry");
      notifySonner("auth:success.Email_verified_successfully", "success");
      if (response.data?.user) {
        dispatch(setCredentials({ user: response.data.user }));
      }
      const verifiedUser = response.data?.user;
      if (verifiedUser) {
        navigate(getPostAuthDestination(verifiedUser), { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      if (err.status === 429) {
        updateTimer(err.data?.errors?.retry_after || 60);
      } else {
        notifySonner(
          "auth:error." + (err.data?.message || "Verification failed"),
          "error",
        );
        setCode(["", "", "", "", "", ""]);
        inputsRef.current?.focus();
      }
    }
  };

  const handleResend = async () => {
    if (!canResend || resendLoading) return;
    try {
      const promise = resendVerification({ email }).unwrap();
      notifySonnerPromise(promise, {
        loading: "auth:loading.The verification code is being resent",
        success: "auth:success.Code resent successfully",
      });
      const response = await promise;
      updateTimer(response?.data?.user?.retry_after ?? 60);
    } catch (err) {
      if (err.status === 429) updateTimer(err.data?.errors?.retry_after || 60);
      sonnerToast.error(err.data?.message || "Resend failed");
    }
  };

  return {
    code,
    email,
    t,
    isLoading,
    direction,
    inputsRef,
    handleChange,
    handleKeyDown,
    handlePaste,
    submitCode,
    canResend,
    resendLoading,
    handleResend,
    timer,
    formatTime: formatTimeMmSs,
  };
};

export default useVerifyEmailPageHook;
