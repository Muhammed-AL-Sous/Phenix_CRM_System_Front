// React Hooks
import { useEffect } from "react";

// Redux
import { useSelector } from "react-redux";

// Translation Library
import i18n from "../i18n";

const UIProvider = ({ children }) => {
  const { mode, direction, lang } = useSelector((state) => state.ui);

  useEffect(() => {
    // Tailwind Dark Mode
    const root = document.documentElement;

    if (mode === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      root.style.backgroundColor = "#18181b";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      root.style.backgroundColor = "#f8fafc";
    }

    // Direction
    root.setAttribute("dir", direction);

    // Language
    root.setAttribute("lang", lang);
    i18n.changeLanguage(lang);
  }, [mode, direction, lang]);

  return <>{children}</>;
};

export default UIProvider;
