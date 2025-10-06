<template>
  <div
    v-show="chat.isOpen"
    ref="chatContainer"
    role="dialog"
    aria-label="نافذة الدردشة"
    aria-modal="true"
    class="fixed bottom-25 right-6 z-[9999] h-[85vh] w-[35vw] max-w-[500px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
  >
    <ChatHeader />
    <div class="flex-1 relative overflow-hidden">
      <div
        v-if="chat.messages.length"
        class="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
      >
        <img
          src="../assets/logo2.png"
          alt="background logo"
          class="w-56 h-56 object-contain opacity-10 select-none brightness-75"
        />
      </div>
      <ChatMessages />
    </div>
    <ChatSuggestions />
    <ChatFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import ChatHeader from "./ChatHeader.vue";
import ChatMessages from "./ChatMessages.vue";
import ChatSuggestions from "./ChatSuggestions.vue";
import ChatFooter from "./ChatFooter.vue";
import { useChatStore } from "../stores/chat";

const chat = useChatStore();
const chatContainer = ref(null);

// Close chat on ESC key
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