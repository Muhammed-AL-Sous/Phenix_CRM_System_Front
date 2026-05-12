import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";

export default function DeleteUserConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  userLabel,
}) {
  const { t } = useTranslation("user");
  const { direction } = useSelector((state) => state.ui);
  const dir = direction === "rtl" ? "rtl" : "ltr";
  const portalTarget =
    typeof document !== "undefined" ? document.body : null;

  if (!portalTarget) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="delete-user-confirm"
          dir={dir}
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >

          {/* ======== Start Backdrop ======== */}
          <button
            type="button"
            aria-label={t("users.close")}
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity"
            onClick={() => {
              if (!isDeleting) onClose();
            }}
            disabled={isDeleting}
          />
          {/* ======== End Backdrop ======== */}

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-user-confirm-title"
            aria-describedby="delete-user-confirm-desc"
            className="relative z-61 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            onClick={(ev) => ev.stopPropagation()}
          >
            <h2
              id="delete-user-confirm-title"
              className="text-lg font-bold text-slate-900 dark:text-red-500/90"
            >
              {t("users.delete_user")}
            </h2>
            <div
              id="delete-user-confirm-desc"
              className="mt-3 text-sm font-[Livvic] rtl:font-[Vazirmatn] leading-relaxed font-semibold text-slate-900 dark:text-slate-300"
            >
              {t("users.confirmDelete")}
              {userLabel ? (
                <span className="mt-1 block font-medium font-[Livvic] text-slate-800 dark:text-slate-100">
                  {userLabel}
                </span>
              ) : null}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-slate-200 dark:hover:bg-zinc-700 cursor-pointer"
              >
                {t("users.cancel")}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white dark:text-slate-200 hover:bg-red-700 disabled:opacity-60 dark:bg-red-500/90 dark:hover:bg-red-700 cursor-pointer transition-colors duration-200 will-change-transform"
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : null}
                {t("users.confirm_delete_action")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    portalTarget,
  );
}
