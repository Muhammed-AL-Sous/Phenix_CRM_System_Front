import { lazy } from "react";

// الاستيراد لن يحدث إلا عند الحاجة
const UserDashboardPage = lazy(
  () => import("../features/user/pages/UserDashboardPage"),
);

const UserProfilePage = lazy(
  () => import("../features/user/pages/UserProfilePage"),
);

export const userRoutes = [
  { path: "user/dashboard", element: <UserDashboardPage /> },
  { path: "user/profile", element: <UserProfilePage /> },
];
