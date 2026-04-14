import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import { Link } from "react-router";
import { useLogoutMutation } from "../../features/auth/authApiSlice";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectAuthReady,
} from "../../features/auth/authSlice";
import { useTranslation } from "react-i18next";
import { ROLES_CONFIG } from "../../routes/roles.config";
import LanguageToggle from "../utility/LanguageToggle";
import ThemeToggle from "../utility/ThemeToggle";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { t } = useTranslation("navbar");
  const { direction } = useSelector((state) => state.ui);
  const user = useSelector(selectCurrentUser);
  const authReady = useSelector(selectAuthReady);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      /* session may already be cleared */
    }
    setIsMobileOpen(false);
  };

  /** مسجّل ومفعّل، وملف الزبون مكتمل إن وُجد */
  const isFullyOnboarded =
    authReady &&
    user &&
    user.is_active &&
    (user.role !== "client" || user.requires_client_profile !== true);

  const needsClientProfile =
    authReady &&
    user &&
    user.is_active &&
    user.role === "client" &&
    user.requires_client_profile === true;

  const dashboardHref = user
    ? `/${ROLES_CONFIG[user.role]?.prefix || "client"}`
    : "/";

  const completeProfileHref = "/client/complete-profile";

  /* ================= Scroll Effect ================= */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= Lock Body Scroll ================= */
  useLayoutEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileOpen]);

  /* ================= Click Outside ================= */
  const handleClickOutside = useCallback(
    (event) => {
      if (
        isMobileOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsMobileOpen(false);
      }
    },
    [isMobileOpen],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  /* ================= Navigation Links ================= */
  const navLinks = [
    { name: "home", path: "/" },
    { name: "about", path: "/about" },
    { name: "agents", path: "/agents" },
    { name: "what's_new", path: "/what's_new" },
  ];

  const authButtonClass =
    "px-4 py-2 bg-linear-to-r from-[#ed1c24] to-[#ed1c29] rounded-full text-white text-sm font-semibold shadow-red-500 cursor-pointer hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all duration-300 transform hover:-translate-y-1 transform-will-change";

  const logoutButtonClass =
    "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 dark:border-white/20 text-gray-800 dark:text-white text-sm font-semibold cursor-pointer hover:bg-slate-100 hover:border-slate-300 dark:hover:bg-white/10 dark:hover:border-white/10 transition-all duration-300 transform hover:-translate-y-1 transform-will-change";

  return (
    <nav
      className={`fixed w-full top-0 z-50 px-4 transition-all duration-300 ${
        isScrolled ? "pt-2" : "pt-4"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`relative rounded-xl border p-3 transition-all duration-300 ${
            isScrolled
              ? "bg-white/90 backdrop-blur-md shadow-md border-[#FEF2F2] dark:bg-black/60 dark:backdrop-blur-3xl dark:border-white/10"
              : "bg-transparent border-[#FEF2F2] dark:backdrop-blur-md dark:bg-black/20  dark:border-white/15"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* ================= Logo ================= */}
            <a href="/" className="relative">
              <img
                src="/images/phenix_common/phenix_logo.png"
                alt="Phenix Systems Logo"
                className="h-13"
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ed1c24] rounded-full animate-ping"></div>
            </a>

            {/* ================= Desktop Links ================= */}
            <div className="hidden md:flex items-center gap-6 flex-wrap justify-end">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    fontFamily: direction === "rtl" ? "Almarai" : "Inter",
                  }}
                  className="group text-sm font-medium uppercase text-gray-800 dark:text-white"
                >
                  {t(link.name)}
                  <span className="block h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-[#ed1c24]" />
                </Link>
              ))}

              <LanguageToggle />
              <ThemeToggle />

              {isFullyOnboarded && (
                <>
                  <Link
                    to={dashboardHref}
                    style={{
                      fontFamily: direction === "rtl" ? "Almarai" : "Inter",
                    }}
                    className={`inline-flex items-center gap-2 ${authButtonClass}`}
                  >
                    <LayoutDashboard size={18} />
                    {t("dashboard")}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      fontFamily: direction === "rtl" ? "Almarai" : "Inter",
                    }}
                    className={logoutButtonClass}
                  >
                    <LogOut size={18} className="text-[#ed1c24]" />
                    {t("logout")}
                  </button>
                </>
              )}

              {needsClientProfile && (
                <Link
                  to={completeProfileHref}
                  style={{
                    fontFamily: direction === "rtl" ? "Almarai" : "Inter",
                  }}
                  className={authButtonClass}
                >
                  {t("continue_registration")}
                </Link>
              )}

              {!isFullyOnboarded && !needsClientProfile && (
                <Link to="/login">
                  <button
                    style={{
                      fontFamily: direction === "rtl" ? "Almarai" : "Inter",
                    }}
                    className={authButtonClass}
                  >
                    {t("get_Started")}
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <button
                ref={toggleRef}
                onClick={() => setIsMobileOpen((prev) => !prev)}
                className="text-gray-700 focus:outline-none dark:text-white"
              >
                {isMobileOpen ? <X size={25} /> : <Menu size={25} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Mobile Menu ================= */}
      <div
        ref={menuRef}
        className={`md:hidden absolute top-full left-0 w-full
          bg-white dark:bg-[#0a0a0a] dark:backdrop-blur-2xl shadow-xl transition-all
            duration-300 ease-in-out overflow-hidden ${
              isMobileOpen ? "max-h-112 opacity-100" : "max-h-0 opacity-0"
            }`}
      >
        <div className="px-4 py-6 space-y-4 flex flex-col items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileOpen(false)}
              className="dark:text-white text-gray-800 font-bold text-md uppercase"
              style={{ fontFamily: direction === "rtl" ? "Almarai" : "Inter" }}
            >
              {t(link.name)}
            </Link>
          ))}

          {isFullyOnboarded && (
            <>
              <Link
                to={dashboardHref}
                className="w-full"
                onClick={() => setIsMobileOpen(false)}
              >
                <button
                  type="button"
                  style={{ fontFamily: direction === "rtl" ? "Almarai" : "Inter" }}
                  className="w-full font-bold bg-linear-to-r from-[#ed1c24] to-[#ed1c29] rounded-lg text-white hover:shadow-lg hover:shadow-[#ff6b6b]/30 transition-all cursor-pointer px-6 py-3 inline-flex items-center justify-center gap-2"
                >
                  <LayoutDashboard size={20} />
                  {t("dashboard")}
                </button>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                style={{ fontFamily: direction === "rtl" ? "Almarai" : "Inter" }}
                className="w-full font-medium rounded-lg border border-slate-300 dark:border-white/20 text-gray-800 dark:text-white px-6 py-3 inline-flex items-center justify-center gap-2"
              >
                <LogOut size={20} className="text-[#ed1c24]" />
                {t("logout")}
              </button>
            </>
          )}

          {needsClientProfile && (
            <Link
              to={completeProfileHref}
              className="w-full"
              onClick={() => setIsMobileOpen(false)}
            >
              <button
                type="button"
                style={{ fontFamily: direction === "rtl" ? "Almarai" : "Inter" }}
                className="w-full font-bold bg-linear-to-r from-[#ed1c24] to-[#ed1c29] rounded-lg text-white hover:shadow-lg hover:shadow-[#ff6b6b]/30 transition-all cursor-pointer px-6 py-3"
              >
                {t("continue_registration")}
              </button>
            </Link>
          )}

          {!isFullyOnboarded && !needsClientProfile && (
            <Link
              to="/login"
              className="w-full"
              onClick={() => setIsMobileOpen(false)}
            >
              <button
                style={{ fontFamily: direction === "rtl" ? "Almarai" : "Inter" }}
                className="w-full font-bold bg-linear-to-r from-[#ed1c24] to-[#ed1c29] rounded-lg text-white hover:shadow-lg hover:shadow-[#ff6b6b]/30 transition-all cursor-pointer px-6 py-3"
              >
                {t("get_Started")}
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
