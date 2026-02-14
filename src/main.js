import { defineCustomElement, h, getCurrentInstance } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import styles from "./style.css?inline";
import App from "./App.ce.vue";
import i18n from "./i18n";

// Create a wrapper component to handle plugin installation
// defineCustomElement creates a new Vue app instance for each element
const ChatWidgetElement = defineCustomElement({
  // Forward props from App if needed (ignoring for now as root App implies no props)
  // Combine global styles (Tailwind) with component styles
  styles: [styles, ...(App.styles || [])],
  setup() {
    const app = getCurrentInstance().appContext.app;

    // Install plugins on this specific app instance
    const pinia = createPinia();
    app.use(pinia);
    app.use(i18n);

    // Render the actual App component
    return () => h(App);
  },
});

// Register the custom element
customElements.define("chat-widget", ChatWidgetElement);

// Auto-inject the widget if not already present
if (typeof window !== "undefined") {
  const injectWidget = () => {
    if (!document.querySelector("chat-widget")) {
      const widget = document.createElement("chat-widget");
      document.body.appendChild(widget);
    }
  };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", injectWidget);
  } else {
    injectWidget();
  }
}
