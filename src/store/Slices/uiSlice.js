import { createSlice } from "@reduxjs/toolkit";

const getInitialLang = () => {
  const saved = localStorage.getItem("lang");
  if (saved) return saved;
  return "en";
};

const getInitialMode = () => {
  const saved = localStorage.getItem("mode");
  if (saved) return saved;
  return "dark";
};

const initialLang = getInitialLang();

const initialState = {
  mode: getInitialMode(), // light | dark
  lang: initialLang, // ar | en
  direction: initialLang === "ar" ? "rtl" : "ltr",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("mode", state.mode);
    },

    setLang: (state, action) => {
      state.lang = action.payload;
      state.direction = action.payload === "ar" ? "rtl" : "ltr";

      localStorage.setItem("lang", state.lang);
    },
  },
});

export const { toggleMode, setLang } = uiSlice.actions;
export default uiSlice.reducer;
