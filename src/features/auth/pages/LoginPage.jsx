// Translation Hook
import { useTranslation } from "react-i18next";

// React Router
import { Link } from "react-router";

// Auth Layout Component
import AuthLayout from "../components/layout/AuthLayout";

// React Redux
import { useSelector } from "react-redux";

const LoginPage = () => {
  const { t } = useTranslation(["common"]);
  const { direction } = useSelector((state) => state.ui);
  return (
    <AuthLayout title={t("login")} subtitle={t("welcome")}>
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            style={{
              fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
            }}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            {t("email")}
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
            placeholder="name@company.com"
            style={{
              fontFamily: "Livvic",
              fontWeight: "500",
            }}
          />
        </div>
        <div>
          <label
            style={{
              fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
            }}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            {t("password")}
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
            placeholder="••••••••"
          />
        </div>
        <button
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
          }}
          className="w-full py-3 bg-red-500 hover:bg-red-600 duration-300 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all transform active:scale-[0.98] cursor-pointer"
        >
          {t("login")}
        </button>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {t("dont_have_account")}{" "}
          <Link
            to="/register"
            className="text-red-500 hover:text-red-600 transition-all duration-200 font-bold hover:underline ms-1.5"
          >
            {t("register")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
