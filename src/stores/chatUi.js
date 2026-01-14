import { defineStore } from "pinia";
import { ref } from "vue";

export const useChatUiStore = defineStore("chat-ui", () => {
  const isOpen = ref(true);
  const isVoiceCallOpen = ref(false);

  const toggleChat = () => (isOpen.value = !isOpen.value);
  const openChat = () => (isOpen.value = true);
  const closeChat = () => (isOpen.value = false);

  const openVoiceCall = () => (isVoiceCallOpen.value = true);
  const closeVoiceCall = () => (isVoiceCallOpen.value = false);

  return {
    isOpen,
    isVoiceCallOpen,
    toggleChat,
    openChat,
    closeChat,
    openVoiceCall,
    closeVoiceCall,
  };
});
