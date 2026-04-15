import { UserPen, UserX } from "lucide-react";

export default function UsersTable({ users = [], onDelete, onEdit }) {
  if (!users.length) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-400">
        No users found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-400 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-slate-400 dark:divide-zinc-800">
        <thead className="bg-slate-100 dark:bg-zinc-900">
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
        <tbody className="divide-y divide-slate-400 bg-slate-50 dark:divide-zinc-800 dark:bg-zinc-950 font-[Livvic]">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-100">
                {u.id}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-100">
                {u.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-100">
                {u.email}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm capitalize font-medium text-slate-700 dark:text-slate-100">
                {u.role ?? "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-end ">
                <button
                  type="button"
                  onClick={() => onDelete(u.id)}
                  className="rounded-lg text-red-500 hover:text-red-600 border border-red-500 hover:border-red-600 px-1 py-1 cursor-pointer transition-colors duration-200"
                >
                  <UserX size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(u.id)}
                  className="rounded-lg text-blue-500 hover:text-blue-600 border border-blue-500 hover:border-blue-600 px-1 py-1 cursor-pointer transition-colors duration-200 ms-1"
                >
                  <UserPen size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
