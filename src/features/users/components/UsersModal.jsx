/**
 * Placeholder — ربط لاحقاً بـ POST /api/admin/users (addUser)
 */
export default function UsersModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Add user
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          User creation form will be connected here (name, email, password, role).
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-slate-200 py-2 font-medium text-slate-800 hover:bg-slate-300 dark:bg-zinc-800 dark:text-slate-100 dark:hover:bg-zinc-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
