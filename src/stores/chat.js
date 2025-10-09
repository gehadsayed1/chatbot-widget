import { defineStore } from "pinia";
import { ref } from "vue";

export const useChatStore = defineStore("chat", () => {
  const isOpen = ref(false);
  const messages = ref([]);
  const isVoiceCallOpen = ref(false);

  const toggleChat = () => {
    isOpen.value = !isOpen.value;
  };

  const closeChat = () => {
    isOpen.value = false;
  };

  const openChat = () => {
    isOpen.value = true;
  };

  const sendMessage = (text) => {
    const trimmedText = text?.trim();
    if (!trimmedText) return;
    
    messages.value.push({ 
      from: "user", 
      text: trimmedText,
      timestamp: Date.now()
    });
  };

  const clearMessages = () => {
    messages.value = [];
  };

  const openVoiceCall = () => {
    isVoiceCallOpen.value = true;
  };

  const closeVoiceCall = () => {
    isVoiceCallOpen.value = false;
  };

  return { 
    isOpen, 
    messages, 
    isVoiceCallOpen,
    toggleChat, 
    closeChat, 
    openChat,
    sendMessage,
    clearMessages,
    openVoiceCall,
    closeVoiceCall
  };
});
