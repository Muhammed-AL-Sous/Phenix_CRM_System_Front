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
import { useEffect } from "react";
import echo from "../../../../lib/Echo";
import { notify } from "../../../../lib/notify";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const { direction } = useSelector((state) => state.ui);
  const isRtl = direction === "rtl";
  const location = useLocation();
  // حماية من الانهيار: نتحقق من وجود المستخدم والدور قبل الوصول للـ Config
  const roleConfig = user?.role ? ROLES_CONFIG[user.role] : null;
  const sidebarLinks = roleConfig?.sidebar || [];

  useEffect(() => {
    if (!user?.id) return; // لا تستمع إذا لم يكن هناك مستخدم

    const channel = echo.private(`user.${user.id}`);

    channel
      .subscribed(() => {
        console.log("✅ Subscribed to private user channel");
      })
      .listen("UserRegistered", (e) => {
        console.log("🔥 EVENT RECEIVED", e);
        // ملاحظة: لا داعي لاستخدام userName من الـ Event إذا كان المستخدم هو نفسه
        notify(`Welcome back ${e.userName}!`, "success");
      })
      .error((error) => {
        console.error("Channel Error:", error);
      });

    // تنظيف عند خروج المستخدم أو إغلاق الصفحة
    return () => {
      echo.leaveChannel(`private-user.${user.id}`);
    };
  }, [user?.id]); // الاعتماد على تغير الـ ID فقط

  /* ================= Lock Body Scroll ================= */
  useLayoutEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isSidebarOpen]);

  // إذا لم يكن هناك مستخدم، اخرج فوراً
  if (!user) return null;

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
