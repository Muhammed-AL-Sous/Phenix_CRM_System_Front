export default function UsersTable({ users = [], onDelete }) {
  if (!users.length) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-400">
        No users found.
      </p>
    );
  }

  return (
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
            <th className="px-4 py-3 text-end text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                {u.id}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                {u.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                {u.email}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-slate-600 dark:text-slate-400">
                {u.role ?? "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-end">
                <button
                  type="button"
                  onClick={() => onDelete(u.id)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
