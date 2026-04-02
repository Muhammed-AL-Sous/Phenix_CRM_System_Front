import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    // Vite يعمل على هذا الـ host والـ port
    host: "localhost",
    port: 5173,

    // هذا هو سر حل مشاكل CORS و CSRF
    proxy: {
      // كل طلب يبدأ بـ /api سيُحوَّل إلى Laravel
      "/api": {
        target: "http://back_end_laravel.test",
        changeOrigin: true,
        secure: false,
        // لا تحذف /api من المسار
        rewrite: (path) => path,
      },
      // مسار CSRF الخاص بـ Sanctum
      "/sanctum": {
        target: "http://back_end_laravel.test",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // إعداد المسارات المختصرة (اختياري لكن مفيد)
  resolve: {
    alias: {
      "@": "/src",
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
});
