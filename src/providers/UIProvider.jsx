import { useEffect } from "react";
import { useSelector } from "react-redux";
import i18n from "../i18n";

const UIProvider = ({ children }) => {
  const { mode, direction, lang } = useSelector((state) => state.ui);

  useEffect(() => {
    // Tailwind Dark Mode
    const root = document.documentElement;

    if (mode === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }

    // Direction
    root.setAttribute("dir", direction);

    // Language
    root.setAttribute("lang", lang);
    i18n.changeLanguage(lang);
  }, [mode, direction, lang]);

  return children;
};

export default UIProvider;
