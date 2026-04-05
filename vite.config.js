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
