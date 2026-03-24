import { createBrowserRouter } from "react-router";

// Layouts Components
import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../features/auth/components/layout/AuthLayout";
import DashboardLayout from "../features/dashboard/components/layout/DashboardLayout";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "../components/common/ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";

// Routes Arrays
import { publicRoutes } from "./PublicRoutes";
import { authRoutes } from "./AuthRoutes";
import { generateRoleRoutes } from "./roleRouteGenerator";

export const router = createBrowserRouter([
  // 🌐 Public Pages
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [...publicRoutes],
  },

  // 🔐 Auth Pages
  {
    element: <GuestRoute />, // Protects "Auth" pages from "Members"
    children: [
      {
        element: <AuthLayout />,
        children: [...authRoutes], // هنا يوجد /login و /register
      },
    ],
  },

  // 📊 Dashboard
  {
    // حماية عامة: تمنع أي شخص غير مسجل دخول من رؤية الـ Layout أصلاً
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        // هنا الـ generateRoleRoutes ستكمل حماية "الأدوار" (admin, support, الخ)
        children: [...generateRoleRoutes()],
      },
    ],
  },
]);
