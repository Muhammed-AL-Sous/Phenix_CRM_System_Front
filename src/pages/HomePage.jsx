import { RevealSection } from "../components/utility/RevealSection";
import HeroSection from "../components/common/HeroSection";
import FeaturesSection from "../components/common/FeaturesSection";
import ServicesSection from "../components/common/ServicesSection";
import TestimonialsSection from "../components/common/TestimonialsSection";

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <RevealSection
        className="relative overflow-x-hidden mx-auto px-4
        dark:bg-linear-to-b dark:from-black/60 dark:via-black/40 dark:to-black/60"
      >
        <HeroSection />
      </RevealSection>
      {/* === Hero Section ==== */}

      {/* Features Section */}
      <RevealSection
        className="relative overflow-x-hidden px-4 mx-auto
       dark:bg-linear-to-b dark:from-black/60 dark:via-black/40 dark:to-black/60"
      >
        <FeaturesSection />
      </RevealSection>
      {/* ==== Features Section ==== */}

      {/* Services Section */}
      <RevealSection
        className="relative overflow-x-hidden px-4 mx-auto
         dark:bg-linear-to-b dark:from-black/60 dark:via-black/40 dark:to-black/60"
      >
        <ServicesSection />
      </RevealSection>
      {/* ==== Services Section ==== */}

      {/* Testimonials Section */}
      <RevealSection
        className="relative overflow-x-hidden px-4 mx-auto
        dark:bg-linear-to-b dark:from-black/60 dark:via-black/40 dark:to-black/60"
      >
        <TestimonialsSection />
      </RevealSection>
      {/* ==== Testimonials Section ==== */}
    </>
  );
};

export default HomePage;
