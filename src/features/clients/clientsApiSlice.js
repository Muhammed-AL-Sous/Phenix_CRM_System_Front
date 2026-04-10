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
        params: lang ? { lang } : {},
      }),
      transformResponse: (response) => {
        if (response?.countries) return response;
        if (response?.data?.countries) return response.data;
        return response ?? {};
      },
      providesTags: ["Lookup"],
    }),

    getCitiesForCountry: builder.query({
      query: ({ countryId, lang = "ar" }) => ({
        url: `/lookups/countries/${countryId}/cities`,
        params: { lang },
      }),
      transformResponse: (response) => {
        // Raw JSON array, or ApiResponse-style { status, data: [...] }.
        if (Array.isArray(response)) return response;
        if (response?.status === true && Array.isArray(response?.data)) {
          return response.data;
        }
        if (Array.isArray(response?.data)) return response.data;
        return [];
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { countryId, lang } = queryArgs;
        return { countryId, lang };
      },
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
