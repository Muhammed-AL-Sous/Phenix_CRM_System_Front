/**
 * يمنع عرض نفس إشعار البث أكثر من مرة خلال نافذة قصيرة.
 * يُستخدم مع Laravel Echo + React Strict Mode (تشغيل الـ effect مرتين) أو اشتراك مزدوج لحظي.
 */
const WINDOW_MS = 5000;
const seen = new Map();

export function shouldShowBroadcastToast(notification) {
  if (!notification || typeof notification !== "object") {
    return true;
  }

  const id = notification.id;
  const msg = String(notification.message ?? "");
  const key = id ? `id:${id}` : `msg:${msg}`;

  const now = Date.now();
  const last = seen.get(key);
  if (last !== undefined && now - last < WINDOW_MS) {
    return false;
  }

  seen.set(key, now);

  if (seen.size > 300) {
    for (const [k, t] of seen) {
      if (now - t > 60000) {
        seen.delete(k);
      }
    }
  }

  return true;
}
