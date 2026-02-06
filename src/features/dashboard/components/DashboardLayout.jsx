import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/authSlice";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  const user = useSelector(selectCurrentUser); // نجلب المستخدم من الـ Auth Slice

  return (
    <div className="flex">
      <Sidebar role={user.role} /> 
      <main>
        <header>مرحباً {user.name}</header>
        {children}
      </main>
    </div>
  );
}