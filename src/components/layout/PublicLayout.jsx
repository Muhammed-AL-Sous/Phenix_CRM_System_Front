import { ParticleBackground } from "../utility/ParticleBackground";
import Navbar from "./Navbar";
import { Suspense } from "react";
import { Outlet } from "react-router";
import ScrollToTopButton from "../utility/ScrollToTopButton";
import Footer from "./Footer";

const PublicLayout = () => {
  return (
    <div className="bg-[#0a0a0a] text-white">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <Suspense
          fallback={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Loading...
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default PublicLayout;
