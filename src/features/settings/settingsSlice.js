import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: localStorage.getItem("theme") === "dark" || false,
  language: localStorage.getItem("lang") || "ar", // الافتراضي عربي
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("theme", state.darkMode ? "dark" : "light");
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("lang", action.payload);
      // لتحويل اتجاه الصفحة (RTL/LTR)
      document.dir = action.payload === "ar" ? "rtl" : "ltr";
    },
  },
});

export const { toggleTheme, setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
