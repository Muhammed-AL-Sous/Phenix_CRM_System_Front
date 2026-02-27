// React Redux
import { useSelector } from "react-redux";

// Auth Slice
// import { selectCurrentUser } from "../../../auth/authSlice";

// React Router
import { Outlet, useLocation } from "react-router";

// Roles Config
import { ROLES_CONFIG } from "../../../../routes/roles.config";

// Components
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavBar";

import { motion, AnimatePresence } from "motion/react";

export default function DashboardLayout() {
  const location = useLocation();
  // const user = useSelector(selectCurrentUser);
  const user = "admin";
  // const sidebarLinks = ROLES_CONFIG[user.role].sidebar;
  const sidebarLinks = ROLES_CONFIG[user].sidebar;
  const { lang } = useSelector((state) => state.ui);
  if (!user) return null; // حماية إضافية

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-black
     flex selection:bg-red-500/30"
    >
      {/* ============== Dashboard SideBar ============== */}
      <DashboardSidebar sidebarLinks={sidebarLinks} lang={lang} />

      <main className="flex-1 flex flex-col min-w-0">
        {/* ============== Dashboard NavBar ============== */}
        <DashboardNavbar />

        {/* ============== Dashboard Content ============== */}
        <section className="p-10 overflow-y-auto mesh-gradient flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
