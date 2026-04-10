import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Single backend URL — must match APP_URL / Laravel host (see Back_End_Laravel .env).
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_BACKEND_URL || "http://back_end_laravel.test";

  return {
  server: {
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
      "/sanctum": {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
      "/broadcasting": {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
      // Laravel Reverb (Pusher protocol): same port as the Vite dev server so
      // pusher-js can use ws/wss against localhost:5173 while Reverb runs on 8080.
      "/app": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  base: "/",
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
};
});
