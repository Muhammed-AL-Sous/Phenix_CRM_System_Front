import { Provider } from "react-redux";
import { RouterProvider } from "react-router/dom";

import AppBlockingOverlay from "./components/common/AppBlockingOverlay.jsx";
import { store } from "./store/store";
import AuthInitializer from "./features/auth/components/common/AuthInitializer";
import UIProvider from "./providers/UIProvider";
import SonnerToaster from "./lib/SonnerToaster";
import { router } from "./routes";

export default function AppRoot() {
  return (
    <Provider store={store}>
      <AppBlockingOverlay />
      <UIProvider>
        <SonnerToaster />
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
      </UIProvider>
    </Provider>
  );
}
