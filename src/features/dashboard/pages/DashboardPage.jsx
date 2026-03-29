import { ROLES_CONFIG } from "../../../routes/roles.config";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import echo from "../../../lib/Echo";
import { selectCurrentUser } from "../../auth/authSlice";
import { notify } from "../../../lib/notify";

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
