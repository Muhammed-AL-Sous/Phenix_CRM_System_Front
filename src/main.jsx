import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./assets/styles/fonts.css";

import AppRoot from "./AppRoot.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
);
