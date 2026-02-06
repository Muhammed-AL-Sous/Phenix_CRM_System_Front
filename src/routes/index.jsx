import { createBrowserRouter } from "react-router/dom";
import RootLayout from "../components/layout/RootLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";

// استيراد مصفوفات المسارات
import { publicRoutes } from "./PublicRoutes";
import { authRoutes } from "./AuthRoutes";
import { adminRoutes } from "./AdminRoutes";
import { userRoutes } from "./userRoutes";
import { customersRoutes } from "./customersRoutes";

import DashboardLayout from "../features/dashboard/components/layout/DashboardLayout";
import ProfilePage from "../features/dashboard/pages/ProfilePage";

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

      {
        element: (
          <ProtectedRoute allowedRoles={["admin", "user", "customer"]} />
        ),
        children: [
          {
            element: <DashboardLayout />,
            children: [
              // مسارات المدير
              {
                element: <ProtectedRoute allowedRoles={["admin"]} />,
                children: adminRoutes, // ستعرض داخل Outlet الـ DashboardLayout
              },
              // مسارات المستخدم العادي
              {
                element: <ProtectedRoute allowedRoles={["user"]} />,
                children: userRoutes,
              },
              // مسارات العميل
              {
                element: <ProtectedRoute allowedRoles={["customer"]} />,
                children: customersRoutes,
              },
              // مسارات مشتركة يراها الجميع داخل الداشبورد
              {
                path: "dashboard/profile",
                element: <ProfilePage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
