import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

import ProtectedRoute from "../components/common/ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";
import GuestRoute from "./GuestRoute";
import RootChrome from "./RootChrome";
import RouteSuspenseGate from "./RouteSuspenseGate";

import { publicRoutes } from "./PublicRoutes";
import { authRoutes } from "./AuthRoutes";
import { generateRoleRoutes } from "./roleRouteGenerator";

const PublicLayout = lazy(() => import("../components/layout/PublicLayout"));
const AuthLayout = lazy(
  () => import("../features/auth/components/layout/AuthLayout"),
);
const DashboardLayout = lazy(
  () => import("../features/dashboard/components/layout/DashboardLayout"),
);

export const router = createBrowserRouter([
  {
    element: <RootChrome />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<RouteSuspenseGate />}>
            <PublicLayout />
          </Suspense>
        ),
        children: [...publicRoutes],
      },
      {
        element: <GuestRoute />,
        children: [
          {
            element: (
              <Suspense fallback={<RouteSuspenseGate />}>
                <AuthLayout />
              </Suspense>
            ),
            children: [...authRoutes],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: (
              <Suspense fallback={<RouteSuspenseGate />}>
                <DashboardLayout />
              </Suspense>
            ),
            children: [...generateRoleRoutes()],
          },
        ],
      },
    ],
  },
]);
