import { ROLES_CONFIG } from "../../../routes/roles.config";
import { useSelector } from "react-redux";
import { useGetDashboardStatsQuery } from "../../users/usersApiSlice";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) return <p>جاري تحميل بيانات الداشبورد...</p>;

  const RoleStatsComponent = ROLES_CONFIG[user.role]?.statsComponent;

  return (
    <div className="dashboard-container">
      <h1>لوحة التحكم - أهلاً {user.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* عرض البيانات القادمة من Laravel بناءً على الرتبة */}
        <div className="bg-white p-6 rounded shadow">
          <h3>إجمالي العمليات</h3>
          <p className="text-2xl font-bold">{stats.total_count}</p>
        </div>
        {/* ... مربعات أخرى ... */}
      </div>

      {/* هنا السحر: نعرض المكون بناءً على الرتبة القادمة من Laravel */}
      <div className="stats-grid">
        {RoleStatsComponent && <RoleStatsComponent />}
      </div>

      {/* هنا مكونات مشتركة يراها الجميع مثل التقويم أو المهام */}
      {/* <SharedCalendar /> */}
    </div>
  );
};

export default DashboardPage;
