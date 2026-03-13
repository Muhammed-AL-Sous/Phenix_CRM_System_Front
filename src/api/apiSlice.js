import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// createApi, fetchBaseQuery: الأدوات الأساسية من RTK Query لبناء الـ API.

import { logOut } from "../features/auth/authSlice";

// ===================================================================================

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  // السماح بإرسال واستقبال الكوكيز
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
  credentials: "include", // هذه تجعل RTK Query يرسل الكوكيز في كل طلب
});
// ===================================================================================

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const url = typeof args === "string" ? args : args.url;

    if (url !== "/v1/user/user-data") {
      api.dispatch(logOut());
    }
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
