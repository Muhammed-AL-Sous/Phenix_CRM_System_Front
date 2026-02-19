import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import authReducer from "../features/auth/authSlice";
import settingsReducer from "../features/settings/settingsSlice";
import uiReducer from "./Slices/uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    // 1. إضافة الـ API Slice
    // نستخدم [apiSlice.reducerPath] ليكون الاسم ديناميكياً
    // (عادةً هو "api")
    [apiSlice.reducerPath]: apiSlice.reducer,

    // 2. إضافة الـ Auth Slice
    // هذا سيتيح لنا الوصول لبيانات المستخدم عبر
    // state.auth
    auth: authReducer,
    settings: settingsReducer,
  },

  // 3. إضافة الـ Middleware الخاص بـ RTK Query
  // هذا السطر ضروري جداً لتفعيل ميزات مثل
  // Caching و Invalidating Tags
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  // 4. تفعيل Redux DevTools (اختياري ولكنه مفيد جداً في التطوير)
  devTools: true,
});
