import { createI18n } from "vue-i18n";
import ar from "./locales/ar.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

// Helper to get saved locale or default
const getSavedLocale = () => {
  if (typeof window !== "undefined") {
    // Try localStorage first
    const saved = localStorage.getItem("goeic_language");
    if (saved && ["ar", "en", "fr"].includes(saved)) {
      return saved;
    }
    // Fallback to cookie (if needed for backward combatibility)
    const cookieMatch = document.cookie.match(/goeic_language=([^;]+)/);
    if (cookieMatch && ["ar", "en", "fr"].includes(cookieMatch[1])) {
      return cookieMatch[1];
    }
  }
  return "ar";
};

const locale = getSavedLocale();
const messages = { ar, en, fr };

// Helper to set direction
const setDirection = (lang) => {
  const dir = messages[lang].direction || "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
  return dir;
};

// Initialize direction based on current locale
setDirection(locale);

const i18n = createI18n({
  legacy: false, // Composition API
  locale: locale,
  fallbackLocale: "ar",
  globalInjection: true, // Keep it simple to access globally if needed
  messages,
});

export default i18n;

export const setI18nLanguage = (lang) => {
  i18n.global.locale.value = lang;
  setDirection(lang);
  localStorage.setItem("goeic_language", lang);
  document.cookie = `goeic_language=${lang}; path=/`; // Keep cookie sync for now if backend needs it
};
