import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { ROLES_CONFIG } from "../routes/roles.config";

export default function GuestRoute() {
  const user = useSelector(selectCurrentUser);

  if (user) {
    // إذا كان مسجل دخول، وجهه فوراً للداش بورد بناءً على دوره
    const rolePrefix = ROLES_CONFIG[user.role]?.prefix || "";

    return <Navigate to={`/${rolePrefix}`} replace />;
  }

  // إذا لم يكن مسجل دخول، اسمح له برؤية صفحات (Login/Register)
  return <Outlet />;
}
