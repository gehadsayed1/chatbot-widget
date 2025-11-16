import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  define: {
    "process.env": {}, // fix browser process undefined
  },
  build: {
    lib: {
      entry: "src/embed.js",
      name: "ChatbotWidget",
      fileName: () => "widget.js",
      formats: ["iife"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: { vue: "Vue" },
      },
    },
  },
});
