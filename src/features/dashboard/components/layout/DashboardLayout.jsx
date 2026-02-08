import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../auth/authSlice";
import DashboardSidebar from "./DashboardSidebar";
import { Outlet } from "react-router";
import { ROLES_CONFIG } from "../../../../routes/roles.config";
import DashboardNavbar from "./DashboardNavbar";

export default function DashboardLayout() {
  const user = useSelector(selectCurrentUser);
  const sidebarLinks = ROLES_CONFIG[user.role].sidebar;
  const { darkMode, language } = useSelector((state) => state.settings);

  if (!user) return null; // حماية إضافية

  return (
    <div
      className={`${darkMode ? "dark bg-gray-900" : "bg-white"} min-h-screen flex`}
    >
      <DashboardSidebar sidebarLinks={sidebarLinks} lang={language} />

      {/* المحتوى الرئيسي */}
      <main className="flex-1 overflow-y-auto">
        <DashboardNavbar />
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <span className="font-semibold">
            أهلاً بك، {user.name} ({user.role})
          </span>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
            {user.name.charAt(0)}
          </div>
        </header>

        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
