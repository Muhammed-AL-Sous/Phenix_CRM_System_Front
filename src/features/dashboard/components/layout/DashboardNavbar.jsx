// Translation Hook
import { useTranslation } from "react-i18next";

// Icons
import { Search, Bell, User, Rotate3D, Rotate3DIcon } from "lucide-react";

// Motion Library
import { motion } from "motion/react";

// Utilities Toggles
import ThemeToggle from "../../../../components/utility/ThemeToggle";
import LanguageToggle from "../../../../components/utility/LanguageToggle";

const DashboardNavbar = () => {
  const { t } = useTranslation(["dashboard"]);
  return (
    <header className="h-20 shadow-2xl glass px-10 flex items-center justify-between sticky top-0 z-30">
      {/* ============ Search Button ============ */}
      <div className="flex items-center gap-6 flex-1">
        <div className="relative max-w-md w-full hidden md:block group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder={t("search")}
            className="w-full pl-12 pr-6 py-3 bg-slate-100 dark:bg-zinc-900/50 border-2 border-transparent focus:border-red-500/20 rounded-[1.25rem] transition-all outline-none text-sm font-medium dark:text-white"
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
        <motion.div className="flex items-center gap-4 pl-2 cursor-pointer">
          {/* ============ User's Image ============ */}
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-slate-200 to-slate-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-800 shadow-lg">
            <User size={24} className="text-slate-500 dark:text-slate-400" />
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
        </motion.div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
