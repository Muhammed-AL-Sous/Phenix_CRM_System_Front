// src/services/authApiSlice.js (أو src/auth/authApiSlice.js حسب مسارك)
import { baseApi } from "../../api/apiSlice"; // ✅ تأكد من المسار الصحيح
import { logOut } from "./authSlice";

// دالة مساعدة لجلب CSRF cookie
async function fetchCsrfCookie() {
  try {
    const response = await fetch("/sanctum/csrf-cookie", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Failed to fetch CSRF cookie:", error);
    throw error;
  }
}

// ⭐ إضافة endpoints للـ baseApi
export const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ CSRF Token كـ Query
    getCsrfToken: builder.query({
      queryFn: async () => {
        try {
          await fetchCsrfCookie();
          return {
            data: {
              success: true,
              message: "CSRF token retrieved successfully",
            },
          };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: error.message,
              data: "Failed to retrieve CSRF token",
            },
          };
        }
      },
      keepUnusedDataFor: 0, // لا نريد caching
    }),

    // ✅ CSRF Token كـ Mutation (للاستخدام اليدوي)
    getCsrfCookie: builder.mutation({
      queryFn: async () => {
        try {
          await fetchCsrfCookie();
          return { data: { success: true } };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
    }),

    // ✅ جلب بيانات المستخدم الحالي
    getUserData: builder.query({
      query: () => ({
        url: "/user-data",
        method: "GET",
      }),
      providesTags: ["User"],
      // إعداد خاص للتعامل مع أخطاء 401/419
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          data: response.data,
          error: response.data?.message || "خطأ في جلب بيانات المستخدم",
        };
      },
    }),

    // ✅ تسجيل الدخول
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
      // قبل تسجيل الدخول، تأكد من وجود CSRF token
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // بعد تسجيل الدخول الناجح، جلب بيانات المستخدم
          dispatch(authApiSlice.util.invalidateTags(["User"]));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    // ============ verify Email Api Mutation ============ //
    verifyEmail: builder.mutation({
      // نمرر الـ credentials ككائن يحتوي على email و code
      query: (credentials) => ({
        url: "/verify-email",
        method: "POST",
        body: credentials, // سيرسل { email: "...", code: "..." }
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // بعد تسجيل الدخول الناجح، جلب بيانات المستخدم
          dispatch(authApiSlice.util.invalidateTags(["User"]));
        } catch (error) {
          console.error("verify Email failed:", error);
        }
      },
    }),

    // ============ Resend Verification Api Mutation ============ //
    resendVerification: builder.mutation({
      query: (body) => ({
        url: "/resend-code",
        method: "POST",
        body, // { email }
      }),
    }),

    // ============ Forgot Password Api Mutation ============ //
    forgotPassword: builder.mutation({
      query: (emailOrPayload) => ({
        url: "/forgot-password",
        method: "POST",
        body:
          typeof emailOrPayload === "string"
            ? { email: emailOrPayload }
            : emailOrPayload,
      }),
    }),

    // ============ Reset Password Api Mutation ============ //
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: {
          token: data.token,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        },
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // بعد تسجيل الدخول الناجح، جلب بيانات المستخدم
          dispatch(authApiSlice.util.invalidateTags(["User"]));
        } catch (error) {
          console.error("Reset Password failed:", error);
        }
      },
    }),

    // ✅ تسجيل حساب جديد
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ تسجيل الخروج
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      // لا نستخدم invalidatesTags: قد يعيد استدعاء getUserData قبل المسح
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(baseApi.util.resetApiState());
          document.cookie =
            "fast_check=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
  // ⭐ هذا مهم لضمان override الـ existing endpoints
  overrideExisting: false,
});

// ✅ تصدير جميع الـ hooks بالأسماء الصحيحة
export const {
  useGetCsrfTokenQuery,
  useGetCsrfCookieMutation,
  useGetUserDataQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;

// ✅ تصدير الـ slice نفسه (قد نحتاجه)
export default authApiSlice;
