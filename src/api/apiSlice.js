import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// createApi, fetchBaseQuery: الأدوات الأساسية من RTK Query لبناء الـ API.

import { logOut } from "../features/auth/authSlice";

// ===================================================================================

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  // السماح بإرسال واستقبال الكوكيز
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    // استخراج XSRF-TOKEN من الكوكيز وإضافته للهيدرز (اختياري لكنه يضمن التوافق)
    const xsrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (xsrfToken) {
      // لارافيل يبحث عن هذا الهيدر في طلبات POST/PUT/DELETE
      headers.set("X-XSRF-TOKEN", decodeURIComponent(xsrfToken));
    }
    return headers;
  },
  credentials: "include", // هذه تجعل RTK Query يرسل الكوكيز في كل طلب
});
// ===================================================================================

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // استخراج الرابط سواء كان string أو object
    const url = typeof args === "string" ? args : args.url;

    // استثناء رابط التحقق من البيانات لمنع تسجيل الخروج اللانهائي
    if (!url.includes("/v1/user/user-data")) {
      api.dispatch(logOut());
      // مسح الكوكي المساعد عند تسجيل الخروج التلقائي بسبب انتهاء الجلسة
      document.cookie =
        "fast_check=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
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
