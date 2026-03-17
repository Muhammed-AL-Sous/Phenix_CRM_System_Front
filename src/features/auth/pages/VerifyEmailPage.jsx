import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "../api/apiSlice";
import { useDispatch } from "react-redux";
import { notify, notifyPromise } from "../../../lib/notify";
import { ROLES_CONFIG } from "../../../routes/roles.config";

const VerifyEmailPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputsRef = useRef([]);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  // RTK Query Hooks
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: resendLoading }] =
    useResendVerificationMutation();

  // ===================== INPUT =====================
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    if (newCode.every((d) => d !== "")) {
      submitCode(newCode.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^[0-9]+$/.test(paste)) return;

    const newCode = paste.split("");
    setCode(newCode);
    inputsRef.current[5].focus();

    submitCode(paste);
  };

  // ===================== VERIFY =====================
  const submitCode = async (finalCode) => {
    setError("");

    try {
      const verifyEmailPromise = verifyEmail({
        email,
        code: finalCode,
      }).unwrap();

      notifyPromise(verifyEmailPromise, {
        loading: "auth:auth.email.Account_is_being_verified",
        success: "auth:auth.email.Email_verified_successfully",
      });

      const response = await verifyEmailPromise;

      // 2. التوجيه للداشبورد (بناءً على دوره)
      const rolePrefix = ROLES_CONFIG[response.data.user.role].prefix;

      navigate(`/${rolePrefix}`, { replace: true });
    } catch (err) {
      notify(err.data?.message || "Verification failed", "error");
      const retryAfter = err?.data?.retry_after;

      if (retryAfter) {
        setTimer(retryAfter);
        setCanResend(false);
      }

      setError(err?.data?.message || "Verification failed");

      setCode(["", "", "", "", "", ""]);
      inputsRef.current[0].focus();
    }
  };

  // ===================== RESEND =====================
  const handleResend = async () => {
    try {
      const resendVerifyPromise = resendVerification({ email }).unwrap();

      notifyPromise(resendVerifyPromise, {
        loading: "auth:auth.email.The verification code is being resent",
        success: "auth:auth.email.Code resent successfully",
      });

      await resendVerifyPromise;

      // إذا نجح → نعيد ضبط timer (يفضل ترجع من الباك أيضاً)
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      const retryAfter = err?.data?.retry_after;

      if (retryAfter) {
        setTimer(retryAfter);
        setCanResend(false);
      }

      setError(err?.data?.message || "Resend failed");
    }
  };

  // ===================== TIMER =====================
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ===================== UI =====================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-gray-500 mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-between gap-2 mb-4">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={() => submitCode(code.join(""))}
          disabled={code.some((d) => d === "") || isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>

        <div className="mt-4 text-sm text-gray-500">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-blue-600 disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Resend Code"}
            </button>
          ) : (
            <p>Resend available in {timer}s</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
