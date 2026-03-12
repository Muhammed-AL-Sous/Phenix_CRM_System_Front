import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUserDataQuery } from "../../../auth/authApiSlice";
import { setCredentials, logOut } from "../../authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  const { data, error, isLoading } = useGetUserDataQuery();

  useEffect(() => {
    if (data) {
      // إذا نجح الطلب، يعني أن الكوكي (تذكرني) موجودة وصالحة
      dispatch(setCredentials({ user: data.user }));
    } else if (error) {
      // إذا فشل (مثلاً 401)، نمسح أي بيانات قديمة
      dispatch(logOut());
    }
  }, [data, error, dispatch]);

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
