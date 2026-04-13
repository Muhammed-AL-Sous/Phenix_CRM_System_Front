import { Spinner } from "../../../components/common/GlobalLoader";

// ================= Hook Logic =================
import useVerifyEmailPageHook from "../hooks/useVerifyEmailPageHook";

const VerifyEmailPage = () => {
  const {
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
    formatTime,
  } = useVerifyEmailPageHook();

  return (
    <div className="flex items-center justify-center">
      <div className="px-8 py-0 rounded-2xl w-full max-w-md text-center">
        <p
          className="text-slate-600 dark:text-slate-400 mb-6 text-sm font-semibold"
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}
        >
          <span>{email}</span>
          <span className="block mt-2 text-red-600 text-xs">
            {t("code.It expires in 10 minutes.")}
          </span>
        </p>

        <div
          className="flex justify-between gap-2 mb-6"
          style={{ direction: "ltr" }}
        >
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              ref={(el) => (inputsRef.current[index] = el)}
              value={digit}
              disabled={isLoading || (index > 0 && !code[index - 1])}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-2xl dark:text-white text-gray-700 font-bold border-2 rounded-xl border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-600 outline-none transition-all disabled:bg-gray-300 dark:disabled:bg-zinc-900"
            />
          ))}
        </div>

        <button
          onClick={() => submitCode(code)}
          disabled={code.includes("") || isLoading}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 transition-all disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <Spinner
              size="sm"
              variant="onPrimary"
              className="cursor-not-allowed"
            />
          ) : (
            t("email.Verify Account")
          )}
        </button>

        <div className="mt-6 text-sm">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-red-600 font-bold"
            >
              {resendLoading ? (
                <span className="cursor-not-allowed">
                  {t("loading.Sending code")}
                </span>
              ) : (
                <span className="cursor-pointer hover:underline">
                  {t("code.Resend Verification Code")}
                </span>
              )}
            </button>
          ) : (
            <p className="text-gray-500 font-bold">
              {t("code.Resend available after")}{" "}
              <span className="text-red-500 font-mono text-lg ps-1">
                {formatTime(timer)}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
