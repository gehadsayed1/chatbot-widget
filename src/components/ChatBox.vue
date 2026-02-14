<template>
  <div
    v-show="chat.isOpen"
    ref="chatContainer"
    role="dialog"
    :aria-label="t('chatWindow')"
    aria-modal="true"
    class="fixed z-[9999] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col
           inset-x-2 bottom-20 h-[78dvh] max-h-[700px]
           sm:inset-x-auto sm:right-4 sm:bottom-24 sm:w-[min(92vw,420px)] sm:h-[82dvh]
           md:right-6 md:w-[420px] md:h-[80dvh]
           lg:w-[460px] lg:max-h-[760px]"
  >
    <ChatHeader />
    <div class="flex-1 relative overflow-hidden">
      <div v-if="chat.messages.length"
        class="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <img src="../assets/logo2.png" alt="background logo"
          class="w-56 h-56 object-contain opacity-10 select-none brightness-75" />
      </div>
      <ChatMessages ref="chatMessagesRef" />
    </div>
    <ChatSuggestions :scrollContainer="scrollContainerElement" />
    <ChatFooter :scrollContainer="scrollContainerElement" />

    <VoiceCall v-if="chat.isVoiceCallOpen" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import ChatHeader from "./ChatHeader.vue";
import ChatMessages from "./ChatMessages.vue";
import ChatSuggestions from "./ChatSuggestions.vue";
import ChatFooter from "./ChatFooter.vue";
import VoiceCall from "./VoiceCall.vue";
import { useChatStore } from "../stores/chat";
import { useI18n } from "vue-i18n";

const chat = useChatStore();
const { t } = useI18n();
const chatContainer = ref(null);
const chatMessagesRef = ref(null);

// Computed property to get the scroll container from ChatMessages
const scrollContainerElement = computed(() => {
  return chatMessagesRef.value?.scrollContainer || null;
});


const handleKeydown = (event) => {
  if (event.key === "Escape" && chat.isOpen) {
    chat.closeChat();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>
