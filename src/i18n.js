import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

// 1. جلب اللغة المخزنة أو الافتراضية
const savedLang = localStorage.getItem("lang") || "en";

// 2. كتم رسالة Locize الترويجية (Hack بسيط لتنظيف الكونسول)
const originalInfo = console.info;
console.info = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("i18next is maintained"))
    return;
  originalInfo(...args);
};

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    debug: false, // إيقاف سجلات المكتبة التقنية
    supportedLngs: ["ar", "en"],
    lng: savedLang,
    fallbackLng: "en",
    defaultNS: "common",
    ns: [
      "common",
      "navbar",
      "footer",
      "home",
      "dashboard",
      "auth",
      "clientProfile",
    ],

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    interpolation: {
      escapeValue: false, // لا حاجة للتشفير مع React (هو يحمينا تلقائياً)
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
