import { lazy } from "react";

// الاستيراد لن يحدث إلا عند الحاجة
const AdminDashboardPage = lazy(
  () => import("../features/admin/pages/AdminDashboardPage"),
);


export const adminRoutes = [
  { path: "admin/dashboard", element: <AdminDashboardPage /> },
  { path: "admin/users", element: <AdminShowUsersPage /> },
  { path: "admin/profile", element: <AdminProfilePage /> },
];
