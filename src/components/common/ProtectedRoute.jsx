import { Navigate, Outlet } from "react-router/dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

export default function ProtectedRoute({ allowedRoles }) {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = localStorage.getItem("token");

  // 1. إذا لم يكن مسجلاً أصلاً
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. إذا كان مسجلاً ولكن لم يتم تحميل بيانات المستخدم بعد (حالة Loading)
  if (!user) {
    return <div>جاري التحميل...</div>;
  }

  // 3. إذا كان الدور غير مسموح به
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // إذا كل شيء تمام
  return <Outlet />;
}
