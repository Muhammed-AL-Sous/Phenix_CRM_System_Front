import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUserDataQuery } from "../../auth/authApiSlice";
import { setCredentials, logOut } from "../../auth/authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  // سنقوم بطلب بيانات المستخدم فقط إذا كان هناك توكن مخزن
  // وإلا سنقوم بإنهاء التحميل فوراً
  const { data, error, isLoading, isSuccess } = useGetUserDataQuery(undefined, {
    skip: !token, // لا ترسل طلب إذا لا يوجد توكن
  });

  useEffect(() => {
    if (isSuccess && data) {
      // إذا نجح الطلب، خزن البيانات في Redux
      dispatch(setCredentials({ user: data, token }));
    } else if (error) {
      // إذا فشل (التوكن منتهي أو مزور)، سجل خروج وامسح التوكن
      dispatch(logOut());
    }
  }, [isSuccess, data, error, dispatch, token]);

  // حالة التحميل: مهمة لكي لا يرى المستخدم صفحة الـ Login لثانية واحدة ثم يتغير المحتوى
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>جاري التحقق من الهوية...</p>
        {/* يمكنك وضع Spinner هنا */}
      </div>
    );
  }

  return children;
}
