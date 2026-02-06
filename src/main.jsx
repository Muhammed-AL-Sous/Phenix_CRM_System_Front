import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Radix UI Themes
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

// React Router Dom
import { RouterProvider } from "react-router/dom";
import { router } from "./routes";

// Redux Toolkit
import { store } from "./store";
import { Provider } from "react-redux";

// Global Css File
import "./index.css";

// Translation Library
import "./i18n";

// Custom Fonts
import "./assets/styles/fonts.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Theme>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </Theme>
  </StrictMode>,
);
