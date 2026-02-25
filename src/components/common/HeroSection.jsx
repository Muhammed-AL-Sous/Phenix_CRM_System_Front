// Translation Hook
import { useTranslation } from "react-i18next";

// Redux
import { useSelector } from "react-redux";

// Icon
import { ChevronsDown } from "lucide-react";

const HeroSection = () => {
  const { direction } = useSelector((state) => state.ui);
  const { t } = useTranslation(["home"]);

  return (
    <div className="relative min-h-screen flex items-center justify-center flex-col text-center">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-15">
        <h1
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
            fontWeight: "800",
            lineHeight: direction === "rtl" ? 1.9 : "",
          }}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl
          dark:text-white text-gray-900 dark:font-bold mb-8 leading-tight flex flex-col"
        >
          <span className="m-0">
            {t("Welcome To")}{" "}
            <span className="text-gradient m-0 text-[#DC2626]">
              {t("Phenix Accounting")}
            </span>
          </span>
          <span className="m-0">{t("Warehouse, and Management Systems")}</span>
        </h1>
      </div>

      <div>
        <p
          className="dark:text-gray-400 max-w-5xl
           text-gray-600 text-md md:text-lg lg:text-2xl mb-4"
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "livvic",
            lineHeight: direction === "rtl" ? 1.9 : "",
          }}
        >
          {t(
            "Phenix System : The Easiest and Most Integrated Accounting Solution For Managing Sales, Inventory, and Payroll.",
          )}
        </p>
        <p
          className="dark:text-gray-400 max-w-5xl text-gray-600 text-md md:text-lg lg:text-2xl"
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "livvic",
            lineHeight: direction === "rtl" ? 1.9 : "",
          }}
        >
          {t(
            "Simple to Use, Accurate Reporting, and Complete Flexibility to Suit Your Company's Needs",
          )}
        </p>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce dark:text-gray-400 text-gray-600 ">
          <ChevronsDown size={35} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
