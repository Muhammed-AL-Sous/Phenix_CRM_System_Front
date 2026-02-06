import { apiSlice } from "../../api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. للمدير فقط: جلب قائمة المستخدمين
    getUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["User"],
    }),

    // 2. للمدير فقط: إضافة مستخدم جديد
    addUser: builder.mutation({
      query: (userData) => ({
        url: "/admin/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // 3. للمدير فقط: حذف مستخدم
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // 4. (للجميع): تعديل الملف الشخصي
    // الزبون والدعم يرسلون 
    // ID الخاص بهم فقط،
    //  والباك أند (Laravel) يتأكد من الصلاحية
    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/profile/update`,
        method: "PUT",
        body: data,
      }),
      // إذا كان المدير هو من يعدل، سنحدث قائمة المستخدمين، وإذا كان زبون سنحدث بياناته
      invalidatesTags: ["User"],
    }),

    // 5. جلب إحصائيات الداشبورد (تتغير النتيجة حسب رتبة التوكن في Laravel)
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateProfileMutation,
  useGetDashboardStatsQuery,
} = usersApiSlice;
