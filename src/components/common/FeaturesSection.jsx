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
    {
      id: 1,
      label: "Easy to Use",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-hand-heart-icon lucide-hand-heart"
        >
          <path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
          <path d="m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95" />
          <path d="m2 15 6 6" />
          <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91" />
        </svg>
      ),
    },
    {
      id: 2,
      label: "Accurate Reports",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-folder-check-icon lucide-folder-check"
        >
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
          <path d="m9 13 2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 3,
      label: "For all Sectors",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-factory-icon lucide-factory"
        >
          <path d="M12 16h.01" />
          <path d="M16 16h.01" />
          <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
          <path d="M8 16h.01" />
        </svg>
      ),
    },
    {
      id: 4,
      label: "Mobility Solution",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-globe-icon lucide-globe"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
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
                  <div className="grid grid-cols-2 gap-x-20 gap-y-4">
                    {features.map((val) => (
                      <div
                        key={val.id}
                        className="flex items-center gap-4
                         px-4 py-2 dark:bg-white/5 dark:text-white
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
                        <span className="text-[#DC2626]">{val.icon}</span>
                        {t(val.label)}
                      </div>
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
