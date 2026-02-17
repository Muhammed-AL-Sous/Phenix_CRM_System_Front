import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// React Router Dom
import { RouterProvider } from "react-router/dom";
import { router } from "./routes";

// Redux Toolkit
import { store } from "./store/store";
import { Provider } from "react-redux";

// Global Css File
import "./index.css";

// Custom Fonts
import "./assets/styles/fonts.css";

// Auth Initializer
import AuthInitializer from "./features/auth/components/common/AuthInitializer";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* <AuthInitializer> */}
        <RouterProvider router={router} />
      {/* </AuthInitializer> */}
    </Provider>
  </StrictMode>,
);
