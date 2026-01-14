<template>
  <footer v-if="chat.languageSelected" class="chat-footer bg-white border-t border-gray-100 p-2 flex items-center gap-2" role="contentinfo">
    <textarea v-model="message" ref="messageInput" rows="1"
      :placeholder="t('inputPlaceholder')" :aria-label="t('inputPlaceholder')"
      class="flex-1 border border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:border-primary resize-none max-h-32 overflow-auto placeholder:text-sm"
      @keydown.enter.exact.prevent="handleSend" />


    <button type="button" :aria-label="t('voiceStart')" @click="startVoiceCall"
      class="w-11 h-11 rounded-full cursor-pointer border text-primary border-gray-200 flex items-center justify-center transition hover:bg-primary hover:text-white"
      :title="t('voiceStart')">
      <i class="fa-solid fa-microphone" aria-hidden="true"></i>
    </button>

    <button v-if="chat.isLoading && !message.trim()" type="button" @click="chat.stopGeneration" aria-label="Stop generation"
      class="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition shadow-sm border border-red-200"
      title="Stop generation">
      <i class="fa-solid fa-square text-lg"></i>
    </button>

    <button v-else type="button" @click="handleSend" :aria-label="t('sendButton')" :disabled="!message.trim()"
      class="flex items-center gap-2 cursor-pointer bg-gradient-to-br from-primary to-primary-dark text-white font-semibold px-4 py-2 rounded-full shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
      <span>{{ t('sendButton') }}</span>
      <i class="fa-solid fa-paper-plane transform scale-x-[1]" aria-hidden="true"></i>
    </button>
  </footer>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useChatStore } from "../stores/chat";
import { CHAT_CONFIG } from "../constants";
import { useI18n } from "vue-i18n";

const chat = useChatStore();
const { t } = useI18n();
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