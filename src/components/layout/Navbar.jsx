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
import { useDispatch, useSelector } from "react-redux";

// Mode & Language
import { toggleMode, setLang } from "../../store/Slices/uiSlice";

// Translation Hook
import { useTranslation } from "react-i18next";

// Main Logo
import phenixLogo from "/public/images/phenix_common/phenix_logo.png";

const Navbar = () => {
  const { t } = useTranslation("navbar");
  const dispatch = useDispatch();
  const { mode, lang, direction } = useSelector((state) => state.ui);

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
            {/* Logo */}
            <Link to="/" className="relative">
              <img
                src={phenixLogo}
                alt="Phenix Systems Logo"
                className="h-13"
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ed1c24] rounded-full animate-ping"></div>
            </Link>

            {/* Desktop Links */}
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

              {/* Change Language Button */}
              <div>
                <button
                  onClick={() => dispatch(setLang(lang === "ar" ? "en" : "ar"))}
                  className="text-sm font-medium text-gray-800
                   dark:text-white cursor-pointer group"
                  style={{
                    fontFamily: direction === "rtl" ? "Almarai" : "Inter",
                  }}
                >
                  {lang === "ar" ? "EN" : "AR"}
                  <span className="block h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-[#ed1c24]" />
                </button>
              </div>
              {/* ==== Change Language Button ==== */}

              {/* Change Mode Buttons */}
              <div>
                {/* Dark Mode */}
                <button
                  onClick={() => dispatch(toggleMode())}
                  className="text-gray-700 dark:text-white hover:text-[#ed1c24] relative top-1"
                >
                  {mode === "dark" ? (
                    // Light Button
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-6 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      />
                    </svg>
                  ) : (
                    // Dark Button
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-6 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {/* ==== Change Mode Buttons ==== */}

              <Link to="/login">
                <button
                  style={{
                    fontFamily: direction === "rtl" ? "Almarai" : "Inter",
                  }}
                  className="px-6 py-2 bg-linear-to-r from-[#ed1c24] to-[#ed1c29] rounded-full text-white font-medium hover:shadow-lg hover:shadow-[#ff6b6b]/30 transition-all cursor-pointer"
                >
                  {t("get_Started")}
                </button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-2">
              {/* Change Language Button */}
              <div>
                <button
                  onClick={() => dispatch(setLang(lang === "ar" ? "en" : "ar"))}
                  className="text-sm text-gray-800
                   dark:text-white cursor-pointer group"
                  style={{
                    fontFamily: direction === "rtl" ? "Almarai" : "Inter",
                    fontWeight: "600",
                  }}
                >
                  {lang === "ar" ? "EN" : "AR"}
                  <span className="block h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-[#ed1c24]" />
                </button>
              </div>
              {/* ==== Change Language Button ==== */}

              {/* Change Mode Buttons */}
              <div>
                {/* Dark Mode */}
                <button
                  onClick={() => dispatch(toggleMode())}
                  className="text-gray-700 dark:text-white hover:text-[#ed1c24] relative top-1"
                >
                  {mode === "dark" ? (
                    // Light Button
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-6 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      />
                    </svg>
                  ) : (
                    // Dark Button
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-6 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {/* ==== Change Mode Buttons ==== */}

              {/* Toggle Button */}
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
              {/* ==== Toggle Button ==== */}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
