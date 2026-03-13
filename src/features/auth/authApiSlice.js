// Endpoints (Login مثالاً) باستخدام RTK Query لإنشاء شريحة API للمصادقة في React.
// الشريحة تتضمن نقطة نهاية لتسجيل الدخول ونقطة نهاية لجلب بيانات المستخدم.
import { apiSlice } from "../../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // طلب تهيئة الكوكيز (يجب تنفيذه مرة واحدة قبل اللوجن)
    getCsrfToken: builder.query({
      query: () => ({
        url: "/sanctum/csrf-cookie", // استخدم .. للرجوع للخلف خطوة عن v1
        method: "GET",
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/v1/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    register: builder.mutation({
      query: (userInfo) => ({
        url: "/v1/auth/register",
        method: "POST",
        body: { ...userInfo },
      }),
    }),

    getUserData: builder.query({
      query: () => "/v1/user/user-data",
      providesTags: ["User"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/v1/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetCsrfTokenQuery,
  useGetUserDataQuery,
} = authApiSlice;
