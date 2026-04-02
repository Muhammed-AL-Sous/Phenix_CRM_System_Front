import { ROLES_CONFIG } from "../../../routes/roles.config";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/authSlice";

const DashboardPage = () => {
  const user = useSelector(selectCurrentUser);

  const RoleStatsComponent = ROLES_CONFIG[user.role]?.statsComponent;



  return (
    <>
      <RoleStatsComponent />
    </>
  );
};

export default DashboardPage;
