import { baseApi } from "../../api/apiSlice";

export const usersApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/admin/users",
      transformResponse: (response) => {
        if (Array.isArray(response?.data)) {
          return response.data;
        }
        return [];
      },
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "User", id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    addUser: builder.mutation({
      query: (userData) => ({
        url: "/admin/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["Stats"],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: "LIST" },
        { type: "User", id },
        "Stats",
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
