// Auth Pages
import RegisterPage from "../features/auth/pages/RegisterPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import LoginPage from "../features/auth/pages/LoginPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";

export const authRoutes = [
  {
    path: "login",
    element: <LoginPage />,
    handle: {
      titleKey: "common.login",
      subtitleKey: "common.welcome",
      descriptionKey: "",
    },
  },

  {
    path: "forgot-password",
    element: <ForgotPasswordPage />,
    handle: {
      titleKey: "common.find your account",
      subtitleKey: "password.forgot_password_desc",
      descriptionKey: "",
    },
  },

  {
    path: "reset-password",
    element: <ResetPasswordPage />,
    handle: {
      titleKey: "password.Set a New Password",
      subtitleKey: "password.Create a new password to secure your account.",
      descriptionKey: "password.Make sure it’s strong and unique.",
    },
  },

  {
    path: "register",
    element: <RegisterPage />,
    handle: {
      titleKey: "common.register",
      subtitleKey: "common.Your Journey Starts Here",
      descriptionKey: "common.Take the first step toward an exceptional experience",
    },
  },
  {
    path: "verify-email",
    element: <VerifyEmailPage />,
    handle: {
      titleKey: "email.Verify_Your_Email",
      subtitleKey:
        "code.We have sent a verification code to this email address",
      descriptionKey: "",
    },
  },
];
