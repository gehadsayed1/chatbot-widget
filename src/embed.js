import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

// 1. Create the widget container
let root = document.getElementById("chatbot-widget-root");
if (!root) {
  root = document.createElement("div");
  root.id = "chatbot-widget-root";
  document.body.appendChild(root);
}

// 2. Setup Vue + Pinia correctly
const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // 🔥 أهم خطوة
app.mount("#chatbot-widget-root");
