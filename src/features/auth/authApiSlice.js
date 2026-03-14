// Endpoints (Login مثالاً) باستخدام RTK Query لإنشاء شريحة API للمصادقة في React.
// الشريحة تتضمن نقطة نهاية لتسجيل الدخول ونقطة نهاية لجلب بيانات المستخدم.
import { apiSlice } from "../../api/apiSlice";
import { setCredentials, logOut } from "./authSlice.js";

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
      // --- إضافة الكوكي عند نجاح اللوجن ---
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // 1. إضافة الكوكي المساعد (ليس HttpOnly)
          document.cookie =
            "fast_check=true; path=/; max-age=86400; SameSite=Lax";

          // 2. تحديث الـ State في Redux
          dispatch(setCredentials({ user: data.data.user }));
        } catch (err) {
          // في حال فشل الطلب لا نفعل شيئاً
        }
      },
    }),

    register: builder.mutation({
      query: (userInfo) => ({
        url: "/v1/auth/register",
        method: "POST",
        body: { ...userInfo },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // 1. إضافة الكوكي المساعد (ليس HttpOnly)
          document.cookie =
            "fast_check=true; path=/; max-age=86400; SameSite=Lax";

          // 2. تحديث الـ State في Redux
          dispatch(setCredentials({ user: data.data.user }));
        } catch (err) {
          // في حال فشل الطلب لا نفعل شيئاً
        }
      },
    }),

    getUserData: builder.query({
      query: () => "/v1/user/user-data",
      providesTags: ["User"],
      // في حال نجاح جلب البيانات (مثلاً بعد عمل Refresh) نجدد الكوكي
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          document.cookie =
            "fast_check=true; path=/; max-age=86400; SameSite=Lax";
        } catch (err) {}
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/v1/auth/logout",
        method: "POST",
      }),
      // --- حذف الكوكي عند تسجيل الخروج ---
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // 1. حذف الكوكي عن طريق انتهاء الصلاحية
          document.cookie =
            "fast_check=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

          // 2. تصفية الـ State
          dispatch(logOut());
          // 3. اختياري: تصفية الـ Cache الخاص بـ RTK Query
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {}
      },
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
