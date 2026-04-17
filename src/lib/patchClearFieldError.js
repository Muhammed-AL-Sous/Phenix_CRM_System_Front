/**
 * لاستخدامه مع setErrors عند تغيير حقل: يزيل مفتاح الخطأ لهذا الحقل فقط إن وُجد.
 * @template T
 * @param {T} prevErrors
 * @param {string} fieldName
 * @returns {T}
 */
export function patchClearFieldError(prevErrors, fieldName) {
  if (!prevErrors || !prevErrors[fieldName]) return prevErrors;
  return { ...prevErrors, [fieldName]: null };
}
