// React Hooks
import { useEffect } from "react";

// React Redux
import { useSelector } from "react-redux";

// Icon
import { LogOut, X } from "lucide-react";

// React Router
import { Link, useLocation } from "react-router";

// Translation Hook
import { useTranslation } from "react-i18next";

// Tailwind Merge Library
import { cn } from "../../../../lib/utils";

// Motion Library
import { motion, AnimatePresence } from "motion/react";

// Phenix CRM Logo
import phenixCRMLogo from "../../../../assets/images/dashboard/phenix_logo_dashboard.png";
import { useLogoutMutation } from "../../../auth/authApiSlice";

const DashboardSidebar = ({ isOpen, setIsOpen, sidebarLinks }) => {
  const { t } = useTranslation("dashboard");
  const location = useLocation();
  const { direction } = useSelector((state) => state.ui);
  const isRtl = direction === "rtl";

  // إغلاق القائمة عند الضغط على Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setIsOpen]);

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
    closed: {
      x: isRtl ? "100%" : "-100%",
      opacity: 0,
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
  };

  {
    /* ============= handle Mobile Navigation ============= */
  }
  const handleMobileNavigation = () => {
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    }
  };

  /* ================= Handle Logout ================= */
  const [logout] = useLogoutMutation();
  const handleLogout = async () => {
    logout();
  };

  return (
    <>
      {/* ============= Desktop Sidebar (Fixed) ============= */}
      <aside
        className={cn(
          "hidden lg:flex fixed top-0 h-screen w-80 flex-col p-6 pb-3 z-40",
          "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 shadow-sm",
          isRtl ? "right-0 border-l" : "left-0 border-r",
        )}
        style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
      >
        {/* ============= Phenix CRM Logo ============= */}
        <div className="flex items-center justify-center gap-4 mb-12 px-2">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -3 }}
            className="w-30 h-30 flex items-center justify-center"
          >
            <img src={phenixCRMLogo} alt="phenix-CRM-logo" />
          </motion.div>
        </div>

        {/* ============ SideBar Links ============ */}
        <nav className="custom-scrollbar space-y-2 overflow-y-auto px-4 overflow-x-hidden">
          {sidebarLinks.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                  isActive
                    ? "bg-red-500 text-white shadow-xl shadow-red-500/25 scale-[1.02]"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-red-500 hover:ps-5",
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "transition-transform duration-300",
                    isActive
                      ? "text-white"
                      : "group-hover:scale-110 group-hover:text-red-500",
                  )}
                />
                <span className="font-semibold text-sm">{t(item.label)}</span>

                {/* ============ SideBar Animation ============ */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute -right-1 w-1.5 h-6 rounded-full bg-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ============ Logout Button ============ */}
        <div className="border-t border-gray-400 dark:border-zinc-900 px-3 pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl
         w-full text-slate-500 dark:text-slate-400 hover:text-red-500
          transition-all font-bold text-sm group
           hover:bg-slate-100 dark:hover:bg-white/5 hover:ps-5 cursor-pointer"
          >
            <LogOut
              size={20}
              className="group-hover:scale-110 group-hover:text-red-500 transition-transform duration-300"
            />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>

      {/* ============= Mobile Sidebar (Animated) ============= */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            />

            <motion.aside
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={cn(
                "fixed top-0 h-screen w-70 sm:w-80 p-6 pb-3 z-60 lg:hidden shadow-2xl",
                "bg-white dark:bg-zinc-950 flex flex-col",
                isRtl ? "right-0" : "left-0",
              )}
            >
              {/* Close Button for Mobile */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 inset-e-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 lg:hidden"
              >
                <X size={20} />
              </button>

              {/* ============= Phenix CRM Logo ============= */}
              <div className="flex items-center justify-center gap-4 mb-12 px-2">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -3 }}
                  className="w-30 h-30 flex items-center justify-center"
                >
                  <img src={phenixCRMLogo} alt="phenix-CRM-logo" />
                </motion.div>
              </div>

              {/* ============ SideBar Links ============ */}
              <nav className="custom-scrollbar-mobile space-y-2 overflow-y-auto px-4 overflow-x-hidden">
                {sidebarLinks.map((item) => {
                  const isActive = location.pathname === item.to;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={handleMobileNavigation}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                        isActive
                          ? "bg-red-500 text-white shadow-xl shadow-red-500/25 scale-[1.02]"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-red-500 hover:ps-5",
                      )}
                    >
                      <Icon
                        size={20}
                        className={cn(
                          "transition-transform duration-300",
                          isActive
                            ? "text-white"
                            : "group-hover:scale-110 group-hover:text-red-500",
                        )}
                      />
                      <span className="font-semibold text-sm">
                        {t(item.label)}
                      </span>

                      {/* ============ SideBar Animation ============ */}
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute -right-1 w-1.5 h-6 rounded-full bg-red-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* ============ Logout Button ============ */}
              <div className="px-3 pt-2 border-t border-gray-400 dark:border-zinc-900">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-4 rounded-2xl
         w-full text-slate-500 dark:text-slate-400 hover:text-red-500
          transition-all font-bold text-sm group
           hover:bg-slate-100 dark:hover:bg-white/5 hover:ps-5 cursor-pointer"
                >
                  <LogOut
                    size={20}
                    className="group-hover:scale-110 group-hover:text-red-500 transition-transform duration-300"
                  />
                  <span>{t("logout")}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
