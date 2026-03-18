import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { ROLES_CONFIG } from "../routes/roles.config";

export default function GuestRoute() {
  const user = useSelector(selectCurrentUser);

  // الحالة الوحيدة التي نمنع فيها المستخدم من رؤية صفحات
  // (Login/Register/Verify):
  // هي أن يكون مسجل دخول "ومفعّل"
  // (is_active: true)
  if (user && user.is_active) {
    const rolePrefix = ROLES_CONFIG[user.role]?.prefix || "";
    return <Navigate to={`/${rolePrefix}`} replace />;
  }

  // في حال كان:
  // 1. لا يوجد يوزر (Guest حقيقي) -> يرى Login/Register
  // 2. يوجد يوزر لكن is_active: false -> يرى صفحة Verify-Email
  return <Outlet />;
}
