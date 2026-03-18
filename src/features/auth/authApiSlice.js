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
          // عمل Invalidate للكاش لضمان تحديث البيانات في أي مكان آخر
          dispatch(apiSlice.util.invalidateTags(["User"]));
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

    // ============ verify Email Api Mutation ============ //
    verifyEmail: builder.mutation({
      // نمرر الـ credentials ككائن يحتوي على email و code
      query: (credentials) => ({
        url: "/verify-email",
        method: "POST",
        body: credentials, // سيرسل { email: "...", code: "..." }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // 1. تحديث الـ State ببيانات المستخدم الجديد (is_active: true)
          // تأكد أن بنية البيانات القادمة من السيرفر هي data.data.user
          if (data?.data?.user) {
            dispatch(setCredentials({ user: data.data.user }));
          }
          // 2. تحديث الكوكي يدوياً (اختياري لأن السيرفر يرسله أصلاً)
          document.cookie =
            "fast_check=true; path=/; max-age=31536000; SameSite=Lax";
        } catch (err) {
          console.error("Verification Error:", err);
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
      // transformResponse هنا تحول الرد ليكون كائن المستخدم فقط
      transformResponse: (response) => response?.data?.user,
      providesTags: ["User"],
      // في حال نجاح جلب البيانات (مثلاً بعد عمل Refresh) نجدد الكوكي
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; // 'data' هنا هو ما خرج من transformResponse
          document.cookie =
            "fast_check=true; path=/; max-age=86400; SameSite=Lax";
          dispatch(setCredentials(data)); // تحديث الحالة فوراً عند نجاح الـ Refresh
        } catch (err) {
          dispatch(logOut()); // إذا فشل الطلب، تأكد من تسجيل الخروج
        }
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
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserDataQuery,
  useLogoutMutation,
} = authApiSlice;
