// React Hooks
import { Suspense, useState, useLayoutEffect, useEffect } from "react";

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

// Echo Library (تهيئة كسولة — لا WebSocket عند أول سطر من التطبيق)
import getEcho from "../../../../lib/echo";
import { shouldShowBroadcastToast } from "../../../../logic/broadcastNotifyDedupe";
import { notifySonner } from "../../../../lib/notifySonner";
import RouteSuspenseGate from "../../../../routes/RouteSuspenseGate";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const { direction } = useSelector((state) => state.ui);
  const isRtl = direction === "rtl";
  const location = useLocation();
  // حماية من الانهيار: نتحقق من وجود المستخدم والدور قبل الوصول للـ Config
  const roleConfig = user?.role ? ROLES_CONFIG[user.role] : null;
  const sidebarLinks = roleConfig?.sidebar || [];

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      return;
    }

    let cancelled = false;
    let subscribed = false;
    const delayMs = import.meta.env.DEV ? 180 : 0;

    const timer = window.setTimeout(() => {
      if (cancelled) return;

      const echo = getEcho();
      const channel = echo.private(`App.Models.User.${userId}`);

      channel.notification((notification) => {
        if (!shouldShowBroadcastToast(notification)) {
          return;
        }
        notifySonner(notification.message || "إشعار جديد", "success");
      });

      subscribed = true;
    }, delayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (subscribed) {
        getEcho().leave(`private-App.Models.User.${userId}`);
      }
    };
  }, [userId]);

  /* ================= Single Scroll Container (Dashboard) ================= */
  useLayoutEffect(() => {
    // Avoid double scrollbars: let the dashboard <main> be the only scroller.
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  // إذا لم يكن هناك مستخدم، اخرج فوراً
  if (!user) return null;

  const isClientOnboarding =
    user.role === "client" &&
    (location.pathname === "/client/complete-profile" ||
      location.pathname.endsWith("/client/complete-profile"));

  if (isClientOnboarding) {
    return (
      <>
        <div className="h-dvh overflow-hidden bg-slate-50 dark:bg-black flex selection:bg-red-500/30">
          <main className="mesh-gradient no-scroll-anchor flex-1 overflow-y-auto overscroll-contain p-4 md:p-8 lg:p-10">
            <Suspense fallback={<RouteSuspenseGate />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="h-dvh w-full overflow-hidden bg-slate-50 dark:bg-black flex selection:bg-red-500/30">
        {/* ============== Dashboard SideBar ============== */}
        <DashboardSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          sidebarLinks={sidebarLinks}
        />

        {/* ============== Main Content Area ============== */}
        <div
          className={`flex-1 flex flex-col min-w-0 min-h-0 transition-all duration-300 ease-in-out
          ${isRtl ? "lg:mr-80" : "lg:ml-80"}`}
        >
          {/* ============== Dashboard NavBar ============== */}
          <DashboardNavbar toggleSidebar={() => setIsSidebarOpen(true)} />

          {/* ============== Dashboard Content ============== */}
          <main className="mesh-gradient no-scroll-anchor flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-8 lg:p-10 relative overflow-x-hidden">
            {/* ============== Page Transition Animation ============== */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="w-full min-h-0"
              >
                <Suspense fallback={<RouteSuspenseGate />}>
                  <Outlet />
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}
