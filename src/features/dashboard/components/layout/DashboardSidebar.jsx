// React Redux
import { useDispatch, useSelector } from "react-redux";

// Auth Slice
import { logOut } from "../../../auth/authSlice";

// Icon
import { LogOut } from "lucide-react";

// React Router
import { Link, useLocation } from "react-router";

// Translation Hook
import { useTranslation } from "react-i18next";

// Tailwind Merge Library
import { cn } from "../../../../lib/utils";

// Motion Library
import { motion, AnimatePresence } from "motion/react";

// Phenix CRM Logo
import phenixCRMLogo from "../../../../assets/images/common/phenix_logo_dashboard.png";

const DashboardSidebar = ({ sidebarLinks }) => {
  const { t } = useTranslation(["dashboard"]);
  const dispatch = useDispatch();
  const location = useLocation();
  const { direction } = useSelector((state) => state.ui);
  const isRtl = direction === "rtl";

  return (
    <aside
      className={cn(
        "w-80 bg-white dark:bg-zinc-950 border-r shadow-2xl font-medium border-gray-400 dark:border-zinc-900 p-8 flex flex-col lg:flex sticky top-0 min-h-screen",
        isRtl && "border-r-0 border-l",
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
      <nav className="space-y-2">
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
      <div className=" pt-4 mt-4 border-t border-gray-400 dark:border-zinc-900">
        <button
          className="flex items-center gap-3 px-4 py-3 rounded-2xl
         w-full text-slate-500 dark:text-slate-400 hover:text-red-500
          transition-all font-bold text-sm group
           hover:bg-slate-100 dark:hover:bg-white/5 hover:ps-5 cursor-pointer"
        >
          <LogOut
            onClick={() => dispatch(logOut())}
            size={20}
            className="group-hover:scale-110 group-hover:text-red-500 transition-transform duration-300"
          />
          <span>{t("logout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
