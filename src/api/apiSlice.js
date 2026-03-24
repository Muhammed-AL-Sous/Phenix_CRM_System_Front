import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut } from "../features/auth/authSlice";

// Get backend URL from environment or use production default
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_URL, // Now uses environment variable
  // السماح بإرسال واستقبال الكوكيز
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    
    // Extract XSRF token with error handling
    const xsrfToken = extractXSRFToken();
    
    if (xsrfToken) {
      headers.set("X-XSRF-TOKEN", decodeURIComponent(xsrfToken));
    } else {
      console.warn("[API] XSRF token not found in cookies - CSRF protection may be compromised");
    }
    
    return headers;
  },
  credentials: "include", // هذه تجعل RTK Query يرسل الكوكيز في كل طلب
});

/**
 * Safely extract XSRF token from cookies
 * @returns {string|null} The XSRF token or null if not found
 */
function extractXSRFToken() {
  try {
    const cookies = document.cookie.split("; ");
    const xsrfCookie = cookies.find((row) => row.startsWith("XSRF-TOKEN="));
    return xsrfCookie ? xsrfCookie.split("=")[1] : null;
  } catch (error) {
    console.error("[API] Failed to extract XSRF token:", error);
    return null;
  }
}

// ===================================================================================

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // 1. تحديد الـ URL بدقة
    const url = typeof args === "string" ? args : args.url;

    // 2. تجنب الروابط التي قد تسبب حلقة مفرغة (مثل جلب بيانات المستخدم)
    const isAuthPath = url.includes("/user-data") || url.includes("/login");

    if (!isAuthPath) {
      // 3. تنظيف الحالة محلياً فوراً
      api.dispatch(logOut());
      
      // 4. مسح الكاش بالكامل لمنع ظهور بيانات قديمة لمستخدم آخر
      api.dispatch(apiSlice.util.resetApiState());

      // 5. مسح الكوكي اليدوي
      document.cookie = "fast_check=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      // 6. توجيه المستخدم لصفحة اللوجن (اختياري لكنه يضمن استقرار الواجهة)
      window.location.href = "/login";
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
