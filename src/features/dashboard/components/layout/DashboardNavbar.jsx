// Translation Hook
import { useTranslation } from "react-i18next";

// Icons
import {
  Search,
  Bell,
  User,
  UserRoundPen,
  UserCog,
  LogOut,
  Menu,
} from "lucide-react";

// Utilities Toggles
import ThemeToggle from "../../../../components/utility/ThemeToggle";
import LanguageToggle from "../../../../components/utility/LanguageToggle";
import Dropdown from "../../../../components/utility/Dropdown";

// Redux
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../auth/authSlice";
import { useLogoutMutation } from "../../../auth/authApiSlice";
import { useNavigate } from "react-router";
import { ROLES_CONFIG } from "../../../../routes/roles.config";

const DashboardNavbar = ({ toggleSidebar }) => {
  const { t } = useTranslation("dashboard");
  const { direction } = useSelector((state) => state.ui);
  const isRTL = direction === "rtl";
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const rolePrefix = user?.role ? ROLES_CONFIG[user.role]?.prefix : "";
  const profilePath = rolePrefix ? `/${rolePrefix}/profile` : "/";

  const displayName = user?.name?.trim() || "—";
  const roleLabel = user?.role
    ? t(`role_${user.role}`, { defaultValue: user.role })
    : "";

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      /* cleared locally by mutation */
    }
  };

  return (
    <header
      className="h-18 min-h-18 md:h-20 md:min-h-20 shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-30
     shadow-xl glass px-2 md:px-4"
    >
      <div className="flex items-center gap-4 md:gap-6 flex-1">
        {/* ============ Toggle SideBar Button ============ */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          aria-label="Toggle Menu"
          type="button"
        >
          <Menu size={24} />
        </button>

        {/* ============ Search Bar - Hidden on small mobile ============ */}
        <div className="relative group hidden sm:block max-w-70 lg:max-w-md w-full ml-2 rtl:ml-0 rtl:mr-2">
          <Search
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors ${
              isRTL ? "right-4" : "left-4"
            }`}
            size={18}
          />
          <input
            type="search"
            placeholder={t("search")}
            dir={isRTL ? "rtl" : "ltr"}
            className={`w-full py-2.5 bg-slate-100 dark:bg-zinc-900 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 transition-all outline-none text-sm ${
              isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
            }`}
          />
        </div>
      </div>

      <div className="flex items-center">
        {/* ============ Lang & Mode Button ============ */}
        <div className="flex items-center">
          <span
            style={{ width: "40px", height: "40px", padding: "10px" }}
            className="flex justify-center items-center rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 relative group transition-all"
          >
            <ThemeToggle />
          </span>
          <span
            style={{ width: "40px", height: "40px", padding: "10px" }}
            className="rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 relative group transition-all"
          >
            <LanguageToggle />
          </span>
        </div>

        {/* ============ Notification Button ============ */}
        <button
          type="button"
          className="p-2.5 rounded-2xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 relative group transition-all"
        >
          <Bell
            size={22}
            className="text-gray-700 dark:text-white group-hover:text-red-500"
          />
          <span className="absolute top-2.5 inset-e-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-[3px] border-white dark:border-zinc-950" />
        </button>

        <div className="h-9 w-px bg-slate-200 dark:bg-zinc-800 mx-2" />

        <Dropdown
          align={isRTL ? "left" : "right"}
          trigger={
            <div className="flex items-center gap-4 ps-2 cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-slate-200 to-slate-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-800 shadow-lg">
                <User
                  size={24}
                  className="text-slate-500 dark:text-slate-400"
                />
              </div>

              <div
                className={`hidden sm:block ${isRTL ? "text-left" : "text-right"}`}
              >
                <p className="text-sm font-black text-slate-900 dark:text-white leading-tight max-w-40 truncate">
                  {displayName}
                </p>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                  {roleLabel}
                </p>
              </div>
            </div>
          }
          items={[
            {
              icon: UserRoundPen,
              label: t("profile"),
              onClick: () => navigate(profilePath),
            },
            {
              icon: UserCog,
              label: t("account_settings"),
              onClick: () => navigate(profilePath),
            },
            {
              icon: LogOut,
              label: t("logout"),
              onClick: handleLogout,
            },
          ]}
        />
      </div>
    </header>
  );
};

export default DashboardNavbar;
