// React Hooks
import { useEffect } from "react";

// Redux
import { useSelector } from "react-redux";

// Translation Library
import i18n from "../i18n";

// Notification Library
import { Toaster } from "react-hot-toast";

const UIProvider = ({ children }) => {
  const { mode, direction, lang } = useSelector((state) => state.ui);

  // داخل useEffect في UIProvider.js
  useEffect(() => {
    const loader = document.getElementById("initial-loader");
    if (loader) {
      // إضافة تأخير بسيط جداً لضمان رسم العناصر
      setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => loader.remove(), 300);
      }, 100);
    }
  }, []);

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

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          // استخدام الفونت الخاص بك بناءً على اللغة
          className: direction === "rtl" ? "font-[Vazirmatn]" : "font-[Inter]",
          style: {
            direction: direction,
            borderRadius: "12px",
            background: mode === "dark" ? "#27272a" : "#fff", // ألوان متناسقة مع Slate/Zinc
            color: mode === "dark" ? "#fff" : "#18181b",
            fontSize: "14px",
          },
        }}
      />
      {children}
    </>
  );
};

export default UIProvider;
