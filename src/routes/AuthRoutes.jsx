// Auth Pages
import LoginPage from "../features/auth/pages/LoginPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";

export const authRoutes = [
  {
    path: "login",
    element: <LoginPage />,
    handle: {
      titleKey: "auth.login.login",
      subtitleKey: "auth.common.welcome",
    },
  },
  {
    path: "forgot_password",
    element: <ForgotPasswordPage />,
    handle: {
      titleKey: "auth.common.find your account",
      subtitleKey: "auth.password.forgot_password_desc",
    },
  },

  {
    path: "register",
    element: <RegisterPage />,
    handle: {
      titleKey: "auth.register.register",
      subtitleKey: "auth.common.Join our family today",
    },
  },
  {
    path: "verify-email",
    element: <VerifyEmailPage />,
    handle: {
      titleKey: "auth.email.Verify_Your_Email",
      subtitleKey: "auth.email.We have sent a verification code to this email address",
    },
  },
];
