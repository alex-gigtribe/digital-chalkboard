import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: "https://qa.adagintech.com",
        changeOrigin: true,
        secure: false,
      },
      "/Account": {
        target: "https://qa.adagintech.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
