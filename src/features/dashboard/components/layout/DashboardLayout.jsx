// React Hooks
import { useState, useLayoutEffect } from "react";

// React Redux
import { useSelector } from "react-redux";

// Auth Slice
import { selectCurrentUser } from "../../../auth/authSlice";

// React Router
import { Outlet, useLocation } from "react-router";

// Roles Config
import { ROLES_CONFIG } from "../../../../routes/roles.config";

// Components
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";

import { motion, AnimatePresence } from "motion/react";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const { direction } = useSelector((state) => state.ui);
  const isRtl = direction === "rtl";

  const sidebarLinks = ROLES_CONFIG[user.role].sidebar;
  // const sidebarLinks = ROLES_CONFIG["admin"].sidebar;
  const location = useLocation();

  /* ================= Lock Body Scroll ================= */
  useLayoutEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isSidebarOpen]);

  // if (!user) return null; // حماية إضافية

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-black
     flex selection:bg-red-500/30"
    >
      {/* ============== Dashboard SideBar ============== */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        sidebarLinks={sidebarLinks}
      />

      {/* ============== Main Content Area ============== */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out
          ${isRtl ? "lg:mr-80" : "lg:ml-80"}`}
      >
        {/* ============== Dashboard NavBar ============== */}
        <DashboardNavbar toggleSidebar={() => setIsSidebarOpen(true)} />

        {/* ============== Dashboard Content ============== */}
        <main className="overflow-y-auto mesh-gradient flex-1 p-4 md:p-8 lg:p-10 relative overflow-x-hidden">
          {/* ============== Page Transition Animation ============== */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
