/** نمط البريد المستخدم في نماذج المصادقة */
export const AUTH_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export function collectAuthEmailErrors(email, fieldKey = "email") {
  const trimmed = typeof email === "string" ? email.trim() : "";
  const out = {};
  if (!trimmed) {
    out[fieldKey] = "error.email_required";
    return out;
  }
  if (!AUTH_EMAIL_REGEX.test(trimmed)) {
    out[fieldKey] = "error.email_invalid";
  }
  return out;
}


export function collectAuthPasswordPolicyErrors(password, fieldKey = "password") {
  const out = {};
  if (!password) {
    out[fieldKey] = "error.password_required";
    return out;
  }
  if (
    password.length < 8 ||
    !/[a-zA-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    out[fieldKey] = "error.password_length_letter_error";
  }
  return out;
}


export function collectAuthPasswordConfirmationErrors(
  password,
  passwordConfirmation,
  confirmationFieldKey = "password_confirmation",
) {
  const out = {};
  if (!passwordConfirmation) {
    out[confirmationFieldKey] = "error.confirm_password_required";
    return out;
  }
  if (password !== passwordConfirmation) {
    out[confirmationFieldKey] = "error.passwords_dont_match";
  }
  return out;
}


export function collectAuthNameErrors(name, fieldKey = "name") {
  const trimmed = typeof name === "string" ? name.trim() : "";
  if (trimmed) return {};
  return { [fieldKey]: "error.name_required" };
}

/**
 * دمج أخطاء عدة حقول (بدون تضارب المفاتيح).
 * @param {...Record<string, string>} parts
 * @returns {Record<string, string>}
 */
export function mergeFieldErrors(...parts) {
  return Object.assign({}, ...parts);
}

/** @param {{ email: string, password: string }} values */
export function getLoginFormErrors(values) {
  return mergeFieldErrors(
    collectAuthEmailErrors(values.email),
    collectAuthPasswordPolicyErrors(values.password),
  );
}

/** @param {{ name: string, email: string, password: string, password_confirmation: string }} values */
export function getRegisterFormErrors(values) {
  return mergeFieldErrors(
    collectAuthNameErrors(values.name),
    collectAuthEmailErrors(values.email),
    collectAuthPasswordPolicyErrors(values.password),
    collectAuthPasswordConfirmationErrors(
      values.password,
      values.password_confirmation,
    ),
  );
}

/** @param {{ password: string, password_confirmation: string }} values */
export function getResetPasswordFormErrors(values) {
  return mergeFieldErrors(
    collectAuthPasswordPolicyErrors(values.password),
    collectAuthPasswordConfirmationErrors(
      values.password,
      values.password_confirmation,
    ),
  );
}

/** نفس منطق البريد لصفحة نسيت كلمة المرور (كائن خطأ بحقل email). */
export function getForgotPasswordEmailErrors(email) {
  return collectAuthEmailErrors(email, "email");
}
