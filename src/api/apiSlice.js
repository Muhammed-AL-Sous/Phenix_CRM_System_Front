// src/services/baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (match) {
    return decodeURIComponent(match[1]);
  }
  return null;
}

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "/api",
    credentials: "include",

    prepareHeaders: (headers) => {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers.set("X-XSRF-TOKEN", csrfToken);
      }

      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      headers.set("X-Requested-With", "XMLHttpRequest");

      return headers;
    },
  }),

  tagTypes: ["User", "Auth"],

  // ⭐ هذا مهم - نعرف endpoints فارغة هنا
  endpoints: () => ({}),
});
