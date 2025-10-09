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
        assetFileNames: (assetInfo) => {
          const name = assetInfo && assetInfo.name ? assetInfo.name : ''
          if (name.includes('.css')) return 'widget.css'
          return 'assets/[name][extname]'
        },
      },
    },
  },
})


