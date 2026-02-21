import demo from "../../assets/images/common/demo.png";
import support from "../../assets/images/common/customer-service.png";
import dataBase from "../../assets/images/common/data.png";
import complaint from "../../assets/images/common/complaint.png";

import { RevealSection } from "../utility/RevealSection";

// Translation Hook
import { useTranslation } from "react-i18next";

// Redux
import { useSelector } from "react-redux";

const ServicesSection = () => {
  const { t } = useTranslation(["home"]);
  const { mode, direction } = useSelector((state) => state.ui);

  const services = [
    {
      id: 1,
      img: demo,
      title: "Free Trial",
      description:
        "Try the system before subscribing. Experience the power firsthand.",
      color: "#61dafb",
      delay: "0.2s",
    },
    {
      id: 2,
      img: complaint,
      title: "Complaint or Feedback",
      description:
        "We welcome your input to help improve our services constantly.",
      color: "#ed1c24",
      delay: "0.4s",
    },
    {
      id: 3,
      img: support,
      title: "Technical Support",
      description:
        "Fast solutions to technical issues, available whenever you need assistance.",
      color: "#3178c6",
      delay: "0.6s",
    },
    {
      id: 4,
      img: dataBase,
      title: "Database Rotation",
      description:
        "Smart and secure data management to keep your business running smoothly.",
      color: "#a1a1aa",
      delay: "0.8s",
    },
  ];

  const getAlphaColor = (hex, alphaHex) => `${hex}${alphaHex}`;

  return (
    <div className="py-16 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h2
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai" }}
          className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gradient mb-6 text-gray-900 leading-tight tracking-wide"
        >
          {t("Choose The Service That")}{" "}
          <span className="text-[#DC2626]">{t("Suits You")}</span>{" "}
          {t("and Get Started Now")}
        </h2>
        <p
          className="dark:text-gray-400 text-gray-600 max-w-2xl mx-auto text-lg"
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Livvic",
            fontWeight: 500,
          }}
        >
          {t(
            "Whether You Need Immediate Technical Support, Want To Try The System Before Subscribing, Wish to Share Your Feedback, or Need to Perform a Database Rotation the Phenix Team is Ready to Serve You.",
          )}
        </p>
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {services.map((service) => (
          <RevealSection delay={service.delay} key={service.id}>
            <div
              className="group rounded-xl py-6 px-2 text-center border transition-all
                         hover:-translate-y-3 hover:shadow-2xl cursor-pointer bg-white
                         shadow-xl border-gray-100 transform duration-300 
                         "
              style={{
                background:
                  mode === "dark" &&
                  `linear-gradient(135deg,
                  ${getAlphaColor(service.color, "1A")},
                  ${getAlphaColor(service.color, "0D")}
                )`,
                borderColor:
                  mode === "dark" && getAlphaColor(service.color, "4D"),
              }}
            >
              {/* Icon */}
              <div
                className="w-24 h-24 mx-auto rounded-xl flex items-center justify-center mb-5"
                style={{
                  background:
                    mode === "dark"
                      ? `linear-gradient(135deg,
                    ${getAlphaColor(service.color, "26")},
                    ${getAlphaColor(service.color, "14")}
                  )`
                      : `linear-gradient(135deg,
                    ${getAlphaColor(service.color, "")},
                    ${getAlphaColor(service.color, "")}
                  )`,
                }}
              >
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "Inter",
                  color: mode === "dark" ? "white" : service.color,
                }}
                className="font-bold mb-3 text-xl"
              >
                {service.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm font-medium dark:text-gray-400 text-gray-600 leading-relaxed"
                style={{ fontFamily: "livvic", fontWeight: 500 }}
              >
                {service.description}
              </p>

              {/* Learn More */}
              <div
                className="mt-5 opacity-0 group-hover:opacity-100 
                           transition-opacity duration-300"
                style={{ fontFamily: "livvic" }}
              >
                <span
                  className="text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ color: mode === "dark" ? "white" : service.color }}
                >
                  Learn More
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
