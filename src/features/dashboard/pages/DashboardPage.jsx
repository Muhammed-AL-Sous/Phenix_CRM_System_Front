import { ROLES_CONFIG } from "../../../routes/roles.config";
import { useSelector } from "react-redux";
import { useGetDashboardStatsQuery } from "../../users/usersApiSlice";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) return <p>جاري تحميل بيانات الداشبورد...</p>;

  // const RoleStatsComponent = ROLES_CONFIG[user.role]?.statsComponent;
  const RoleStatsComponent = ROLES_CONFIG["admin"]?.statsComponent;

  return (
    <div>
      <RoleStatsComponent />
    </div>
  );
};

export default DashboardPage;
