import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: '/chatbot-widget/',
  build: {
    lib: {
      entry: 'src/embed.js',
      name: 'SmartChatbot',
      formats: ['iife'],
      fileName: () => 'widget.js',
    },
    cssCodeSplit: false,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name && chunkInfo.name.endsWith('.css')) return 'widget.css';
          return 'assets/[name][extname]';
        },
      },
    },
  },
})


