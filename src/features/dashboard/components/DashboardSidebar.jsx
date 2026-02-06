import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/authSlice";

const DashboardSidebar = () => {
  const user = useSelector(selectCurrentUser); // نجلب المستخدم من الـ Auth Slice
  return (
    <div>
      {user.role === "admin" && <Link to="/settings">إعدادات النظام</Link>}
      {user.role === "customer" && <Link to="/my-orders">طلباتي</Link>}
    </div>
  );
};

export default DashboardSidebar;
