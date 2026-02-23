// React Hooks
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";

// React Router Dom
import { Link } from "react-router";

// React Redux
import { useSelector } from "react-redux";

// Translation Hook
import { useTranslation } from "react-i18next";

// Main Logo
import phenixLogo from "/public/images/phenix_common/phenix_logo.png";
import LanguageToggle from "../utility/LanguageToggle";
import ThemeToggle from "../utility/ThemeToggle";

const Navbar = () => {
  const { t } = useTranslation("navbar");
  const { direction } = useSelector((state) => state.ui);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

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
    { name: "what's_new", path: "/whats-new" },
  ];

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
            <Link to="/" className="relative">
              <img
                src={phenixLogo}
                alt="Phenix Systems Logo"
                className="h-13"
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ed1c24] rounded-full animate-ping"></div>
            </Link>

            {/* ================= Desktop Links ================= */}
            <div className="hidden md:flex items-center space-x-8">
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

              {/* ================= Change Language Button ================= */}
              <LanguageToggle />

              {/* ================= Change Mode Buttons ================= */}
              <ThemeToggle />

              <Link to="/login">
                <button
                  style={{
                    fontFamily: direction === "rtl" ? "Almarai" : "Inter",
                  }}
                  className="px-4 py-2 bg-linear-to-r from-[#ed1c24] to-[#ed1c29] rounded-full text-white font-medium
                   shadow-red-500  cursor-pointer
                   hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {t("get_Started")}
                </button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-2">
              {/* ================= Change Language Button ================= */}
              <LanguageToggle />

              {/* ================= Change Mode Buttons ================= */}
              <ThemeToggle />

              {/* ================= Toggle Button ================= */}
              <button
                ref={toggleRef}
                onClick={() => setIsMobileOpen((prev) => !prev)}
                className="dark:text-white text-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMobileOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
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
              isMobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
