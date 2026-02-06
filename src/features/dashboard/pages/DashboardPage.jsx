import AdminStats from "./AdminStats";
import SupportStats from "./SupportStats";
import CustomerStats from "./CustomerStats";
import { useSelector } from "react-redux";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="dashboard-container">
      <h1>لوحة التحكم - أهلاً {user.name}</h1>

      {/* هنا السحر: نعرض المكون بناءً على الرتبة القادمة من Laravel */}
      <div className="stats-grid">
        {user.role === "admin" && <AdminStats />}
        {user.role === "support" && <SupportStats />}
        {user.role === "customer" && <CustomerStats />}
      </div>

      {/* هنا مكونات مشتركة يراها الجميع مثل التقويم أو المهام */}
      {/* <SharedCalendar /> */}
    </div>
  );
};

export default DashboardPage;
