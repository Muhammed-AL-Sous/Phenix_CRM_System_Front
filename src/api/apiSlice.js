import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// createApi, fetchBaseQuery: الأدوات الأساسية من RTK Query لبناء الـ API.
import {
  setCredentials,
  logOut,
  selectCurrentToken,
} from "../features/auth/authSlice";
// setCredentials, logOut, selectCurrentToken: هذه دوال استوردناها من ملف الـ authSlice
//  (الذي يتحكم في حالة المستخدم في Redux).
//  نحن نحتاجهم لنعرف التوكن الحالي، أو لنحفظ التوكن الجديد، أو لنسجل الخروج.

// ===================================================================================

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/v1",
  prepareHeaders: (headers, { getState }) => {
    // fetchBaseQuery: هي دالة تشبه axios ولكنها مدمجة في RTK.
    // baseUrl: هو الرابط الأساسي لسيرفر Laravel الخاص بك.
    // prepareHeaders: وظيفة عبقرية تعمل تلقائياً قبل كل طلب.
    //  هي تذهب للـ Redux State، تجلب التوكن الحالي،
    //  وتضعه في الـ Header كـ Authorization: Bearer {token}.
    //  هكذا لن تضطر لكتابة التوكن يدوياً في كل طلب.
    const token = selectCurrentToken(getState());
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
// ===================================================================================

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // args: تحتوي على معلومات الطلب (مثل الـ URL والـ Body).
  // result: هنا نقوم بتنفيذ الطلب لأول مرة وننتظر النتيجة.

  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    if (result.error.status === 500) {
      // يمكنك استخدام مكتبة مثل react-toastify هنا
      console.error("خطأ في السيرفر، جاري العمل على إصلاحه");
    }
  }

  // إذا كانت النتيجة 401 (Unauthorized)
  //   هنا نفحص: هل فشل الطلب؟ وهل سبب الفشل هو أن التوكن منتهي الصلاحية (401)؟
  //  إذا نعم، نبدأ عملية الإنقاذ.
  if (result.error && result.error.status === 401) {
    console.log("Token expired, trying to refresh...");

    // محاولة جلب توكن جديد من رابط الـ refresh الذي أنشأته
    const refreshResult = await baseQuery(
      { url: "/refresh-token", method: "POST" },
      api,
      extraOptions,
    );

    // لو نجح التجديد، نحصل على التوكن الجديد من الاستجابة
    if (refreshResult.data) {
      const newToken = refreshResult.data.access_token;
      // 1. تخزين التوكن الجديد في الـ Store
      //   تحديث الـ Redux والـ LocalStorage بالتوكن الجديد
      api.dispatch(
        setCredentials({ user: refreshResult.data.user, token: newToken }),
      );

      // 2. إعادة محاولة الطلب الأصلي الفاشل بالتوكن الجديد
      result = await baseQuery(args, api, extraOptions);

      //   إذا أعطانا Laravel توكن جديد:
      // نستخدم api.dispatch لنرسل التوكن الجديد للـ authSlice
      // ليتم حفظه (وهذا سيقوم بتحديث الـ Headers تلقائياً للمستقبل).
      // أهم خطوة: نقوم بإعادة تنفيذ "الطلب الأصلي الفاشل"
      //  (args) مرة أخرى.
      //  المستخدم لن يشعر بشيء،
      // ستبدو الصفحة وكأن الطلب نجح من المرة الأولى
    } else {
      // إذا فشل الـ Refresh أيضاً، سجل خروج
      api.dispatch(logOut());
    }
  }
  return result;
};
// ===================================================================================

// التصدير النهائي (Export)
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth, // نستخدم الدالة الذكية بدلاً من العادية
  tagTypes: ["User", "Customer", "Stats"], // لإدارة الـ Caching
  endpoints: (builder) => ({}), // سنضع الـ endpoints في ملفات منفصلة لاحقاً
});
