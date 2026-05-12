// React & Redux
import { useCallback, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";

// Slices
import { selectCurrentUser } from "../../auth/authSlice";

// API Slices
import {
  useAddUserMutation,
  useGetAdminUserQuery,
  useGetRolesQuery,
  useUpdateUserMutation,
} from "../usersApiSlice";

// Icons
import {
  UserRoundPlus,
  Mail,
  Lock,
  LockKeyhole,
  UserRoundKey,
  EyeOff,
  Eye,
  X,
} from "lucide-react";

// Utils & External Libs & Components
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { notifySonner } from "../../../lib/notifySonner";
import FormListbox from "../../../components/utility/FormListbox";
import { handleDualPasswordFieldToggle } from "../../auth/utils/dualPasswordFieldToggle";

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
  hideRoleField = false,
  onSuccess,
}) {
  const { t } = useTranslation("user");
  const { direction } = useSelector((state) => state.ui);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [roleId, setRoleId] = useState(initialRoleId);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [addUser, { isLoading: adding }] = useAddUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const busy = adding || updating;

  // ========= Refs ========= //
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  // =============================
  // Toggle Logic (Keyboard Fix)
  // =============================
  const handleToggle = useCallback(
    (e, type) =>
      handleDualPasswordFieldToggle(e, type, {
        passwordRef,
        passwordConfirmRef,
        setShowPassword,
        setShowConfirmPassword,
      }),
    [],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !roleId) {
      notifySonner("user:users.validation_missing", "error");
      return;
    }

    const parsedRoleId = Number.parseInt(String(roleId), 10);
    if (!Number.isFinite(parsedRoleId)) {
      notifySonner("user:users.validation_missing", "error");
      return;
    }

    const pwd = password.trim();
    const pwd2 = passwordConfirmation.trim();

    if (!isEdit) {
      if (pwd.length < 8) {
        notifySonner("user:users.validation_password_short", "error");
        return;
      }
      if (pwd !== pwd2) {
        notifySonner("user:users.validation_password_mismatch", "error");
        return;
      }
    } else if (pwd || pwd2) {
      if (pwd.length < 8) {
        notifySonner("user:users.validation_password_short", "error");
        return;
      }
      if (pwd !== pwd2) {
        notifySonner("user:users.validation_password_mismatch", "error");
        return;
      }
    }

    try {
      // For creation, we require password. For update, password is optional and only sent if user wants to change it.
      if (!isEdit) {
        await addUser({
          scope,
          name: name.trim(),
          email: email.trim(),
          role_id: parsedRoleId,
          password: pwd,
          password_confirmation: pwd2,
        }).unwrap();
        notifySonner("user:users.toast_created", "success");
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
        notifySonner("user:users.toast_updated", "success");
      }
      // Trigger Parent Callback To Refresh List Or Close Modal
      onSuccess?.();
    } catch (err) {
      const data = err?.data;
      const msg = data?.message;
      const fromFields = firstValidationMessage(data?.errors);
      const resolved =
        (typeof msg === "string" && msg.trim() ? msg : null) || fromFields;
      notifySonner(
        resolved && String(resolved).trim()
          ? String(resolved).trim()
          : "user:users.toast_save_failed",
        "error",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {/* ===== Name Field ===== */}
      <div>
        <label
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Livvic" }}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          <span>
            <UserRoundPlus
              style={{
                top: direction === "rtl" ? "-2px" : "",
              }}
              className="w-4 h-4 relative"
            />
          </span>
          {t("users.name")}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium font-[livvic] text-slate-800 outline-none transition focus:ring-1 focus:ring-slate-300 dark:focus:ring-red-500/50 dark:focus:border-red-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          autoComplete="name"
          placeholder="John Doe"
        />
      </div>

      {/* ===== Email Field ===== */}
      <div>
        <label
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Livvic" }}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          <span>
            <Mail
              style={{
                top: direction === "rtl" ? "-2px" : "",
              }}
              className="w-4 h-4 relative"
            />
          </span>
          {t("users.email")}
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium font-[livvic] text-slate-800 outline-none transition focus:ring-1 focus:ring-slate-300 dark:focus:ring-red-500/50 dark:focus:border-red-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          autoComplete="email"
          placeholder="name@company.com"
        />
      </div>

      {/* ===== Role Field ===== */}
      {!hideRoleField ? (
        <div>
          <label
            style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Livvic" }}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            <span>
              <UserRoundKey
                style={{
                  top: direction === "rtl" ? "-2px" : "",
                }}
                className="w-4 h-4 relative"
              />
            </span>
            {t("users.role")}
          </label>

          <FormListbox
            id="users-modal-role"
            value={roleId}
            onChange={(v) => setRoleId(v)}
            disabled={rolesLoading}
            loading={rolesLoading}
            options={roleOptions}
            placeholder={t("roles.title")}
          />
        </div>
      ) : null}

      {/* ===== Password Field ===== */}
      <div>
        <label
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Livvic" }}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          <span>
            <Lock
              style={{ top: direction === "rtl" ? "-2px" : "" }}
              className="w-4 h-4 relative"
            />
          </span>
          {t("users.password")}
          {isEdit ? (
            <span className="ms-1 text-[11px] font-medium font-[Livvic] rtl:font-[Vazirmatn] text-slate-500 dark:text-slate-400">
              ( {t("users.optional_password_hint")} )
            </span>
          ) : null}
        </label>
        <div className="relative">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            style={{
              letterSpacing:
                !showPassword && password.length > 0 ? "0.2em" : "normal",
            }}
            className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium font-[livvic] text-slate-800 outline-none transition-all focus:ring-1 focus:ring-slate-300 dark:focus:ring-red-500/50 dark:focus:border-red-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white
         ${direction === "rtl" ? "text-right" : "text-left"}`}
            autoComplete={isEdit ? "new-password" : "new-password"}
            // required={!isEdit}
            dir={password.length > 0 ? "ltr" : "inherit"}
            placeholder="••••••••"
          />
          {/* ======= Icon Show Hide Password ======= */}
          <button
            type="button"
            className={`absolute top-1/2 -translate-y-1/2
                  ${direction === "rtl" ? "left-4" : "right-4"}`}
            onMouseDown={(e) => handleToggle(e, "password")}
            style={{
              cursor: "pointer",
              zIndex: 10,
              color: "#6c757d",
              fontSize: "18px",
            }}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      {/* ===== Password Confirmation Field ===== */}
      <div>
        <label
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Livvic",
          }}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          <span>
            <LockKeyhole
              style={{ top: direction === "rtl" ? "-2px" : "" }}
              className="w-4 h-4 relative"
            />
          </span>
          {t("users.password_confirmation")}
        </label>
        <div className="relative">
          <input
            name="password_confirmation"
            ref={passwordConfirmRef}
            type={showConfirmPassword ? "text" : "password"}
            style={{
              fontFamily: "Livvic",
              fontWeight: "500",
              letterSpacing:
                !showConfirmPassword && passwordConfirmation.length > 0
                  ? "0.2em"
                  : "normal",
            }}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium font-[livvic] text-slate-800 outline-none transition-all focus:ring-1 focus:ring-slate-300 dark:focus:ring-red-500/50 dark:focus:border-red-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white
         ${direction === "rtl" ? "text-right" : "text-left"}`}
            autoComplete="new-password"
            // required={!isEdit}
            dir={passwordConfirmation.length > 0 ? "ltr" : "inherit"}
            placeholder="••••••••"
          />

          {/* ======= Icon Show Hide Password Confirmation ======= */}
          <button
            type="button"
            className={`absolute top-1/2 -translate-y-1/2
          ${direction === "rtl" ? "left-4" : "right-4"}`}
            onMouseDown={(e) => handleToggle(e, "confirm")}
            style={{
              cursor: "pointer",
              zIndex: 10,
              color: "#6c757d",
              fontSize: "18px",
            }}
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      {/* ===== Submit Button ===== */}
      <button
        type="submit"
        disabled={busy}
        style={{
          fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
        }}
        className={`w-full py-2.5 text-sm font-semibold bg-red-500
             hover:bg-red-600 duration-300 text-white leading-tight
              rounded-2xl shadow-lg shadow-red-500/30 transition-all transform 
              active:scale-[0.98] cursor-pointer 
               ${
                 busy
                   ? "bg-red-500 cursor-not-allowed opacity-80"
                   : "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 cursor-pointer"
               }`}
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
  clientsOnly = false,
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
  } = useGetAdminUserQuery(
    { userId, scope: currentUser?.role },
    {
      skip: !isOpen || !isEdit || userId == null || userId === "",
    },
  );

  const roleOptionsFull = useMemo(() => {
    const safe = Array.isArray(roles) ? roles : [];
    return safe.map((r) => ({
      id: r.id,
      name: t(`users.role_names.${r.name}`, {
        defaultValue: r.label || r.name,
      }),
      roleName: r.name,
    }));
  }, [roles, t]);

  const roleOptions = useMemo(() => {
    if (!clientsOnly) return roleOptionsFull;
    return roleOptionsFull.filter((r) => r.roleName === "client");
  }, [roleOptionsFull, clientsOnly]);

  const defaultRoleIdForCreate = useMemo(() => {
    if (!clientsOnly || roleOptions.length !== 1) return "";
    return String(roleOptions[0].id);
  }, [clientsOnly, roleOptions]);

  const portalTarget = typeof document !== "undefined" ? document.body : null;

  const formRemountKey = `${modalKey}-${isEdit ? String(userId) : "create"}-${clientsOnly ? defaultRoleIdForCreate || "pending" : "roles"}`;

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
                className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X />
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
                hideRoleField={clientsOnly}
                initialName={
                  isEdit && existingUser ? (existingUser.name ?? "") : ""
                }
                initialEmail={
                  isEdit && existingUser ? (existingUser.email ?? "") : ""
                }
                initialRoleId={
                  isEdit && existingUser && existingUser.role_id != null
                    ? String(existingUser.role_id)
                    : defaultRoleIdForCreate
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
