import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { resolve } from "path";

export default defineConfig({
  define: {
    "process.env": JSON.stringify({}),
    process: JSON.stringify({ env: {} }),
    global: "window",
  },
  plugins: [
    vue({
      customElement: true, // Enable custom element mode
    }),
    cssInjectedByJsPlugin(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.js"),
      name: "ChatWidget",
      formats: ["umd"],
      fileName: () => "chatbot.js",
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [], 
      output: {
        inlineDynamicImports: true,
      },
    },
  },

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
