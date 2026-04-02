import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/apiSlice";
import authReducer from "../features/auth/authSlice";
import uiReducer from "./Slices/uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: import.meta.env.DEV,
});
