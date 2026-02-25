// React Hook
import { useState } from "react";

// Translation Hook
import { useTranslation } from "react-i18next";

// React Redux
import { useSelector } from "react-redux";

// Icons
import { Mail } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { t } = useTranslation(["common"]);
  const { direction } = useSelector((state) => state.ui);

  const handleSubmit = () => {};

  return (
    <form onSubmit={handleSubmit}>
      {/* ============= Email ============= */}
      <div>
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
          placeholder="name@company.com"
          style={{
            fontFamily: "Livvic",
            fontWeight: "500",
          }}
        />
      </div>

      {/* ============= Continue Button ============= */}
      <button
        style={{
          fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
        }}
        className="w-full py-3 my-6 bg-red-500 hover:bg-red-600 duration-300 text-white font-bold rounded-3xl shadow-lg shadow-red-500/30 transition-all transform active:scale-[0.98] cursor-pointer"
      >
        {t("continue")}
      </button>
    </form>
  );
};

export default ForgotPasswordPage;
