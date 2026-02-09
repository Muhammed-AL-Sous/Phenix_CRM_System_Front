import { Suspense } from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Suspense
        fallback={
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AuthLayout;
