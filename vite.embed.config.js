import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/embed.js"),
      name: "ChatbotWidget",
      fileName: "widget",
      formats: ["iife"],
    },
    rollupOptions: {
      // 👉 مهم: ضمّني Vue و Pinia جوا الباندل
      external: [],
    },
  },
});
