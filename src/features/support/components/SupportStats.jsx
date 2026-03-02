// Translation Hook
import { useTranslation } from "react-i18next";

// React Redux
import { useDispatch, useSelector } from "react-redux";

const SupportStats = () => {
  const { t } = useTranslation(["dashboard"]);
  const { direction } = useSelector((state) => state.ui);
  return (
    <div style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
        {t("support_dashboard")}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
        {t("Helping_customers_succeed_one_ticket_at_a_time")}
      </p>
    </div>
  );
};

export default SupportStats;
