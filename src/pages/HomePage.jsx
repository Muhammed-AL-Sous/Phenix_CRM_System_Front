import { RevealSection } from "../components/utility/RevealSection";
import HeroSection from "../components/common/HeroSection";
import FeaturesSection from "../components/common/FeaturesSection";
import ServicesSection from "../components/common/ServicesSection";

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <RevealSection
        className="relative min-h-screen overflow-x-hidden px-4 mx-auto
        bg-linear-to-b from-black/60 via-black/40 to-black/60"
      >
        <HeroSection />
      </RevealSection>
      {/* === Hero Section ==== */}

      {/* Features Section */}
      <RevealSection
        className="relative overflow-x-hidden px-4 mx-auto
        bg-linear-to-b from-black/60 via-black/40 to-black/60"
      >
        <FeaturesSection />
      </RevealSection>
      {/* ==== Features Section ==== */}

      {/* Services Section */}
      <RevealSection
        className="relative overflow-x-hidden px-4 mx-auto
        bg-linear-to-b from-black/60 via-black/40 to-black/60"
      >
        <ServicesSection />
      </RevealSection>

      {/* ==== Services Section ==== */}
    </>
  );
};

export default HomePage;
