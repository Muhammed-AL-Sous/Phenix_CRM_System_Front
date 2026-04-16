import { baseApi } from "../../api/apiSlice";
import {
  compactUsersListParams,
  normalizeUsersListResponse,
  usersListParamsToQueryString,
} from "./usersQueryUtils";

const USERS_SCOPE_BASE_PATH = {
  // Admin-only listing endpoints live under `/api/admin/*`
  admin: "/admin/users",
  // Shared staff endpoints live under `/api/staff/*`
  manager: "/staff/users",
  support: "/staff/users",
};

function isStaffScope(scope) {
  return scope === "admin" || scope === "manager" || scope === "support";
}

function resolveUsersBasePath(scope) {
  if (scope && USERS_SCOPE_BASE_PATH[scope]) return USERS_SCOPE_BASE_PATH[scope];
  return "/users";
}

export const usersApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (arg) => {
        const path = resolveUsersBasePath(arg?.scope);
        const params = compactUsersListParams(arg);
        return `${path}${usersListParamsToQueryString(params)}`;
      },
      transformResponse: (response) => normalizeUsersListResponse(response),
      providesTags: (result) =>
        result?.users?.length
          ? [
              ...result.users.map(({ id }) => ({ type: "User", id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    addUser: builder.mutation({
      queryFn: async (arg, _api, _extraOptions, baseQuery) => {
        const { scope, ...userData } = arg || {};
        if (!isStaffScope(scope)) {
          return {
            error: {
              status: 403,
              data: { message: "Forbidden: only staff can create users." },
            },
          };
        }
        return baseQuery({
          url: resolveUsersBasePath(scope),
          method: "POST",
          body: userData,
        });
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id: "LIST" },
        { type: "User", id },
      ],
    }),

    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["Stats"],
    }),

    updateUser: builder.mutation({
      queryFn: async (arg, _api, _extraOptions, baseQuery) => {
        const { id, scope, ...data } = arg || {};
        if (!isStaffScope(scope)) {
          return {
            error: {
              status: 403,
              data: { message: "Forbidden: only staff can update users." },
            },
          };
        }
        return baseQuery({
          url: `${resolveUsersBasePath(scope)}/${id}`,
          method: "PUT",
          body: data,
        });
      },
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
