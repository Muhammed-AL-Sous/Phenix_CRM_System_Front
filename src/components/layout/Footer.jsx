import { Link } from "react-router";
import phenixLogo from "../../../public/images/phenix_common/phenix_logo.png";

// Translation Hook
import { useTranslation } from "react-i18next";

// Redux
import { useSelector } from "react-redux";

// Icons
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const footerNav = [
  { label: "home", path: "/" },
  { label: "what's_new", path: "/whats-new" },
  { label: "agents", path: "/agents" },
  { label: "about", path: "/about" },
];

const footerLinks = [
  { label: "Sign In", path: "/login" },
  { label: "Register", path: "/register" },
  { label: "About Phenix", path: "/about" },
  { label: "Blog", path: "/whats-new" },
  { label: "Contact Us", path: "/contact" },
];

const socials = [
  {
    iconClass: <Facebook />,
    href: "#",
    color: "#1877f2",
  },
  {
    iconClass: <Instagram />,
    href: "#",
    color: "#e4405f",
  },
  {
    iconClass: <Linkedin />,
    href: "#",
    color: "#0a66c2",
  },
  {
    iconClass: <Youtube />,
    href: "#",
    color: "#ff0000",
  },
];

const Footer = () => {
  const { t } = useTranslation(["footer"]);
  const { mode, direction } = useSelector((state) => state.ui);
  const isDark = mode === "dark";
  return (
    <footer
      className={`relative z-10 pt-8 pb-5 text-white ${isDark ? "bg-linear-to-b from-black/60 via-black/40 to-black/60" : "bg-gray-900"}`}
      id="Footer"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-8 text-start">
          <div
            className="col-span-2 lg:col-span-1 space-y-4
        flex flex-col items-center md:items-start text-center md:text-start
          "
          >
            <Link to="/" className="inline-block">
              <img src={phenixLogo} alt="Phenix" className="h-25" />
            </Link>
            <p
              style={{
                fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
              }}
              className={`text-md font-medium leading-relaxed max-w-65 ${isDark ? "text-gray-300" : "text-gray-400"}`}
            >
              {t("Phenix System Your Constant Partner in Success")}
            </p>
            <p
              style={{
                fontFamily: direction === "rtl" ? "Vazirmatn" : "Livvic",
              }}
              className="text-red-600 font-semibold text-md"
            >
              {t("Get More ... Get Phenix")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div
              className={`uppercase tracking-wider font-semibold mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {t("Navigation")}
            </div>
            <ul className="space-y-4">
              {footerNav.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    style={{
                      fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
                    }}
                    className={`hover:text-red-700 transition-colors duration-300 ${isDark ? "text-gray-200" : "text-gray-400"}`}
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <div
              className={`uppercase tracking-wider font-semibold mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {t("Account")}
            </div>
            <ul className="space-y-2">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    style={{
                      fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
                    }}
                    className={`hover:text-red-700 transition-colors duration-300 ${isDark ? "text-gray-200" : "text-gray-400"}`}
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-start">
            <div
              className={`
                
               
                uppercase tracking-wider font-semibold mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {t("Contact Us")}
            </div>
            <div className="flex items-center gap-3">
              {socials.map(({ iconClass, href, color }) => (
                <a
                  key={href + color}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={iconClass}
                  className="w-10 h-10 flex items-center justify-center rounded-md transitio"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(255,255,255,0.04)",
                    color: isDark ? "#fafafa" : "#fafafa",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = color;
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = isDark
                      ? "#fafafa"
                      : "#fafafa";
                  }}
                >
                  {iconClass}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-white/5 pt-5 text-center">
          <p
            style={{ fontFamily: direction === "rtl" ? "Almarai" : "Inter" }}
            className={`text-md font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {t("Copyright ©2003 - 2026 Phenix GmbH")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
