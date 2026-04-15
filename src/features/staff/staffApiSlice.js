import { baseApi } from "../../api/apiSlice";

export const staffApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query({
      query: () => "/admin/users/staff",
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "User", id })),
              { type: "User", id: "STAFF_LIST" },
            ]
          : [{ type: "User", id: "STAFF_LIST" }],
    }),
  }),
});

export const { useGetStaffQuery } = staffApiSlice;

