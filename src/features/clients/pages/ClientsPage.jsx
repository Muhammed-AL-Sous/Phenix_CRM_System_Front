import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { selectCurrentUser } from "../../auth/authSlice";
import { Spinner } from "../../../components/common/GlobalLoader";
import { useGetAdminClientsQuery } from "../clientsApiSlice";

const STAFF_ROLES = new Set(["admin", "manager", "support", "sales"]);

export default function ClientsPage() {
  const currentUser = useSelector(selectCurrentUser);
  const canView = useMemo(
    () => STAFF_ROLES.has(currentUser?.role),
    [currentUser?.role],
  );

  const {
    data: clients = [],
    isLoading,
    error,
  } = useGetAdminClientsQuery(currentUser?.role, {
    skip: !canView,
  });

  const clientsBasePath = useMemo(() => {
    const role = currentUser?.role;
    if (!role) return "/clients";
    return `/${role}/clients`;
  }, [currentUser?.role]);

  if (!canView) {
    return (
      <p className="text-slate-600 dark:text-slate-400">
        You do not have permission to view this page.
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-600 dark:text-red-400">
        {error?.data?.message || "Failed to load clients."}
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="clients-page">
        <div className="mb-6 flex items-center justify-between">
          <h1>Clients</h1>
        </div>
        <div
          className="flex min-h-[240px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900"
          aria-busy
        >
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!clients.length) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-400">
        No clients found.
      </p>
    );
  }

  // Helper function to capitalize company names
  const capitalizeFirstLetter = (string) => {
    return string
      .split(" ")
      .map(function (e) {
        return e[0].toUpperCase() + e.slice(1);
      })
      .join(" ");
  };

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
                Job Title
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Country
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                City
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
            {clients.map((c) => (
              <tr key={c.id}>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                  {c.id}
                </td>
                <td className="whitespace-nowrap px-4 py-3  text-sm font-medium text-slate-900 dark:text-slate-100">
                  {capitalizeFirstLetter(c.company_name) || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  <Link
                    to={`${clientsBasePath}/${c.id}`}
                    className="font-medium text-sky-600 underline-offset-2 hover:text-sky-700 hover:underline dark:text-sky-400 dark:hover:text-sky-300"
                  >
                    {capitalizeFirstLetter(c.client_name) ||
                      capitalizeFirstLetter(c.user?.name) ||
                      "—"}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {c.phone || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {c?.job_title?.name || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {c?.country?.name || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {c?.subdivision?.name || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
