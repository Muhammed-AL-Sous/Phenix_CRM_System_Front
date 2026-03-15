import toast from "react-hot-toast";
import i18n from "../i18n";

/**
 * دالة موحدة لإرسال التنبيهات
 * @param {string} key - مفتاح الترجمة (Translation Key)
 * @param {string} type - نوع التنبيه (success, error, loading)
 */
export const notify = (key, type = "success") => {
  const message = i18n.t(key); // جلب النص المترجم فوراً

  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "loading":
      return toast.loading(message); // نعيد الـ ID لإغلاقه لاحقاً
    default:
      toast(message);
  }
};

export const notifyPromise = (
  promise,
  keys = { loading: "", success: "", error: "" },
) => {
  return toast.promise(promise, {
    // نمرر دوال ترجع النص المترجم لضمان استدعائها في لحظة ظهور التنبيه
    loading: () => i18n.t(keys.loading),
    success: () => i18n.t(keys.success),
    error: () => i18n.t(keys.error),
  });
};
