// React Redux
import { useDispatch } from "react-redux";

// Auth Slice
import { logOut } from "../../../auth/authSlice";

// React Router
import { Link } from "react-router";

// Translation Hook
import { useTranslation } from "react-i18next";

const DashboardSidebar = ({ sidebarLinks }) => {
  const { t } = useTranslation(["dashboard"]);
  const dispatch = useDispatch();
  return (
    <div>
      {/* 1. القائمة الجانبية (Sidebar) - تتغير حسب الرتبة */}
      <aside className="w-64 bg-slate-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-8">CRM System</h2>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block p-2 hover:bg-slate-700">
            الرئيسية
          </Link>
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block p-2 hover:bg-slate-700"
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => dispatch(logOut())}
          className="mt-10 w-full bg-red-600 p-2 rounded hover:bg-red-700"
        >
          تسجيل الخروج
        </button>
      </aside>
    </div>
  );
};

export default DashboardSidebar;
