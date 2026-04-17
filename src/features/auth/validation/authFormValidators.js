/** نمط البريد المستخدم في نماذج المصادقة */
export const AUTH_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * أخطاء البريد (مفاتيح i18n تحت error.*).
 * @param {string} email
 * @param {string} [fieldKey="email"]
 * @returns {Record<string, string>}
 */
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

/**
 * قواعد كلمة المرور: 8+، حرف، رقم.
 * @param {string} password
 * @param {string} [fieldKey="password"]
 * @returns {Record<string, string>}
 */
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

/**
 * تأكيد كلمة المرور.
 * @param {string} password
 * @param {string} passwordConfirmation
 * @param {string} [confirmationFieldKey="password_confirmation"]
 * @returns {Record<string, string>}
 */
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

/**
 * @param {string} name
 * @param {string} [fieldKey="name"]
 * @returns {Record<string, string>}
 */
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
