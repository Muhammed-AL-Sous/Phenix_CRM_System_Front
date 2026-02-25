import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
// import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  //   .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false, // تأكد أن هذه القيمة false لإيقاف سجلات المكتبة في الكونسول
    supportedLngs: ["ar", "en"],
    fallbackLng: "en",
    defaultNS: "common",

    ns: ["common", "navbar", "footer", "home", "dashboard"],

    backend: {
      loadPath: "./locales/{{lng}}/{{ns}}.json",
    },

    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
