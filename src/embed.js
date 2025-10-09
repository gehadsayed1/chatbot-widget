// Minimal embed entry to mount the widget into any site
import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useChatStore } from './stores/chat'

function ensureAssets() {
  // Font Awesome
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
    link.crossOrigin = 'anonymous'
    link.referrerPolicy = 'no-referrer'
    document.head.appendChild(link)
  }

  // Ensure widget.css is loaded next to widget.js automatically
  const hasWidgetCss = Array.from(document.styleSheets).some(s => s.href && s.href.includes('widget.css'))
  if (!hasWidgetCss) {
    // Try to infer base URL from the currently executing script
    let scriptEl = document.currentScript
    if (!scriptEl) {
      const scripts = Array.from(document.getElementsByTagName('script'))
      scriptEl = scripts.find(s => s.src && /widget\.js(\?|$)/.test(s.src)) || scripts[scripts.length - 1]
    }
    if (scriptEl && scriptEl.src) {
      try {
        const url = new URL(scriptEl.src, window.location.href)
        url.pathname = url.pathname.replace(/[^/]*$/, 'widget.css')
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = url.toString()
        document.head.appendChild(cssLink)
      } catch (_) {
        // ignore
      }
    }
  }
}

function createContainer() {
  let root = document.getElementById('smart-chatbot-root')
  if (!root) {
    root = document.createElement('div')
    root.id = 'smart-chatbot-root'
    document.body.appendChild(root)
  }
  const appDiv = document.createElement('div')
  appDiv.id = 'smart-chatbot-app'
  root.appendChild(appDiv)
  return appDiv
}

function mountWidget(options = {}) {
  ensureAssets()
  const container = createContainer()
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)
  app.mount(container)

  // Open by default if requested
  const store = useChatStore()
  if (options.openByDefault !== false) {
    store.openChat()
  }
}

;(function expose() {
  if (!window.SmartChatbot) window.SmartChatbot = {}
  window.SmartChatbot.init = (options) => mountWidget(options)
})()


