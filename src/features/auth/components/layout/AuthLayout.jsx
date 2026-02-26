import { Suspense } from "react";
import { Outlet, useMatches, useLocation, Link } from "react-router";

// Utilities Toggles
import ThemeToggle from "../../../../components/utility/ThemeToggle";
import LanguageToggle from "../../../../components/utility/LanguageToggle";

// Motion Library
import { motion, AnimatePresence } from "motion/react";

// Phenix Logo
import phenixLogo from "../../../../assets/images/common/phenix_logo_auth.png";

// React Redux
import { useSelector } from "react-redux";

// Translation Hook
import { useTranslation } from "react-i18next";

// Icon
import { House } from "lucide-react";

const AuthLayout = () => {
  const { direction } = useSelector((state) => state.ui);
  const { t } = useTranslation("common");
  const location = useLocation();

  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];

  const title = t(currentRoute?.handle?.titleKey || "");
  const subtitle = t(currentRoute?.handle?.subtitleKey || "");

  return (
    <div className="min-h-screen flex items-center justify-center mesh-gradient p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="absolute top-8 right-8 flex items-center gap-4 z-20">
        <span className="border-2 border-red-500/15 flex justify-center items-center w-10 h-10 rounded-lg">
          <ThemeToggle />
        </span>
        <span className="border-2 border-red-500/15 flex justify-center items-center w-10 h-10 rounded-lg">
          <LanguageToggle />
        </span>
        <span
          className=" text-gray-700 dark:text-white
         hover:text-[#ed1c24] border-2 border-red-500/15 flex justify-center items-center w-10 h-10 rounded-lg"
        >
          <Link to="/">
            <House />
          </Link>
        </span>
      </div>

      <Suspense
        fallback={
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
        }
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md glass rounded-[2.5rem] pt-0 pb-4 px-8 shadow-2xl relative z-10"
        >
          <div className="text-center mb-4">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="inline-flex items-center justify-center w-35 h-35 mb-2"
            >
              <img src={phenixLogo} alt="phenix-logo" />
            </motion.div>
            <h1
              style={{
                fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
              }}
              className="text-3xl font-black text-slate-600 dark:text-white tracking-tight"
            >
              {title}
            </h1>
            <p
              style={{
                fontFamily: direction === "rtl" ? "Vazirmatn" : "Livvic",
              }}
              className="text-slate-600 dark:text-slate-400 mt-3 font-medium"
            >
              {subtitle}
            </p>
          </div>
          {/* 🔥 Animation Between Routes */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: direction === "rtl" ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === "rtl" ? 40 : -40 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Suspense>
    </div>
  );
};

export default AuthLayout;
