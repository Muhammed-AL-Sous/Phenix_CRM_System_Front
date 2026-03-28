import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // لا نقرأ من localStorage
    isAuthenticated: false, // حالة منطقية للتحكم في الـ UI
    isAuthReady: false, // تأكد أننا لا نوجه قبل اكتمال التحقق
  },
  reducers: {
    setCredentials: (state, action) => {
      const userData = action.payload.user
        ? action.payload.user
        : action.payload;
      state.user = userData;
      // المستخدم يعتبر "موثق" فقط إذا كان حسابه نشطاً
      state.isAuthenticated = !!userData.is_active;
      state.isAuthReady = true;
    },

    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthReady = true;
    },
    setAuthReady: (state, action) => {
      state.isAuthReady = action.payload;
    },
  },
});

export const { setCredentials, logOut, setAuthReady } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthReady = (state) => state.auth.isAuthReady;
