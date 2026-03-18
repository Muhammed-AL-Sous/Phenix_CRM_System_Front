import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // لا نقرأ من localStorage
    isAuthenticated: false, // حالة منطقية للتحكم في الـ UI
  },
  reducers: {
    setCredentials: (state, action) => {
      const userData = action.payload.user
        ? action.payload.user
        : action.payload;
      state.user = userData;
      // المستخدم يعتبر "موثق" فقط إذا كان حسابه نشطاً
      state.isAuthenticated = !!userData.is_active;
    },

    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
