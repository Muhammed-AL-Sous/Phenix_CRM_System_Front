import { baseApi } from "../../api/apiSlice";

export const clientsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query({
      query: (searchTerm) => ({
        url: "/clients",
        params: { search: searchTerm },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Clients", id })),
              { type: "Clients", id: "LIST" },
            ]
          : [{ type: "Clients", id: "LIST" }],
    }),

    addClient: builder.mutation({
      query: (newClient) => ({
        url: "/clients",
        method: "POST",
        body: newClient,
      }),
      invalidatesTags: [{ type: "Clients", id: "LIST" }, "User", "Lookup"],
    }),

    updateClient: builder.mutation({
      query: (data) => ({
        url: `/clients/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Clients", id: arg.id },
        { type: "Clients", id: "LIST" },
      ],
    }),

    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Clients", id: "LIST" }],
    }),

    getClientCreationData: builder.query({
      query: ({ lang = "ar" } = {}) => ({
        url: "/lookups/client-data",
        method: "GET",
        headers: lang ? { lang } : {},
      }),
      providesTags: ["Lookup"],
    }),

    getCitiesForCountry: builder.query({
      query: ({ countryId, lang = "ar" }) => ({
        url: `/lookups/countries/${countryId}/cities`,
        params: { lang },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetClientsQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetClientCreationDataQuery,
  useLazyGetClientCreationDataQuery,
  useGetCitiesForCountryQuery,
  useLazyGetCitiesForCountryQuery,
} = clientsApiSlice;
