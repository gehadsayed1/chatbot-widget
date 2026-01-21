import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "goeic.stadiaholding.com",
      "35.223.177.99",
    ],
    proxy: {
      "/api": {
        target: "http://196.219.221.203",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/callcenterapi/api"),
      },
    },
  },
});
