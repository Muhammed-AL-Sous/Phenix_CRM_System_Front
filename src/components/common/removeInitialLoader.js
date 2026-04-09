/** إزالة لودر الـ HTML الأولي (#initial-loader) بعد أن يتحكم React بالواجهة */
export function removeInitialLoader() {
  const el = document.getElementById("initial-loader");
  if (el?.parentNode) {
    el.remove();
  }
}
