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
      titleKey: "common.login",
      subtitleKey: "common.welcome",
    },
  },
  {
    path: "forgot_password",
    element: <ForgotPasswordPage />,
    handle: {
      titleKey: "common.find your account",
      subtitleKey: "password.forgot_password_desc",
    },
  },

  {
    path: "register",
    element: <RegisterPage />,
    handle: {
      titleKey: "common.register",
      subtitleKey: "common.Join our family today",
    },
  },
  {
    path: "verify-email",
    element: <VerifyEmailPage />,
    handle: {
      titleKey: "email.Verify_Your_Email",
      subtitleKey: "code.We have sent a verification code to this email address",
    },
  },
];
