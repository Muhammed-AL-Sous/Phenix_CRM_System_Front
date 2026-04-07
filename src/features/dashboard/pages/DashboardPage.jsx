import { Suspense } from "react";
import { useSelector } from "react-redux";
import { ROLES_CONFIG } from "../../../routes/roles.config";
import { selectCurrentUser } from "../../auth/authSlice";
import { RouteSuspenseFallback } from "../../../components/common/GlobalLoader";

const DashboardPage = () => {
  const user = useSelector(selectCurrentUser);

  const RoleStatsComponent = ROLES_CONFIG[user.role]?.statsComponent;

  if (!RoleStatsComponent) {
    return null;
  }

  return (
    <Suspense fallback={<RouteSuspenseFallback className="min-h-[50vh]" />}>
      <RoleStatsComponent />
    </Suspense>
  );
};

export default DashboardPage;
