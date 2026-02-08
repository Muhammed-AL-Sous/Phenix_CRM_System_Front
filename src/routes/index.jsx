
import { createBrowserRouter } from "react-router";

import RootLayout from "../components/layout/RootLayout";
import DashboardLayout from "../features/dashboard/components/layout/DashboardLayout";
import ErrorPage from "../pages/ErrorPage";

// استيراد مصفوفات المسارات
import { publicRoutes } from "./PublicRoutes";
import { authRoutes } from "./AuthRoutes";
import { generateRoleRoutes } from "./roleRouteGenerator";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...publicRoutes,
      ...authRoutes,
      {
        element: <DashboardLayout />,
        children: [...generateRoleRoutes()],
      },
    ],
  },
]);
