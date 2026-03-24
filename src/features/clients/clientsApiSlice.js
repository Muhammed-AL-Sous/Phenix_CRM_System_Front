import { apiSlice } from "../../app/api/apiSlice";

export const clientsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // جلب العملاء مع دعم البحث (Filter)
    getClients: builder.query({
      query: (searchTerm) => ({
        url: "/clients",
        params: { search: searchTerm }, // سيرسل الطلب كـ /clients?search=abc
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Clients", id })),
              { type: "Clients", id: "LIST" },
            ]
          : [{ type: "Clients", id: "LIST" }],
    }),

    // 2. إضافة عميل جديد
    addClient: builder.mutation({
      query: (newClient) => ({
        url: "/clients",
        method: "POST",
        body: newClient,
      }),
      // هنا السحر: "أبطل صلاحية" أي بيانات تحمل وسام Clients
      // هذا سيجعل RTK Query يعيد جلب القائمة من Laravel تلقائياً
      invalidatesTags: [{ type: "Clients", id: "LIST" }],
    }),

    // 3. تحديث عميل
    updateClient: builder.mutation({
      query: (data) => ({
        url: `/clients/${data.id}`,
        method: "PUT",
        body: data,
      }),
      // نبطل وسام العميل المحدد فقط والقائمة كاملة
      invalidatesTags: (result, error, arg) => [
        { type: "Clients", id: arg.id },
      ],
    }),

    // حذف عميل
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      // بمجرد الحذف، نقوم بإبطال الـ LIST ليتم تحديث الجدول تلقائياً
      invalidatesTags: [{ type: "Clients", id: "LIST" }],
    }),

    getClientCreationData: builder.query({
      query: ({ lang = 'ar' } = {}) => ({
        url: "/lookups/client-data",
        method: "GET",
        headers: lang ? { 'lang': lang } : {},
      }),
      providesTags: ["Lookup"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useLazyGetClientCreationDataQuery,
} = clientsApiSlice;
