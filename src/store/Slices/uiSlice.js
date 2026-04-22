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
  /** طبقة Lottie واحدة في التطبيق — لا تُلغى عند تغيّر المصادقة/المسار */
  /* يبدأ true حتى لا يظهر إطار فارغ قبل أول useLayoutEffect للمصادقة */
  loadingOverlayAuth: true,
  loadingOverlayRouteNav: false,
  loadingOverlayRouteSuspense: false,
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

    setLoadingOverlayAuth: (state, action) => {
      state.loadingOverlayAuth = Boolean(action.payload);
    },
    setLoadingOverlayRouteNav: (state, action) => {
      state.loadingOverlayRouteNav = Boolean(action.payload);
    },
    setLoadingOverlayRouteSuspense: (state, action) => {
      state.loadingOverlayRouteSuspense = Boolean(action.payload);
    },
  },
});

export const {
  toggleMode,
  setLang,
  setLoadingOverlayAuth,
  setLoadingOverlayRouteNav,
  setLoadingOverlayRouteSuspense,
} = uiSlice.actions;

/** أي سبب من أسباب حجب الواجهة — يُظهر طبقة Lottie الواحدة */
export const selectAppBlockingOverlay = (state) =>
  Boolean(
    state.ui.loadingOverlayAuth ||
      state.ui.loadingOverlayRouteNav ||
      state.ui.loadingOverlayRouteSuspense,
  );

export default uiSlice.reducer;
