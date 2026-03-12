import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// createApi, fetchBaseQuery: الأدوات الأساسية من RTK Query لبناء الـ API.

import { logOut } from "../features/auth/authSlice";

// ===================================================================================

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/v1",
  // السماح بإرسال واستقبال الكوكيز
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
  credentials: "include", // هذه تجعل RTK Query يرسل الكوكيز في كل طلب
});
// ===================================================================================

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // args: تحتوي على معلومات الطلب (مثل الـ URL والـ Body).
  // result: هنا نقوم بتنفيذ الطلب لأول مرة وننتظر النتيجة.

  let result = await baseQuery(args, api, extraOptions);

  // إذا انتهت الجلسة (401)، نقوم بتنظيف الـ Redux وتوجيه المستخدم للوجن
  if (result.error && result.error.status === 401) {
    api.dispatch(logOut());
  }

  return result;
};

// ===================================================================================

// التصدير النهائي (Export)
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth, // نستخدم الدالة الذكية بدلاً من العادية
  tagTypes: ["User", "Client", "Stats"], // لإدارة الـ Caching
  endpoints: (builder) => ({}), // سنضع الـ endpoints في ملفات منفصلة لاحقاً
});
