/**
 * يحوّل عدد الثواني إلى صيغة MM:SS (مثلاً للعداد التنازلي).
 * @param {number} seconds
 * @returns {string}
 */
export function formatTimeMmSs(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
