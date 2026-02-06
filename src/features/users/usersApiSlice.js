import { apiSlice } from "../../api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. للمدير فقط: جلب قائمة المستخدمين
    // تحديث الـ providesTags في getUsers
    getUsers: builder.query({
      query: () => "/admin/users",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User", id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
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

    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`, // رابط موحد في Laravel
        method: "PUT",
        body: data,
      }),
      // هنا نستخدم Tag ذكي جداً لضمان تحديث البيانات في المكان الصحيح
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: "LIST" }, // تحديث القائمة العامة للمدير
        { type: "User", id }, // تحديث بيانات المستخدم المعين
        "Stats", // تحديث الإحصائيات إذا تغير شي يؤثر عليها
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateProfileMutation,
  useGetDashboardStatsQuery,
  useUpdateUserMutation,
} = usersApiSlice;
