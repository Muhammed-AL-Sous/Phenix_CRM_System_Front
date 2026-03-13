import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      // نخزن بيانات المستخدم فقط للسرعة، لكن التأكد الحقيقي سيكون عبر الكوكيز
      localStorage.setItem("user", JSON.stringify(payload.user));
    },

    logOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      // ملاحظة: ستحتاج لاستدعاء دالة Logout من الباك اند لحذف الكوكي من المتصفح
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
