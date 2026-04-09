// Translation Hook
import { useTranslation } from "react-i18next";

// React Redux
import { useSelector } from "react-redux";

const AdminStats = () => {
  const { t } = useTranslation("dashboard");
  const { direction } = useSelector((state) => state.ui);
  return (
    <div style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}>
      <h1 className="pt-2 text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t("admin_dashboard")}</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
        {t("Welcome_back_here's_what's_happening_today.")}
      </p>
    </div>
  );
};

export default AdminStats;
