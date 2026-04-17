import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { notify } from "../../../lib/notify";
import { selectCurrentUser } from "../../auth/authSlice";
import {
  useAddUserMutation,
  useGetAdminUserQuery,
  useGetRolesQuery,
  useUpdateUserMutation,
} from "../usersApiSlice";

function firstValidationMessage(errors) {
  if (!errors || typeof errors !== "object") return null;
  for (const v of Object.values(errors)) {
    if (Array.isArray(v) && v[0]) return String(v[0]);
    if (typeof v === "string" && v.trim()) return v;
  }
  return null;
}

function UsersModalForm({
  isEdit,
  userId,
  scope,
  initialName,
  initialEmail,
  initialRoleId,
  rolesLoading,
  roleOptions,
  onSuccess,
}) {
  const { t } = useTranslation("user");

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [roleId, setRoleId] = useState(initialRoleId);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [addUser, { isLoading: adding }] = useAddUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const busy = adding || updating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !roleId) {
      notify("user:users.validation_missing", "error");
      return;
    }

    const parsedRoleId = Number.parseInt(String(roleId), 10);
    if (!Number.isFinite(parsedRoleId)) {
      notify("user:users.validation_missing", "error");
      return;
    }

    const pwd = password.trim();
    const pwd2 = passwordConfirmation.trim();

    if (!isEdit) {
      if (pwd.length < 8) {
        notify("user:users.validation_password_short", "error");
        return;
      }
      if (pwd !== pwd2) {
        notify("user:users.validation_password_mismatch", "error");
        return;
      }
    } else if (pwd || pwd2) {
      if (pwd.length < 8) {
        notify("user:users.validation_password_short", "error");
        return;
      }
      if (pwd !== pwd2) {
        notify("user:users.validation_password_mismatch", "error");
        return;
      }
    }

    try {
      if (!isEdit) {
        await addUser({
          scope,
          name: name.trim(),
          email: email.trim(),
          role_id: parsedRoleId,
          password: pwd,
          password_confirmation: pwd2,
        }).unwrap();
        notify("user:users.toast_created", "success");
      } else {
        const body = {
          id: userId,
          scope,
          name: name.trim(),
          email: email.trim(),
          role_id: parsedRoleId,
        };
        if (pwd) {
          body.password = pwd;
          body.password_confirmation = pwd2;
        }
        await updateUser(body).unwrap();
        notify("user:users.toast_updated", "success");
      }
      onSuccess?.();
    } catch (err) {
      const data = err?.data;
      const msg = data?.message;
      const fromFields = firstValidationMessage(data?.errors);
      const resolved =
        (typeof msg === "string" && msg.trim() ? msg : null) || fromFields;
      notify(
        resolved && String(resolved).trim()
          ? String(resolved).trim()
          : "user:users.toast_save_failed",
        "error",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("users.name")}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          autoComplete="name"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("users.email")}
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("users.role")}
        </label>
        <select
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          required
          disabled={rolesLoading}
        >
          <option value="" disabled>
            {rolesLoading ? "…" : "—"}
          </option>
          {roleOptions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("users.password")}
          {isEdit ? (
            <span className="ms-1 font-normal text-slate-500 dark:text-slate-400">
              ({t("users.optional_password_hint")})
            </span>
          ) : null}
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          autoComplete={isEdit ? "new-password" : "new-password"}
          required={!isEdit}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("users.password_confirmation")}
        </label>
        <input
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          type="password"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          autoComplete="new-password"
          required={!isEdit}
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-2 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        {busy
          ? t("users.saving")
          : isEdit
            ? t("users.save_changes")
            : t("users.add_user")}
      </button>
    </form>
  );
}

export default function UsersModal({
  isOpen,
  userId,
  modalKey = 0,
  onClose,
  onSuccess,
}) {
  const { t } = useTranslation("user");
  const currentUser = useSelector(selectCurrentUser);
  const scope = currentUser?.role;

  const { direction } = useSelector((state) => state.ui);
  const dir = direction === "rtl" ? "rtl" : "ltr";

  const isEdit = userId != null && userId !== "";

  const { data: roles, isLoading: rolesLoading } = useGetRolesQuery(undefined, {
    skip: !isOpen,
  });

  const {
    data: existingUser,
    isLoading: userLoading,
    isFetching: userFetching,
  } = useGetAdminUserQuery(userId, {
    skip: !isOpen || !isEdit,
  });

  const roleOptions = useMemo(() => {
    const safe = Array.isArray(roles) ? roles : [];
    return safe.map((r) => ({
      id: r.id,
      name: r.label || r.name,
    }));
  }, [roles]);

  const portalTarget =
    typeof document !== "undefined" ? document.body : null;

  const formRemountKey = `${modalKey}-${isEdit ? String(userId) : "create"}`;

  if (!portalTarget) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="users-modal-root"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          dir={dir}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-1 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEdit ? t("users.edit_user") : t("users.add_user")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-800"
              >
                {t("users.close")}
              </button>
            </div>

            {isEdit && (userLoading || userFetching) && !existingUser ? (
              <div className="mt-8 flex justify-center py-6">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-400 border-t-transparent dark:border-slate-500" />
              </div>
            ) : (
              <UsersModalForm
                key={formRemountKey}
                isEdit={isEdit}
                userId={userId}
                scope={scope}
                initialName={
                  isEdit && existingUser ? (existingUser.name ?? "") : ""
                }
                initialEmail={
                  isEdit && existingUser ? (existingUser.email ?? "") : ""
                }
                initialRoleId={
                  isEdit && existingUser && existingUser.role_id != null
                    ? String(existingUser.role_id)
                    : ""
                }
                rolesLoading={rolesLoading}
                roleOptions={roleOptions}
                onSuccess={onSuccess}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalTarget,
  );
}
