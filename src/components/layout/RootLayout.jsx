import { Suspense } from "react";
import { Outlet } from "react-router/dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function RootLayout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <main style={{ flexGrow: 1 }}>
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

      <Footer />
    </div>
  );
}
