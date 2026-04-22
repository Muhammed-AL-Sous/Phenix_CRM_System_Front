import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/authSlice";
import { PanelEdgeSpinner } from "../../../components/common/SpinnerFallback";
import { useGetStaffQuery } from "../staffApiSlice";

const ADMIN_ONLY = new Set(["admin"]);

export default function StaffPage() {
  const currentUser = useSelector(selectCurrentUser);
  const canView = useMemo(
    () => ADMIN_ONLY.has(currentUser?.role),
    [currentUser?.role],
  );

  const { data: staff = [], isLoading, error } = useGetStaffQuery(undefined, {
    skip: !canView,
  });

  if (!canView) {
    return (
      <p className="text-slate-600 dark:text-slate-400">
        You do not have permission to view this page.
      </p>
    );
  }

  if (isLoading) return <PanelEdgeSpinner />;

  if (error) {
    return (
      <p className="text-red-600 dark:text-red-400">
        {error?.data?.message || "Failed to load staff."}
      </p>
    );
  }

  if (!staff.length) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-400">
        No staff found.
      </p>
    );
  }

  return (
    <div className="staff-page">
      <div className="mb-6 flex items-center justify-between">
        <h1>Staff</h1>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-zinc-800">
          <thead className="bg-slate-50 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                ID
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Name
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Email
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Role
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Job Title
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
            {staff.map((u) => (
              <tr key={u.id}>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                  {u.id}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {u.staff_profile?.display_name || u.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {u.email}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-slate-600 dark:text-slate-400">
                  {u.role ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {u.staff_profile?.job_title || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

