<template>
  <footer
    class="chat-footer bg-white border-t border-gray-100 p-4 flex items-center gap-3"
  >
   
    <input
      v-model="message"
      dir="rtl"
      type="text"
      placeholder="اكتب رسالتك هنا..."
      class="flex-1 border border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:border-[#d2961e]"
      @keyup.enter="handleSend"
    />


    <button
      class="w-11 h-11 rounded-full cursor-pointer border text-[#d2961e] hover:text-white border-gray-200 flex items-center justify-center hover:bg-[#d2961e]  transition"
    >
      <i class="fa-solid fa-microphone "></i>
    </button>

    
    <button
      @click="handleSend"
      class="flex items-center gap-2 cursor-pointer bg-gradient-to-br from-[#d2961e] to-[#b07f14] text-white font-semibold px-4 py-2 rounded-full shadow hover:shadow-lg transition"
    >
      <span>إرسال</span>
      <i class="fa-solid fa-paper-plane"></i>
    </button>
  </footer>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useChatStore } from "../stores/chat";

const chat = useChatStore();
const message = ref("");


const scrollToBottom = async () => {
  await nextTick();
  const chatContainer = document.getElementById("chatMessages");
  if (chatContainer) {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
  }
};


const handleSend = async () => {
  if (!message.value.trim()) return;
  chat.sendMessage(message.value);
  message.value = "";
  await scrollToBottom();
};


const handleSuggestion = async (text) => {
  chat.sendMessage(text);
  await scrollToBottom();
};


defineExpose({
  handleSuggestion,
  scrollToBottom
});
</script>