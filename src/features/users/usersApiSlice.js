import { baseApi } from "../../api/apiSlice";
import {
  compactUsersListParams,
  normalizeUsersListResponse,
  usersListParamsToQueryString,
} from "./usersQueryUtils";

const USERS_SCOPE_BASE_PATH = {
  admin: "/admin/users",
  manager: "/manager/users",
  support: "/support/users",
  sales: "/sales/users",
};

function isStaffScope(scope) {
  return (
    scope === "admin" ||
    scope === "manager" ||
    scope === "support" ||
    scope === "sales"
  );
}

function resolveUsersBasePath(scope) {
  if (scope && USERS_SCOPE_BASE_PATH[scope])
    return USERS_SCOPE_BASE_PATH[scope];
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

    getRoles: builder.query({
      query: () => "/lookups/roles",
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],
      providesTags: [{ type: "Role", id: "LIST" }],
    }),

    getAdminUser: builder.query({
      query: (arg) => {
        const userId =
          arg && typeof arg === "object" && arg != null && "userId" in arg
            ? arg.userId
            : arg;
        const scope =
          arg && typeof arg === "object" && arg != null && "scope" in arg
            ? arg.scope
            : undefined;
        const path = resolveUsersBasePath(scope);
        return `${path}/${userId}`;
      },
      serializeQueryArgs: ({ queryArgs }) => {
        if (queryArgs && typeof queryArgs === "object" && "userId" in queryArgs) {
          return { userId: queryArgs.userId, scope: queryArgs.scope };
        }
        return { userId: queryArgs };
      },
      transformResponse: (response) => response?.data ?? null,
      providesTags: (_result, _error, arg) => {
        const id =
          arg && typeof arg === "object" && arg != null && "userId" in arg
            ? arg.userId
            : arg;
        return [{ type: "User", id }];
      },
    }),

    addUser: builder.mutation({
      queryFn: async (arg, _api, _extraOptions, baseQuery) => {
        const { scope, ...userData } = arg || {};
        const path = resolveUsersBasePath(arg?.scope);
        if (!isStaffScope(scope)) {
          return {
            error: {
              status: 403,
              data: { message: "Forbidden: only staff can create users." },
            },
          };
        }
        return baseQuery({
          url: path,
          method: "POST",
          body: userData,
        });
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    deleteUser: builder.mutation({
      query: ({ id, scope }) => ({
        url: `${resolveUsersBasePath(scope ?? "admin")}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "User", id: "LIST" },
        { type: "User", id: arg?.id },
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
        const path = resolveUsersBasePath(arg?.scope);
        if (!isStaffScope(scope)) {
          return {
            error: {
              status: 403,
              data: { message: "Forbidden: only staff can update users." },
            },
          };
        }
        return baseQuery({
          url: `${path}/${id}`,
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
  useGetAdminUserQuery,
  useGetRolesQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateProfileMutation,
  useGetDashboardStatsQuery,
  useUpdateUserMutation,
} = usersApiSlice;
