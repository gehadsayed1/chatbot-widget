import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

export function mountChatbot(selector = "#chatbot-widget") {
  const container = document.querySelector(selector);
  if (!container) {
    console.error("ChatbotWidget: container not found:", selector);
    return;
  }

  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);
  app.mount(container);
}

// 👉 Create global variable for browser
window.ChatbotWidget = { mountChatbot };
