// Endpoints (Login مثالاً) باستخدام RTK Query لإنشاء شريحة API للمصادقة في React. 
// الشريحة تتضمن نقطة نهاية لتسجيل الدخول ونقطة نهاية لجلب بيانات المستخدم.
import { apiSlice } from "../../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/register",
        method: "POST",
        body: { ...userInfo },
      }),
    }),
    getUserData: builder.query({
      query: () => "/user-data",
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetUserDataQuery } = authApiSlice;
