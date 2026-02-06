import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
const savedLang = localStorage.getItem("lang") || "en";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: savedLang,
    debug: false,
    ns: ["common", "navbar", "footer", "home"],
    defaultNS: "common",

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
