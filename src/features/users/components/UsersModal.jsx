import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { notify } from "../../../lib/notify";
import { selectCurrentUser } from "../../auth/authSlice";
import { useAddUserMutation, useGetRolesQuery } from "../usersApiSlice";

export default function UsersModal({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation("user");
  const currentUser = useSelector(selectCurrentUser);
  const scope = currentUser?.role;

  const { direction } = useSelector((state) => state.ui);
  const dir = direction === "rtl" ? "rtl" : "ltr";

  const { data: roles, isLoading: rolesLoading } = useGetRolesQuery(undefined, {
    skip: !isOpen,
  });

  const roleOptions = useMemo(() => {
    const safe = Array.isArray(roles) ? roles : [];
    return safe.map((r) => ({
      id: r.id,
      name: r.label || r.name,
    }));
  }, [roles]);

  const [addUser, { isLoading }] = useAddUserMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setRoleId("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !roleId) {
      notify("auth:error.missing_fields", "error");
      return;
    }

    if (password.length < 8) {
      notify("auth:error.password_too_short", "error");
      return;
    }

    if (password !== passwordConfirmation) {
      notify("auth:error.password_mismatch", "error");
      return;
    }

    try {
      await addUser({
        scope,
        name: name.trim(),
        email: email.trim(),
        role_id: Number(roleId),
        password,
        password_confirmation: passwordConfirmation,
      }).unwrap();

      notify("auth:success.user_created", "success");
      onSuccess?.();
    } catch (err) {
      notify(err?.data?.message || "auth:error.create_failed", "error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      dir={dir}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("users.add_user")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-800"
          >
            {t("common.close") || "Close"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("users.name") || "Name"}
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
              {t("users.email") || "Email"}
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
              {t("users.role") || "Role"}
            </label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              required
              disabled={rolesLoading}
            >
              <option value="" disabled>
                {rolesLoading ? "Loading..." : "Select role"}
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
              {t("users.password") || "Password"}
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("users.password_confirmation") || "Confirm password"}
            </label>
            <input
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              type="password"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {isLoading ? "Saving..." : t("users.add_user")}
          </button>
        </form>
      </div>
    </div>
  );
}
