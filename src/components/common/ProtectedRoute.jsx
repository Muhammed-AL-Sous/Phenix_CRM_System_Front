import { Navigate, Outlet } from "react-router/dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

export default function ProtectedRoute({ allowedRoles }) {
  const user = useSelector(selectCurrentUser);
  // هنا نضع شرط التأكد من المستخدم (مثلاً وجود Token في LocalStorage)
  const isAuthenticated = localStorage.getItem("token");

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  if (!isAuthenticated) {
    // التوجيه لصفحة تسجيل الدخول مع منع المستخدم من العودة للخلف (replace)
    return <Navigate to="/login" replace />;
  }

  // إذا كان المستخدم مسجلاً، اعرض المحتوى المطلوب (الأبناء)
  return <Outlet />;
}
