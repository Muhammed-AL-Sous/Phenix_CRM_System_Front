import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Brands Logo
import dajajatiLogo from "../../assets/images/brands/dajajati.png";
import beitAlMukhtarLogo from "../../assets/images/brands/beit_al_mukhtar.png";
import BIMLogo from "../../assets/images/brands/bim.png";
import signCafeLogo from "../../assets/images/brands/sign_cafe.png";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../assets/styles/testimonials.css";

// Rating Component
import RatingStars from "../utility/RatingStars";

// Translation Hook
import { useTranslation } from "react-i18next";

// Redux
import { useSelector } from "react-redux";

const TestimonialsSection = () => {
  const { t } = useTranslation(["home"]);
  const { mode, direction } = useSelector((state) => state.ui);

  const sliderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Ahmad Yasin",
      role: "CEO, Company",
      text: "An Excellent, Modern System, and We Want to Continue Working With this Wonderful System.",
      company: "Dajajati",
      avatar: dajajatiLogo,
      rating: 5,
    },
    {
      id: 2,
      name: "Sarah AL-Omar",
      role: "Marketing Manager",
      text: "The Program is More Than Wonderful. I Have Many Branches. I Was Able to Link and Follow Up on All the Branches.  Everyone is Looking For Excellence ...Thank you Phenix",
      company: "Bim",
      avatar: BIMLogo,
      rating: 4,
    },
    {
      id: 3,
      name: "Michael Tony",
      role: "Product Designer",
      text: "Clean Design, Smooth Animations, and Great Performance.",
      company: "Beit AL-Mukhtar",
      avatar: beitAlMukhtarLogo,
      rating: 3.5,
    },
    {
      id: 4,
      name: "Fahed Yunani",
      role: "Accountant",
      text: "Our Success is Not Complete Without Phenix, Which Has Been With Us For More than 11 Years of Excellence",
      company: "Sign Cafe & Restaurant",
      avatar: signCafeLogo,
      rating: 4.5,
    },
  ];

  return (
    <div className=" max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h2
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 text-gradient mb-6 tracking-wide"
        >
          <span>{t("Client")}</span>
          <span style={{ color: mode !== "dark" && "#DC2626" }}>
            {" "}
            {t("Testimonials")}
          </span>
        </h2>
        <p
          className="dark:text-gray-400 text-gray-600 max-w-2xl mx-auto text-xl font-medium"
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "livvic" }}
        >
          {t(
            "See What Our Clients Say About Their Experience With Phenix System",
          )}
        </p>
      </div>

      <div ref={sliderRef} className="testimonials-slider">
        <Swiper
          key={direction} // ← مهم جداً لإجبار إعادة الإنشاء
          dir={direction} // ← تمرير الاتجاه مباشرة
          modules={[Autoplay, Pagination]}
          loop={true}
          speed={800}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          grabCursor={true}
          spaceBetween={30}
          slidesPerView={1} // الافتراضي للموبايل
          breakpoints={{
            // موبايل كبير
            640: {
              slidesPerView: 1,
              centeredSlides: true,
            },
            // تابلت - يظهر كارتين كاملين
            768: {
              slidesPerView: 2,
              centeredSlides: false,
            },
            // شاشات الكمبيوتر - يظهر 3 كروت كاملة ومتساوية
            1024: {
              slidesPerView: 3,
              centeredSlides: false, // تعطل التوسيط هنا ليظهر الـ 3 بجانب بعضهم تماماً
            },
          }}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide>
              <div className="testimonial-slide" key={testimonial.id}>
                <div className="testimonial-card">
                  <div className="testimonial-meta">
                    <div className="testimonial-rating">
                      <RatingStars rating={testimonial.rating} />
                    </div>
                    <div className="testimonial-company text-gradient text-gray-800">
                      {t(testimonial.company)}
                    </div>
                  </div>

                  <div className="testimonial-image">
                    <img src={testimonial.avatar} alt={testimonial.company} />
                  </div>
                </div>

                <div className="quote">
                  <p className="testimonial-quote">{t(testimonial.text)}</p>
                </div>

                <div className="text text-gray-900 dark:text-white/80 leading-relaxed">
                  <h3>
                    {t("Name :")} {t(testimonial.name)}
                  </h3>
                  <p>
                    {t("Role :")} {t(testimonial.role)}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* النقاط (Pagination) تظهر تلقائياً */}
        </Swiper>
      </div>
    </div>
  );
};

export default TestimonialsSection;
