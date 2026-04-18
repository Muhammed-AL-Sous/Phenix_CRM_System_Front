import { baseApi } from "../../api/apiSlice";

/** @param {string | undefined} role */
function clientsScopePrefix(role) {
  if (
    role === "admin" ||
    role === "manager" ||
    role === "support" ||
    role === "sales"
  ) {
    return `/${role}`;
  }
  return "/admin";
}

export const clientsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Staff dashboards: GET /{role}/users/clients (matches Laravel role-prefixed API)
    getAdminClients: builder.query({
      query: (role) => `${clientsScopePrefix(role)}/users/clients`,
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}(${queryArgs ?? ""})`,
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "Clients", id })),
              { type: "Clients", id: "ADMIN_LIST" },
            ]
          : [{ type: "Clients", id: "ADMIN_LIST" }],
    }),

    getAdminClient: builder.query({
      query: (arg) => {
        const clientId =
          arg && typeof arg === "object" && arg != null && "clientId" in arg
            ? arg.clientId
            : arg;
        const role =
          arg && typeof arg === "object" && arg != null && "role" in arg
            ? arg.role
            : undefined;
        return `${clientsScopePrefix(role)}/clients/${clientId}`;
      },
      serializeQueryArgs: ({ queryArgs }) => {
        if (queryArgs && typeof queryArgs === "object" && "clientId" in queryArgs) {
          return {
            clientId: queryArgs.clientId,
            role: queryArgs.role,
          };
        }
        return { clientId: queryArgs };
      },
      transformResponse: (response) => response?.data?.client ?? null,
      providesTags: (_result, _error, arg) => {
        const clientId =
          arg && typeof arg === "object" && arg != null && "clientId" in arg
            ? arg.clientId
            : arg;
        return [
          { type: "Clients", id: clientId },
          { type: "Clients", id: "ADMIN_LIST" },
        ];
      },
    }),

    // ✅ (غير مستخدم بالداش حالياً) قائمة clients العامة
    getClients: builder.query({
      query: (searchTerm) => ({
        url: "/clients",
        params: { search: searchTerm },
      }),
      transformResponse: (response) => {
        // Supports ApiResponse-style { status, data: [...] } or raw arrays.
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        return [];
      },
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
  useGetAdminClientsQuery,
  useGetAdminClientQuery,
  useGetClientsQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetClientCreationDataQuery,
  useLazyGetClientCreationDataQuery,
  useGetCitiesForCountryQuery,
  useLazyGetCitiesForCountryQuery,
} = clientsApiSlice;
