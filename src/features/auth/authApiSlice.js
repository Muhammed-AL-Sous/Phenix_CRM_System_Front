import { apiSlice } from "../../api/apiSlice";
import { setCredentials, logOut } from "./authSlice.js";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // طلب تهيئة الكوكيز (يجب تنفيذه مرة واحدة قبل اللوجن)
    getCsrfToken: builder.query({
      query: () => ({
        url: "/sanctum/csrf-cookie",
        method: "GET",
      }),
    }),

    // ============ Login Api Mutation ============ //
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
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

    // ============ Register Api Mutation ============ //
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/register",
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

    // ============ Forgot Password Api Mutation ============ //
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/forgot-password",
        method: "POST",
        body: { email },
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
    }),

    // ============ Get User Data Api Query ============ //
    getUserData: builder.query({
      query: () => "/user-data",
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

    // ============ Logout Api Mutation ============ //
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
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
  useGetCsrfTokenQuery,
  useLazyGetCsrfTokenQuery,
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserDataQuery,
  useLogoutMutation,
} = authApiSlice;
