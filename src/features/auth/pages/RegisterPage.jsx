// React Hooks
import { useState } from "react";

// Register Slice
import { useRegisterMutation } from "../../auth/authApiSlice";

// Translation Hook
import { useTranslation } from "react-i18next";

// React Router
import { Link } from "react-router";

// React Redux
import { useSelector } from "react-redux";

const RegisterPage = () => {
  const { t } = useTranslation(["common"]);
  const { direction } = useSelector((state) => state.ui);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // دالة الـ Register تعطينا الـ error ككائن جاهز
  const [register, { error, isLoading }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData).unwrap(); // unwrap تجعلنا نمسك الخطأ في catch
      alert("تم التسجيل بنجاح!");
    } catch (err) {
      // الأخطاء مخزنة الآن في المتغير 'error' بالأعلى تلقائياً
      console.error("فشل التسجيل", err);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* ============= Full Name ============= */}
      <div>
        <label
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
          }}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {t("name")}
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
          placeholder="John Doe"
          style={{
            fontFamily: "Livvic",
            fontWeight: "500",
          }}
        />
      </div>

      {/* ============= Email ============= */}
      <div>
        <label
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
          }}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {t("email")}
        </label>
        <input
          type="email"
          style={{
            fontFamily: "Livvic",
            fontWeight: "500",
          }}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
          placeholder="name@company.com"
        />
        {/* عرض خطأ الإيميل من Laravel */}
        {error?.status === 422 && (
          <p className="text-red-500">{error.data.errors.email?.[0]}</p>
        )}
      </div>

      {/* ============= PassWord ============= */}
      <div>
        <label
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
          }}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {t("password")}
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
          placeholder="••••••••"
        />
        {/* عرض خطأ الباسورد من Laravel */}
        {error?.status === 422 && (
          <p className="text-red-500">{error.data.errors.password?.[0]}</p>
        )}
      </div>

      {/* ============= PassWord Confirmation ============= */}
      <div>
        <label
          style={{
            fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
          }}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {t("Confirm_password")}
        </label>
        <input
          type="password"
          value={formData.password_confirmation}
          onChange={(e) =>
            setFormData({
              ...formData,
              password_confirmation: e.target.value,
            })
          }
          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 ring-red-500/20 outline-none transition-all dark:text-white"
          placeholder="••••••••"
        />
        {/* عرض خطأ الباسورد من Laravel */}
        {error?.status === 422 && (
          <p className="text-red-500">{error.data.errors.password?.[0]}</p>
        )}
      </div>
      <button
        disabled={isLoading}
        style={{
          fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
        }}
        className="w-full py-3 bg-red-500 hover:bg-red-600 duration-300 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all transform active:scale-[0.98] cursor-pointer"
      >
        {t("register")}
      </button>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t("already_have_account")}{" "}
        <Link
          to="/login"
          className="text-red-500 transition-all duration-200 hover:text-red-600 font-bold hover:underline ms-1.5"
        >
          {t("login")}
        </Link>
      </p>
    </form>
  );
};

export default RegisterPage;
