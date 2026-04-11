import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { getPostAuthDestination } from "../logic/auth/postAuthRedirect";

export default function GuestRoute() {
  const user = useSelector(selectCurrentUser);

  if (user && user.is_active) {
    return <Navigate to={getPostAuthDestination(user)} replace />;
  }

  return <Outlet />;
}
