/** تبديل إظهار/إخفاء كلمة المرور أو التأكيد مع الحفاظ على موضع المؤشر (موبايل/كيبورد). */
export function handleDualPasswordFieldToggle(e, type, ctx) {
  e.preventDefault();

  const isMain = type === "password";
  const input = isMain
    ? ctx.passwordRef.current
    : ctx.passwordConfirmRef.current;

  if (!input) return;

  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (isMain) ctx.setShowPassword((prev) => !prev);
  else ctx.setShowConfirmPassword((prev) => !prev);

  requestAnimationFrame(() => {
    input.setSelectionRange(start, end);
    input.focus();
  });
}
