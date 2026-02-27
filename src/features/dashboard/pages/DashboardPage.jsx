import { ROLES_CONFIG } from "../../../routes/roles.config";
// import { useSelector } from "react-redux";

const DashboardPage = () => {
  // const { user } = useSelector((state) => state.auth);

  // const RoleStatsComponent = ROLES_CONFIG[user.role]?.statsComponent;
  const RoleStatsComponent = ROLES_CONFIG["admin"]?.statsComponent;

  return (
    <div>
      <RoleStatsComponent />
    </div>
  );
};

export default DashboardPage;
