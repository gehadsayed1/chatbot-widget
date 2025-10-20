<template>
  <footer
    class="chat-footer bg-white border-t border-gray-100 p-4 flex items-center gap-3"
    role="contentinfo"
  >
    <textarea
      v-model="message"
      ref="messageInput"
      dir="rtl"
      rows="1"
      placeholder="اسأل واحنا نرد عليك ..."
      aria-label="حقل إدخال الرسالة"
      class="flex-1 border border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:border-[#d2961e] resize-none max-h-32 overflow-auto"
      @keydown.enter.exact.prevent="handleSend"
    />

    <button
      type="button"
      aria-label="بدء مكالمة صوتية"
      @click="startVoiceCall"
      class="w-11 h-11 rounded-full cursor-pointer border text-[#d2961e] border-gray-200 flex items-center justify-center transition hover:bg-[#d2961e] hover:text-white"
      title="بدء مكالمة صوتية"
    >
      <i class="fa-solid fa-microphone" aria-hidden="true"></i>
    </button>

    <button
      type="button"
      @click="handleSend"
      aria-label="إرسال الرسالة"
      :disabled="!message.trim()"
      class="flex items-center gap-2 cursor-pointer bg-gradient-to-br from-[#d2961e] to-[#b07f14] text-white font-semibold px-4 py-2 rounded-full shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span>إرسال</span>
      <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
    </button>
  </footer>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useChatStore } from "../stores/chat";
import { CHAT_CONFIG } from "../constants";

const chat = useChatStore();
const message = ref("");
const messageInput = ref(null);

const scrollToBottom = async () => {
  await nextTick();
  const chatContainer = document.getElementById("chatMessages");
  if (chatContainer) {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: CHAT_CONFIG.SCROLL_BEHAVIOR,
    });
  }
};

const handleSend = async () => {
  if (!message.value.trim()) return;
  
  chat.sendMessage(message.value);
  message.value = "";
  await scrollToBottom();
  
  // Focus back to input after sending
  await nextTick();
  messageInput.value?.focus();
};

const handleSuggestion = async (text) => {
  chat.sendMessage(text);
  await scrollToBottom();
};

const startVoiceCall = () => {
  chat.openVoiceCall();
};
defineExpose({
  handleSuggestion,
  scrollToBottom
});
</script>