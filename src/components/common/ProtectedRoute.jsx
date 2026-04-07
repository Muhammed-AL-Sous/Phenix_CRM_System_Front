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

  // 🛡️ إضافة شرط التحقق من الإيميل
  // if (!user.is_active) {
  //   return <Navigate to="/verify-email" replace />;
  // }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
