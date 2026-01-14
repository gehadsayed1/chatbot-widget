import { defineStore } from "pinia";
import { ref } from "vue";
import i18n, { setI18nLanguage } from "../i18n";
import { getCookie, deleteCookie } from "../utils/cookies";

export const useChatSessionStore = defineStore("chat-session", () => {
  const sessionId = ref(null);
  const currentLanguage = ref(i18n.global.locale.value);
  const languageSelected = ref(false);

  if (typeof window !== "undefined") {
    const storedSession = getCookie("goeic_session_id");
    if (storedSession) {
      sessionId.value = storedSession;
    }
    currentLanguage.value = i18n.global.locale.value;

    // Restore languageSelected state if language or messages exist
    // Restore languageSelected state if language or messages exist
    // Update: Only restore if there are messages in this session.
    // New tab = New Session = Ask Language again (even if we remember preference).
    const storedMessages = sessionStorage.getItem("goeic_chat_messages");
    if (storedMessages && storedMessages !== "[]") {
      languageSelected.value = true;
    }
  }

  const setLanguage = (lang) => {
    currentLanguage.value = lang;
    languageSelected.value = true;
    setI18nLanguage(lang);
  };

  const clearSessionState = () => {
    sessionId.value = null;
    languageSelected.value = false;
    deleteCookie("goeic_session_id");
    localStorage.removeItem("goeic_language");
    deleteCookie("goeic_language");
  };

  return {
    sessionId,
    currentLanguage,
    languageSelected,
    setLanguage,
    clearSessionState,
  };
});
