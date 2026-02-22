// Layout Public Components
import Navbar from "./Navbar";
import Footer from "./Footer";

// Utilities Public Components
import { ParticleBackground } from "../utility/ParticleBackground";
import ScrollToTopButton from "../utility/ScrollToTopButton";
import ParticleNetwork from "../utility/ParticleNetwork";

// React & Redux
import { Suspense } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";

const PublicLayout = () => {
  const { mode} = useSelector((state) => state.ui);
  return (
    <div className="dark:bg-[#0a0a0a]">

      {mode === "dark" ?
      ( // Dark Mode
        <ParticleBackground />
      ) : (
        // Light Mode
        <ParticleNetwork />
      )}

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
