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

const TestimonialsSection = () => {
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
      name: "John Doe",
      role: "CEO, Company",
      text: "An excellent and modern system, we hope to continue to work and serve customers wherever they are.",
      company: "Dajajati",
      avatar: dajajatiLogo,
      rating: 5,
    },
    {
      id: 2,
      name: "Sarah Smith",
      role: "Marketing Manager",
      text: "The program is more than wonderful. I have many branches. I was able to link and follow up on all the branches.  Everyone is looking for excellence ...Thank you Phenix",
      company: "Bim",
      avatar: BIMLogo,
      rating: 4,
    },
    {
      id: 3,
      name: "Michael Brown",
      role: "Product Designer",
      text: "Clean design, smooth animations, and great performance.",
      company: "Beit AL-Mukhtar",
      avatar: beitAlMukhtarLogo,
      rating: 3.5,
    },
    {
      id: 4,
      name: "Fahed Yunani",
      role: "Accountant",
      text: "Our success is not complete without Phenix, which has been with us for more than 11 years of excellence",
      company: "Sign Cafe & Restaurant",
      avatar: signCafeLogo,
      rating: 4.5,
    },
  ];

  return (
    <div className="py-16 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient mb-6">
          Client Testimonials
        </h2>
        <p
          className="text-gray-400 max-w-2xl mx-auto text-lg"
          style={{ fontFamily: "livvic", fontWeight: 500 }}
        >
          See what our clients say about their experience with Phenix System
        </p>
      </div>

      <div ref={sliderRef} className="testimonials-slider">
        <Swiper
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
          {/* Slide 1 */}
          {testimonials.map((testimonial) => (
            <SwiperSlide>
              <div className="testimonial-slide" key={testimonial.id}>
                <div className="testimonial-card">
                  <div className="testimonial-image">
                    <img src={testimonial.avatar} alt={testimonial.company} />
                  </div>

                  <div className="testimonial-meta">
                    <div className="testimonial-rating">
                      <RatingStars rating={testimonial.rating} />
                    </div>
                    <div className="testimonial-company text-gradient">
                      {testimonial.company}
                    </div>
                  </div>
                </div>

                <div className="quote">
                  <p className="testimonial-quote">{testimonial.text}</p>
                </div>

                <div className="text">
                  <h3>Name : {testimonial.name}</h3>
                  <p>Role : {testimonial.role}</p>
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
