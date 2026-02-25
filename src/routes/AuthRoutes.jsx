// Auth Pages
import LoginPage from "../features/auth/pages/LoginPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
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
  {
    path: "forgot_password",
    element: <ForgotPasswordPage />,
    handle: {
      titleKey: "find your account",
      subtitleKey: "enter your email.",
    },
  },
];
