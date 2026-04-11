import { ROLES_CONFIG } from "../../routes/roles.config";

/**
 * Where to send the user after login, verify-email, or password reset.
 * Clients without a CRM profile go to onboarding first; staff roles are unchanged.
 */
export function getPostAuthDestination(user, options = {}) {
  const { fallbackPath } = options;

  if (!user) {
    return "/login";
  }

  if (!user.is_active) {
    return "/verify-email";
  }

  if (user.role === "client" && user.requires_client_profile === true) {
    return "/client/complete-profile";
  }

  if (
    fallbackPath &&
    fallbackPath !== "/login" &&
    fallbackPath !== "/register" &&
    fallbackPath !== "/client/complete-profile"
  ) {
    return fallbackPath;
  }

  const prefix = ROLES_CONFIG[user.role]?.prefix || "";
  return prefix ? `/${prefix}` : "/login";
}
