import { lazy } from "react";

// الاستيراد لن يحدث إلا عند الحاجة
const UserDashboardPage = lazy(
  () => import("../features/user/pages/UserDashboardPage"),
);

const UserProfilePage = lazy(
  () => import("../features/user/pages/UserProfilePage"),
);

export const customersRoutes = [
  { path: "customer/dashboard", element: <UserDashboardPage /> },
  { path: "customer/profile", element: <UserProfilePage /> },
];
