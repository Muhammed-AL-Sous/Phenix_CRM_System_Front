// React Redux
import { useSelector } from "react-redux";

// Auth Slice
// import { selectCurrentUser } from "../../../auth/authSlice";

// React Router
import { Outlet } from "react-router";

// Roles Config
import { ROLES_CONFIG } from "../../../../routes/roles.config";

// Components
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";

export default function DashboardLayout() {
  // const user = useSelector(selectCurrentUser);
  const user = "admin";
  // const sidebarLinks = ROLES_CONFIG[user.role].sidebar;
  const sidebarLinks = ROLES_CONFIG[user].sidebar;
  const { mode, lang } = useSelector((state) => state.ui);
  if (!user) return null; // حماية إضافية

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-black
     flex selection:bg-red-500/30"
    >
      {/* ============== Dashboard SideBar ============== */}
      <DashboardSidebar sidebarLinks={sidebarLinks} lang={lang} />

      <main className="flex-1 overflow-y-auto">
        {/* ============== Dashboard NavBar ============== */}
        <DashboardNavbar />

        <section className="p-6">
          {/* ============== Dashboard Content ============== */}
          <Outlet />
        </section>
      </main>
    </div>
  );
}
