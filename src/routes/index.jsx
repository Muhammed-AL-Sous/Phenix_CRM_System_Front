import { createBrowserRouter } from "react-router";

// Layouts Components
import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../features/auth/components/layout/AuthLayout";
import DashboardLayout from "../features/dashboard/components/layout/DashboardLayout";

import ErrorPage from "../pages/ErrorPage";

// Routes Arrays
import { publicRoutes } from "./PublicRoutes";
import { authRoutes } from "./AuthRoutes";
import { generateRoleRoutes } from "./roleRouteGenerator";

export const router = createBrowserRouter([
  // 🌐 Public Pages
  {
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [...publicRoutes],
  },

  // 🔐 Auth Pages
  {
    children: [...authRoutes],
  },

  // 📊 Dashboard
  {
    element: <DashboardLayout />,
    children: [...generateRoleRoutes()],
  },
]);
