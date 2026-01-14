import { defineStore } from "pinia";
import { ref, watch } from "vue";
import notificationSound from "../assets/mixkit-confirmation-tone-2867.wav";

export const useChatMessagesStore = defineStore("chat-messages", () => {
  const messages = ref([]);
  const STORAGE_KEY = "goeic_chat_messages";

  // Init logic
  if (typeof window !== "undefined") {
    const storedMessages = sessionStorage.getItem(STORAGE_KEY);
    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          messages.value = parsed;
        } else {
          messages.value = [];
        }
      } catch (e) {
        messages.value = [];
      }
    }
  }

  // Persistence
  watch(
    messages,
    (newMessages) => {
      if (typeof window !== "undefined") {
        if (newMessages.length > 0) {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    },
    { deep: true }
  );

  const clearMessages = () => {
    messages.value = [];
  };

  const addUserMessage = (text) => {
    messages.value.push({
      from: "user",
      text,
      timestamp: Date.now(),
    });
  };

  const addBotMessage = (response = {}) => {
    try {
      const sound = new Audio(notificationSound);
      sound.volume = 0.5;
      sound.play().catch(() => {});
    } catch (err) {
      // silent
    }

    messages.value.push({
      from: "bot",
      text: response.text || "",
      suggestions: response.suggestions || [],
      timestamp: Date.now(),
      ...response,
    });
  };

  const getChatHistory = () => {
    return messages.value
      .filter((m) => !m.loading && !m.error)
      .map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text || m.html || "",
      }));
  };

  return {
    messages,
    clearMessages,
    addUserMessage,
    addBotMessage,
    getChatHistory,
  };
});
