<template>
  <div class="absolute inset-0 z-10">
    <main
      id="chatMessages"
      ref="scrollContainer"
      role="log"
      aria-live="polite"
      aria-atomic="false"
      class="h-full w-full overflow-y-auto p-5 bg-transparent"
      @scroll="handleScroll"
    >
      <div class="space-y-4 pb-12">
        <!-- Welcome Screen -->
        <ChatWelcome v-if="!chat.messages.length || !chat.languageSelected" />

        <!-- Messages List -->
        <template v-if="chat.languageSelected">
          <div
            v-for="(msg, index) in chat.messages"
            :key="msg.timestamp || index"
          >
            <!-- Bot Message -->
            <BotMessage
              v-if="msg.from === 'bot' && !msg.loading"
              :msg="msg"
            />

            <!-- User Message -->
            <UserMessage
              v-else-if="msg.from === 'user'"
              :msg="msg"
            />
          </div>
        </template>
            

        <!-- Loader (Typing Indicator) -->
        <ChatLoader v-if="chat.messages.some((m) => m.loading)" />
      </div>
    </main>

    <!-- Scroll to Bottom Button -->
    <button
      v-show="showScrollButton"
      @click="scrollToBottom"
      class="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-primary-dark text-white shadow-lg flex items-center justify-center hover:bg-primary transition-all duration-300 z-50 animate-bounce cursor-pointer"
      :title="t('scrollToBottom')"
    >
      <i class="fa-solid fa-arrow-down"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useChatStore } from "../stores/chat";
import { useI18n } from "vue-i18n";
import { CHAT_CONFIG } from "../constants";

import ChatWelcome from "./ChatWelcome.vue";
import BotMessage from "./messages/BotMessage.vue";
import UserMessage from "./messages/UserMessage.vue";
import ChatLoader from "./messages/ChatLoader.vue";

const { t } = useI18n();
const chat = useChatStore();

const showScrollButton = ref(false);

const handleScroll = (event) => {
  const el = event.target;
  const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
  showScrollButton.value = distanceToBottom > 150;
};

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

watch(
  () => chat.messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);
</script>

<style scoped>
/* No specific styles needed here as they were moved to components */
</style>
