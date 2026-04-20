import { toast } from "sonner";
import i18n from "../i18n";

/**
 * تنبيهات Sonner مع ترجمة تلقائية عبر i18n.
 * تمرّر مفتاح الترجمة ونوع التنبيه فقط.
 *
 * @param {string} key - مفتاح الترجمة (مثل "auth:success.welcome_back")
 * @param {"success"|"error"|"loading"|"warning"|"info"|string} [type="success"]
 * @returns {string|number|undefined} عند type === "loading" يُعاد معرّف التنبيه
 */
export const notifySonner = (key, type = "success") => {
  const message = i18n.t(key);

  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    case "info":
      toast.info(message);
      break;
    case "loading":
      return toast.loading(message);
    default:
      toast(message);
  }
};

/**
 * @param {Promise} promise
 * @param {{ loading: string, success: string, error: string }} [keys]
 */
export const notifySonnerPromise = (
  promise,
  keys = { loading: "", success: "", error: "" },
) => {
  return toast.promise(promise, {
    loading: () => i18n.t(keys.loading),
    success: () => i18n.t(keys.success),
    error: () => i18n.t(keys.error),
  });
};

/** للاستخدامات المتقدمة (إغلاق تنبيه، toast مخصص) */
export { toast as sonnerToast };
