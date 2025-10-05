import { defineStore } from "pinia";
import { ref } from "vue";

export const useChatStore = defineStore("chat", () => {
  const isOpen = ref(false);
  const messages = ref([

  ]);

  const toggleChat = () => (isOpen.value = !isOpen.value);
  const closeChat = () => (isOpen.value = false);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    messages.value.push({ from: "user", text });
  
    setTimeout(() => {
      messages.value.push({
        from: "bot",
        text: "شكراً لتواصلك معنا، سيتم الرد عليك في أقرب وقت ممكن ⏰",
      });
    }, 800);
   
  };

  return { isOpen, messages, toggleChat, closeChat, sendMessage };
});
