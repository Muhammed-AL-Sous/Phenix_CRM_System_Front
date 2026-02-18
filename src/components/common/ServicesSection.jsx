import demo from "../../assets/images/common/demo.png";
import support from "../../assets/images/common/customer-service.png";
import dataBase from "../../assets/images/common/data.png";
import complaint from "../../assets/images/common/complaint.png";

import { RevealSection } from "../utility/RevealSection";

const ServicesSection = () => {
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

  return (
    <div className="py-16 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient mb-6">
          Choose the service that suits you and get started now
        </h2>
        <p
          className="text-gray-400 max-w-2xl mx-auto text-lg"
          style={{ fontFamily: "livvic", fontWeight: "500" }}
        >
          Whether you need immediate technical support, want to try the system
          before subscribing, wish to share your feedback, or need to perform a
          database rotation the Phenix team is ready to serve you with simple
          steps and a reliable response.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 text-center lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {services.map((service) => (
          <RevealSection delay={service.delay} key={service.id}>
            <div
              className={`group bg-linear-to-br from-[${service.color}]/10 to-[${service.color}]/5
               rounded-xl p-6 text-center hover:from-[${service.color}]/20 hover:to-[${service.color}]/10
                  transition-all duration-300 hover:transform hover:-translate-y-2
                   border border-[${service.color}]/30 hover:border-[${service.color}]/50 cursor-pointer`}
            >
              <div className="w-30 h-30 mx-auto rounded-xl bg-linear-to-br flex items-center justify-center mb-4 p-2">
                <img src={service.img} alt={service.title} />
              </div>
              <h3 className="font-bold mb-3 text-xl ">{service.title}</h3>
              <p
                className="text-xs text-gray-400"
                style={{ fontFamily: "livvic", fontWeight: "700" }}
              >
                {service.description}
              </p>

              <div
                className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center"
                style={{ fontFamily: "livvic" }}
              >
                <span className="text-sm font-semibold flex items-center justify-center gap-1">
                  Learn More
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
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
