// React Hooks
import { useEffect, useMemo, useState } from "react";

// React Redux
import { useSelector } from "react-redux";

// Icon
import { ChevronDown, LogOut, X } from "lucide-react";

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

  const defaultOpenGroups = useMemo(() => {
    const pathname = location.pathname;
    const open = {};
    (sidebarLinks || []).forEach((item) => {
      if (!item?.children?.length) return;
      const groupKey = item.key || item.to || item.label;
      open[groupKey] = item.children.some((c) => pathname === c.to);
    });
    return open;
  }, [location.pathname, sidebarLinks]);

  // Only stores explicit user toggles. If a group hasn't been toggled yet,
  // we fall back to `defaultOpenGroups` (derived from current route).
  const [openGroups, setOpenGroups] = useState({});

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

  const renderLinks = ({ isMobile }) => {
    return (sidebarLinks || []).map((item) => {
      const Icon = item.icon;
      const hasChildren =
        Array.isArray(item.children) && item.children.length > 0;
      const isActiveDirect = location.pathname === item.to;
      const isActiveChild = hasChildren
        ? item.children.some((c) => location.pathname === c.to)
        : false;
      const isActive = isActiveDirect || isActiveChild;

      if (!hasChildren) {
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={isMobile ? handleMobileNavigation : undefined}
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

            {isActive && (
              <motion.div
                layoutId={
                  isMobile ? "active-indicator-mobile" : "active-indicator"
                }
                className="absolute -right-1 w-1.5 h-6 rounded-full bg-red-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </Link>
        );
      }

      const groupKey = item.key || item.to || item.label;
      const isOpenGroup = Object.prototype.hasOwnProperty.call(
        openGroups,
        groupKey,
      )
        ? !!openGroups[groupKey]
        : !!defaultOpenGroups[groupKey];
      const toggleGroup = () =>
        setOpenGroups((prev) => ({
          ...prev,
          [groupKey]: Object.prototype.hasOwnProperty.call(prev, groupKey)
            ? !prev[groupKey]
            : !defaultOpenGroups[groupKey],
        }));

      return (
        <div key={groupKey} className="space-y-2">
          <button
            type="button"
            onClick={toggleGroup}
            className={cn(
              "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative text-start",
              isActive
                ? "bg-red-500 text-white shadow-xl shadow-red-500/25 scale-[1.02]"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-red-500",
            )}
          >
            <span className="flex items-center gap-3 min-w-0">
              <Icon
                size={20}
                className={cn(
                  "transition-transform duration-300 shrink-0",
                  isActive
                    ? "text-white"
                    : "group-hover:scale-110 group-hover:text-red-500",
                )}
              />
              <span className="font-semibold text-sm truncate">
                {t(item.label)}
              </span>
            </span>

            <ChevronDown
              size={18}
              className={cn(
                "transition-transform duration-200 shrink-0",
                isOpenGroup ? "rotate-180" : "rotate-0",
                isActive ? "text-white" : "group-hover:text-red-500",
              )}
            />
          </button>

          <AnimatePresence initial={false}>
            {isOpenGroup && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-2 ps-6">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon || Icon;
                    const isChildActive = location.pathname === child.to;
                    return (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={isMobile ? handleMobileNavigation : undefined}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 group relative",
                          isChildActive
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-red-500",
                        )}
                      >
                        <ChildIcon
                          size={18}
                          className={cn(
                            "transition-transform duration-300",
                            isChildActive
                              ? "text-red-600 dark:text-red-400"
                              : "group-hover:scale-110 group-hover:text-red-500",
                          )}
                        />
                        <span className="font-semibold text-sm">
                          {t(child.label)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
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
          {renderLinks({ isMobile: false })}
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
                {renderLinks({ isMobile: true })}
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
