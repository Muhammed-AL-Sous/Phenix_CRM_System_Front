import { createBrowserRouter } from "react-router/dom";
import RootLayout from "../components/layout/RootLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";

// استيراد مصفوفات المسارات
import { publicRoutes } from "./PublicRoutes";
import { authRoutes } from "./AuthRoutes";
import { adminRoutes } from "./AdminRoutes";
import { userRoutes } from "./userRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // 1. المسارات العامة
      ...publicRoutes,

      // 2. مسارات المصادقة
      ...authRoutes,

      // 3. المسارات المحمية ( Admin & users ) مغلفة بمكون الحماية
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [...adminRoutes],
      },
      {
        element: <ProtectedRoute allowedRoles={["user"]} />,
        children: [...userRoutes],
      },
    ],
  },
]);
