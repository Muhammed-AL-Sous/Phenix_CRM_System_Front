import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectAuthReady,
} from "../../features/auth/authSlice";
import GlobalLoader from "./GlobalLoader";

export default function ProtectedRoute({ allowedRoles }) {
  const user = useSelector(selectCurrentUser);
  const authReady = useSelector(selectAuthReady);
  const location = useLocation();

  if (!authReady) {
    return <GlobalLoader />;
  }

  if (!user) {
    // إذا لم يكن هناك مستخدم، نرسله للوجن ونحفظ مكانه الحالي ليعود إليه لاحقاً
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if (!user.is_active) {
  //   return <Navigate to="/verify-email" replace />;
  // }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  const onClientOnboarding =
    location.pathname === "/client/complete-profile" ||
    location.pathname.endsWith("/client/complete-profile");

  if (
    user.role === "client" &&
    user.requires_client_profile === true &&
    !onClientOnboarding
  ) {
    return <Navigate to="/client/complete-profile" replace />;
  }

  return <Outlet />;
}
