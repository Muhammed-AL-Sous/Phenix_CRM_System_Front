import { apiSlice } from "../../app/api/apiSlice";

export const customersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // جلب العملاء مع دعم البحث (Filter)
    getCustomers: builder.query({
      query: (searchTerm) => ({
        url: "/customers",
        params: { search: searchTerm }, // سيرسل الطلب كـ /customers?search=abc
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Customers", id })),
              { type: "Customers", id: "LIST" },
            ]
          : [{ type: "Customers", id: "LIST" }],
    }),

    // 2. إضافة عميل جديد
    addCustomer: builder.mutation({
      query: (newCustomer) => ({
        url: "/customers",
        method: "POST",
        body: newCustomer,
      }),
      // هنا السحر: "أبطل صلاحية" أي بيانات تحمل وسام Customers
      // هذا سيجعل RTK Query يعيد جلب القائمة من Laravel تلقائياً
      invalidatesTags: [{ type: "Customers", id: "LIST" }],
    }),

    // 3. تحديث عميل
    updateCustomer: builder.mutation({
      query: (data) => ({
        url: `/customers/${data.id}`,
        method: "PUT",
        body: data,
      }),
      // نبطل وسام العميل المحدد فقط والقائمة كاملة
      invalidatesTags: (result, error, arg) => [
        { type: "Customers", id: arg.id },
      ],
    }),

    // حذف عميل
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      // بمجرد الحذف، نقوم بإبطال الـ LIST ليتم تحديث الجدول تلقائياً
      invalidatesTags: [{ type: "Customers", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApiSlice;
