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

const DashboardNavbar = ({ toggleSidebar }) => {
  const { t } = useTranslation(["dashboard"]);
  const { direction } = useSelector((state) => state.ui);
  const isRTL = direction === "rtl";

  return (
    <header
      className="h-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-30
     shadow-xl glass px-2 md:px-4"
    >
      <div className="flex items-center gap-6 flex-1">
        {/* ============ Toggle SideBar Button ============ */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu size={24} />
        </button>

        {/* ============ Search Bar - Hidden on small mobile ============ */}
        <div className="relative group hidden sm:block max-w-70 lg:max-w-md w-full ml-2">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors"
            size={18}
          />
          <input
            type="search"
            placeholder={t("search")}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-zinc-900 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 transition-all outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex items-center">
        {/* ============ Lang & Mode Button ============ */}
        <div className="flex items-center">
          <span
            style={{ width: "46px", height: "46px", padding: "12px" }}
            className="flex justify-center items-center rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 relative group transition-all"
          >
            <ThemeToggle />
          </span>
          <span
            style={{ width: "46px", height: "46px", padding: "12px" }}
            className="rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 relative group transition-all"
          >
            <LanguageToggle />
          </span>
        </div>

        {/* ============ Notification Button ============ */}
        <button className="p-3 rounded-2xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 relative group transition-all">
          <Bell
            size={22}
            className="text-gray-700 dark:text-white group-hover:text-red-500"
          />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-[3px] border-white dark:border-zinc-950" />
        </button>

        <div className="h-10 w-px bg-slate-200 dark:bg-zinc-800 mx-2" />

        <Dropdown
          align={isRTL ? "left" : "right"}
          trigger={
            <div className="flex items-center gap-4 pl-2 cursor-pointer">
              {/* ============ User's Image ============ */}
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-slate-200 to-slate-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-800 shadow-lg">
                <User
                  size={24}
                  className="text-slate-500 dark:text-slate-400"
                />
              </div>

              {/* ============ User's Name & Role ============ */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                  Muhammed AL-Sous
                </p>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                  {/* {role} */}
                  admin
                </p>
              </div>
            </div>
          }
          items={[
            {
              icon: UserRoundPen,
              label: `${t("profile")}`,
              onClick: () => console.log("Profile clicked"),
            },
            {
              icon: UserCog,
              label: `${t("account_settings")}`,
              onClick: () => console.log("Settings clicked"),
            },
            {
              icon: LogOut,
              label: `${t("logout")}`,
              onClick: () => console.log("Logout"),
            },
          ]}
        />
      </div>
    </header>
  );
};

export default DashboardNavbar;
