import { apiSlice } from "../../api/apiSlice";
import { setCredentials, logOut } from "./authSlice.js";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setCredentials({ user: data.data.user }));

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
          const { data: response } = await queryFulfilled;

          const user = response.data?.user;

          if (user) {
            dispatch(setCredentials({ user: user }));
            dispatch(apiSlice.util.invalidateTags(["User"]));
          }
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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setCredentials({ user: data.data.user }));

          dispatch(apiSlice.util.invalidateTags(["User"]));
        } catch (err) {
          // في حال فشل الطلب لا نفعل شيئاً
        }
      },
    }),

    // ============ Get User Data Api Query ============ //
    getUserData: builder.query({
      query: () => "/user-data",
      transformResponse: (response) => response?.data?.user,
      providesTags: ["User"],
    }),

    // ============ Logout Api Mutation ============ //
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Logout failed on server, cleaning up locally...", err);
        } finally {
          // هذه العمليات ستنفذ سواء نجح الطلب أو فشل (الحالة المثالية)
          document.cookie =
            "fast_check=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
          // مسح بيانات المستخدم من الـ State (authSlice)
          dispatch(logOut());

          // مسح كل الكاش المخزن في الـ API Slice (مهم جداً للخصوصية)
          dispatch(apiSlice.util.resetApiState());
        }
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
