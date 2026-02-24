import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";

export const authRoutes = [
  {
    path: "login",
    element: <LoginPage />,
    handle: {
      titleKey: "login",
      subtitleKey: "welcome",
    },
  },
  {
    path: "register",
    element: <RegisterPage />,
    handle: {
      titleKey: "register",
      subtitleKey: "Join our family today",
    },
  },
];
