// Translation Hook
import { useTranslation } from "react-i18next";

// React Redux
import { useDispatch, useSelector } from "react-redux";

const ClientStats = () => {
  const { t } = useTranslation(["dashboard"]);
  const { direction } = useSelector((state) => state.ui);

  return (
    <div style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
        {t("client_dashboard")}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
        {t("Manage_your_account_and_support_requests")}
      </p>
    </div>
  );
};

export default ClientStats;
