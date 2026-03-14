import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserDataQuery } from "../../../auth/authApiSlice";
import { selectCurrentUser, setCredentials, logOut } from "../../authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  // 1. فحص وجود الكوكي المساعد (Flag) لمعرفة ما إذا كان هناك جلسة سابقة
  // نستخدم useMemo لضمان عدم إعادة الحساب إلا عند الضرورة
  const hasFastCheck = useMemo(() => {
    return document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("fast_check="));
  }, []);

  // 2. تنفيذ الطلب بذكاء
  const { data, error, isLoading } = useGetUserDataQuery(undefined, {
    // الشرط الجوهري:
    // "تخطى الطلب" إذا كان المستخدم موجوداً بالفعل في Redux
    // أَوْ إذا لم يكن هناك كوكي fast_check (يعني لا توجد جلسة أصلاً)
    skip: !!user || !hasFastCheck,

    retryOnMountWithNoData: false,
    refetchOnFocus: false,
  });

  useEffect(() => {
    // إذا نجح الطلب وجاءت بيانات المستخدم
    if (data?.data?.user) {
      dispatch(setCredentials({ user: data.data.user }));
    }

    // إذا حدث خطأ 401 (انتهت الجلسة فعلياً رغم وجود الكوكي المساعد)
    if (error?.status === 401) {
      // نمسح الكوكي المساعد لأنه أصبح غير صالح
      document.cookie =
        "fast_check=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      dispatch(logOut());
    }
    // أي خطأ آخر غير الـ 401
    else if (error) {
      dispatch(logOut());
    }
  }, [data, error, dispatch]);

  // التحميل يظهر فقط في المرة الأولى عند فحص الهوية
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-900">
        <div className="text-center">
          {/* Spinner متناسق مع تصميمك */}
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-[Almarai] text-slate-600 dark:text-slate-400 text-lg animate-pulse">
            جاري تهيئة النظام...
          </p>
        </div>
      </div>
    );
  }

  // بمجرد انتهاء isLoading (سواء نجح الطلب أو فشل)، يتم عرض محتوى التطبيق (children)
  return children;
}
