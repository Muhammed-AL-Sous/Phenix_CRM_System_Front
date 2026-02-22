import { Link } from "react-router";
import phenixLogo from "../../../public/images/phenix_common/phenix_logo.png";

// Translation Hook
import { useTranslation } from "react-i18next";

// Redux
import { useSelector } from "react-redux";

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
    iconClass: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02"
        />
      </svg>
    ),
    href: "#",
    color: "#1877f2",
  },
  {
    iconClass: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
        />
      </svg>
    ),
    href: "#",
    color: "#e4405f",
  },
  {
    iconClass: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <g fill="none">
          <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
          <path
            fill="currentColor"
            d="M18 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zm0 2H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1M8 10a1 1 0 0 1 .993.883L9 11v5a1 1 0 0 1-1.993.117L7 16v-5a1 1 0 0 1 1-1m3-1a1 1 0 0 1 .984.821a6 6 0 0 1 .623-.313c.667-.285 1.666-.442 2.568-.159c.473.15.948.43 1.3.907c.315.425.485.942.519 1.523L17 12v4a1 1 0 0 1-1.993.117L15 16v-4c0-.33-.08-.484-.132-.555a.55.55 0 0 0-.293-.188c-.348-.11-.849-.052-1.182.09c-.5.214-.958.55-1.27.861L12 12.34V16a1 1 0 0 1-1.993.117L10 16v-6a1 1 0 0 1 1-1M8 7a1 1 0 1 1 0 2a1 1 0 0 1 0-2"
          />
        </g>
      </svg>
    ),
    href: "#",
    color: "#0a66c2",
  },
  {
    iconClass: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"
        />
      </svg>
    ),
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
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

          <div>
            <div
              className={`uppercase tracking-wider font-semibold mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}
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
