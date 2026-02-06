import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "../../../auth/authSlice";

const DashboardSidebar = () => {
  const user = useSelector(selectCurrentUser);
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

          {/* روابط للمدير فقط */}
          {user.role === "admin" && (
            <>
              <Link
                to="/dashboard/users"
                className="block p-2 hover:bg-slate-700"
              >
                إدارة المستخدمين
              </Link>
              <Link
                to="/dashboard/settings"
                className="block p-2 hover:bg-slate-700"
              >
                إعدادات النظام
              </Link>
            </>
          )}

          {/* روابط للدعم الفني */}
          {user.role === "user" && (
            <Link
              to="/dashboard/tickets"
              className="block p-2 hover:bg-slate-700"
            >
              تذاكر الدعم
            </Link>
          )}

          <Link
            to="/dashboard/profile"
            className="block p-2 hover:bg-slate-700"
          >
            ملفي الشخصي
          </Link>
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
