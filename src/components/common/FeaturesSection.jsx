// Translation Hook
import { useTranslation } from "react-i18next";

// Redux
import { useSelector } from "react-redux";

const FeaturesSection = () => {
  const { t } = useTranslation(["home"]);
  const { mode, direction } = useSelector((state) => state.ui);

  const stats = [
    { value: "50+", label: "Projects Completed" },
    { value: "23+", label: "Years Experience" },
    { value: "99%", label: "Client Satisfaction" },
    { value: "24/10", label: "Support Available" },
  ];

  const features = [
    { id: 1, label: "Easy to Use" },
    { id: 2, label: "Accurate Reports" },
    { id: 3, label: "For all Sectors" },
    { id: 4, label: "Mobility Solution" },
  ];

  return (
    <div className="relative py-4 max-w-7xl mx-auto">
      {mode === "dark" && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ed1c24]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ed1c24]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-[#ed1c24]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
      )}

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center md:justify-between gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <div
                style={{
                  fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
                }}
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white mb-2">
                  {t("Build The Future With")}
                  <span className="text-gradient text-[#DC2626]">
                    {" "}
                    {t("Modern Tech")}
                  </span>
                </h2>

                <p
                  className="text-lg dark:text-gray-400 font-medium text-gray-700 max-w-xl"
                  style={{
                    fontFamily: direction === "rtl" ? "Vazirmatn" : "livvic",
                  }}
                >
                  {t(
                    "We Create Exceptional Digital Experiences That Combine Cutting-edge Technology With Stunning Design. Let's Build Something Amazing Together.",
                  )}
                </p>
              </div>

              <div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                style={{
                  fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
                }}
              >
                <button className="cursor-pointer bg-linear-to-r from-[#ed1c24] to-[#ed1c29] text-white font-medium px-8 py-4 rounded-lg hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all duration-300 transform hover:-translate-y-1">
                  {t("Start Project")}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    className={`size-5 ms-2 inline ${direction === "rtl" ? "rotate-180" : ""}`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>

                <button
                  className="cursor-pointer px-8 py-4 rounded-lg font-medium
                text-gray-900 dark:text-white
                 border border-gray-500 hover:border-gray-400 dark:border-white/20
                dark:hover:bg-white/5 hover:bg-gray-100
                  transition-all duration-300 transform hover:-translate-y-1 will-change-transform"
                >
                  {t("View Our Work")}
                </button>
              </div>
            </div>
            {/* ==== Left Content ==== */}

            {/* Right Content */}
            <div className="lg:w-1/2 relative">
              <div
                className="relative dark:bg-linear-to-br dark:from-white/5 dark:to-white/0 backdrop-blur-xl 
                bg-linear-to-br from-white/90 to-white 
                rounded-2xl
               border border-white/10 p-8 shadow-2xl"
              >
                {mode === "dark" && (
                  <>
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#ff6b6b]/20 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#ed1c24]/20 rounded-full blur-xl"></div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-6">
                  {mode !== "dark" && (
                    <div className="absolute -inset-4 bg-linear-to-tr from-red-50 to-gray-50 rounded-2xl blur-xl opacity-70 -z-10"></div>
                  )}
                  {stats.map((s, i) => (
                    <div
                      key={i}
                      className="bg-white border-gray-100 p-8 rounded-2xl shadow-gray-200/50 shadow-xl hover:shadow-2xl
                   dark:bg-black/30 dark:shadow-sm dark:shadow-red-400 dark:hover:shadow-md dark:border-white/5 dark:hover:border-[#ff6b6b]/30
                   border hover:-translate-y-1
                       transition-all duration-200 group"
                    >
                      <div
                        style={{
                          fontFamily: "Inter",
                        }}
                        className="text-2xl md:text-3xl font-extrabold text-gradient text-[#DC2626] mb-2"
                      >
                        {s.value}
                      </div>
                      <p
                        className="text-sm dark:text-gray-400 text-gray-700 font-medium"
                        style={{
                          fontFamily:
                            direction === "rtl" ? "Vazirmatn" : "livvic",
                        }}
                      >
                        {t(s.label)}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-8 pt-8 border-t border-white/10"
                  style={{
                    fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
                  }}
                >
                  <p className="text-lg font-bold dark:text-gray-400 text-gray-600 mb-4">
                    {t("The Best Integrated Accounting System")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {features.map((val) => (
                      <span
                        key={val.id}
                        className="px-4 py-2 dark:bg-white/5 dark:text-white
                         dark:border-white/5 dark:hover:bg-transparent
                        bg-gray-50 rounded-full border border-gray-100 shadow-md
                         text-gray-700 text-sm hover:bg-white font-medium
                        hover:shadow-lg transition-all cursor-default
                        "
                        style={{
                          fontFamily:
                            direction === "rtl" ? "Vazirmatn" : "Livvic",
                        }}
                      >
                        {t(val.label)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* ==== Right Content ==== */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
