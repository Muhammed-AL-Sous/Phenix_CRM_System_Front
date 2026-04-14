import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/authSlice";
import { RouteSuspenseFallback } from "../../../components/common/GlobalLoader";
import { useGetAdminClientsQuery } from "../clientsApiSlice";

const STAFF_ROLES = new Set(["admin", "manager", "support"]);

export default function ClientsPage() {
  const currentUser = useSelector(selectCurrentUser);
  const canView = useMemo(
    () => STAFF_ROLES.has(currentUser?.role),
    [currentUser?.role],
  );

  const { data: clients = [], isLoading, error } = useGetAdminClientsQuery(
    undefined,
    {
      skip: !canView,
    },
  );

  if (!canView) {
    return (
      <p className="text-slate-600 dark:text-slate-400">
        You do not have permission to view this page.
      </p>
    );
  }

  if (isLoading) return <RouteSuspenseFallback className="min-h-[50vh]" />;

  if (error) {
    return (
      <p className="text-red-600 dark:text-red-400">
        {error?.data?.message || "Failed to load clients."}
      </p>
    );
  }

  if (!clients.length) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-400">
        No clients found.
      </p>
    );
  }

  return (
    <div className="clients-page">
      <div className="mb-6 flex items-center justify-between">
        <h1>Clients</h1>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-zinc-800">
          <thead className="bg-slate-50 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                ID
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Company
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Client Name
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Phone
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Email
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Profile
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
            {clients.map((c) => (
              <tr key={c.id}>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                  {c.id}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {c.company_name || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {c.client_name || c.user?.name || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {c.phone || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {c.user?.email || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {c.user ? "Complete" : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

