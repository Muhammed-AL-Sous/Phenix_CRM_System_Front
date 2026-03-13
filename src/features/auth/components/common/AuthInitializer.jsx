import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserDataQuery } from "../../../auth/authApiSlice";
import { selectCurrentUser, setCredentials, logOut } from "../../authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  // تنفيذ الطلب للتحقق من الجلسة (Session) عند فتح الموقع
  const { data, error, isLoading } = useGetUserDataQuery(undefined, {
    skip: !!user, // لا نطلب البيانات إذا كان لدينا مستخدم
    // يمنع إعادة المحاولة التلقائية إذا فشل الطلب (مثلاً إذا كان المستخدم غير مسجل)
    retryOnMountWithNoData: false,
    refetchOnFocus: false, // اختياري: يمنع إعادة الطلب عند تبديل نوافذ المتصفح
  });

  useEffect(() => {
    if (data?.data?.user) {
      dispatch(setCredentials({ user: data.data.user }));
      return;
    }
    if (error?.status === 401) {
      return;
    }

    if (error) {
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
