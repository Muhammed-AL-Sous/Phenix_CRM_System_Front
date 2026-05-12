import { UserPen, UserRoundX } from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { PanelEdgeSpinner } from "../../../components/common/SpinnerFallback";

export default function UsersTable({
  users = [],
  onDelete,
  onEdit,
  canDelete = true,
  page = 1,
  perPage = 15,
  metaFrom,
  emptyLabel,
  isFetching,
  isInitialLoading = false,
}) {
  const { t } = useTranslation("user");

  const rowNumber = (i) => {
    if (metaFrom != null) return metaFrom + i;
    return (page - 1) * perPage + i + 1; 
    // (1 - 1) * 15 + 0 + 1 = 1,
    // (1 - 1) * 15 + 14 + 1 = 15,
    // (2 - 1) * 15 + 0 + 1 = 16,
    // (2 - 1) * 15 + 14 + 1 = 30
  };

  if (isInitialLoading && !users.length) {
    return <PanelEdgeSpinner />;
  }

  if (!users.length) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-400">
        {emptyLabel ?? t("users.list.no_results")}
      </p>
    );
  }
  const thClassName =
    "px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400";

  return (
    <div className="relative">
      <div
        className={clsx(
          "overflow-x-auto rounded-xl backdrop-blur-sm border border-slate-200 transition-opacity dark:border-zinc-800 shadow-sm",
          isFetching && "pointer-events-none opacity-60",
        )}
        aria-busy={isFetching || undefined}
      >
        <table className="min-w-full divide-y divide-slate-300 dark:divide-zinc-800">
          <thead className="bg-slate-100 dark:bg-zinc-900">
            <tr>
              <th className={thClassName}>{t("users.list.row")}</th>
              <th className={thClassName}>{t("users.name")}</th>
              <th className={thClassName}>{t("users.email")}</th>
              <th className={thClassName}>{t("users.role")}</th>
              <th className={thClassName}>{t("users.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300 bg-slate-50 font-[Livvic] dark:divide-zinc-800 dark:bg-zinc-950">
            {users.map((u, i) => (
              <tr key={u.id}>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium tabular-nums text-slate-700 dark:text-slate-400">
                  {rowNumber(i)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-400">
                  {u.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-400">
                  {u.email}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm rtl:text-base font-medium capitalize text-slate-700 dark:text-slate-400">
                  {u.role != null && u.role !== ""
                    ? t(`users.role_names.${u.role}`, { defaultValue: u.role })
                    : "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-end">
                  {canDelete && typeof onDelete === "function" ? (
                    <button
                      type="button"
                      onClick={() => onDelete(u.id)}
                      className="cursor-pointer rounded-lg border border-red-500 px-1 py-1 text-red-500 transition-colors duration-200 hover:border-red-600 hover:text-red-600"
                    >
                      <UserRoundX size={18} />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onEdit(u.id)}
                    className="ms-1 cursor-pointer rounded-lg border border-blue-500 px-1 py-1 text-blue-500 transition-colors duration-200 hover:border-blue-600 hover:text-blue-600"
                  >
                    <UserPen size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isFetching ? (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-white/40 dark:bg-zinc-950/40"
          aria-hidden
        >
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent dark:border-sky-400" />
        </div>
      ) : null}
    </div>
  );
}
