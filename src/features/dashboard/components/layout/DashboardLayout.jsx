import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../auth/authSlice";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router/dom";

export default function DashboardLayout() {
  const user = useSelector(selectCurrentUser);
  const { darkMode, language } = useSelector((state) => state.settings);

  if (!user) return null; // حماية إضافية

  return (
    <div
      className={`${darkMode ? "dark bg-gray-900" : "bg-white"} min-h-screen flex`}
    >
      <Sidebar role={user.role} lang={language} />

      {/* المحتوى الرئيسي */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <span className="font-semibold">
            أهلاً بك، {user.name} ({user.role})
          </span>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
            {user.name.charAt(0)}
          </div>
        </header>

        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
