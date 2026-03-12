// Endpoints (Login مثالاً) باستخدام RTK Query لإنشاء شريحة API للمصادقة في React.
// الشريحة تتضمن نقطة نهاية لتسجيل الدخول ونقطة نهاية لجلب بيانات المستخدم.
import { apiSlice } from "../../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // طلب تهيئة الكوكيز (يجب تنفيذه مرة واحدة قبل اللوجن)
    getCsrfToken: builder.query({
      query: () => ({
        url: "/sanctum/csrf-cookie",
        method: "GET",
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    register: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...userInfo },
      }),
    }),

    getUserData: builder.query({
      query: () => "/user-data",
      providesTags: ["User"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
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
