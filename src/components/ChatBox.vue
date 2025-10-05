<template>
  <div
    v-show="chat.isOpen"
    ref="chatContainer"
    class="fixed bottom-25 right-6 z-[9999] h-[85vh] w-[35vw] max-w-[500px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
  >
    <ChatHeader />
    <ChatMessages :show-background="shouldShowBackground" />

    <ChatSuggestions />
    <ChatFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import ChatHeader from "./ChatHeader.vue";
import ChatMessages from "./ChatMessages.vue";
import ChatSuggestions from "./ChatSuggestions.vue";
import ChatFooter from "./ChatFooter.vue";
import { useChatStore } from "../stores/chat";

const chat = useChatStore();
const chatContainer = ref(null);


const shouldShowBackground = computed(() => {
  return chat.messages.length === 0 || chat.messages.length <= 2;
});
</script>