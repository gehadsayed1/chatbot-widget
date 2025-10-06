<template>
  <button
    id="chatToggle"
    @click="chat.toggleChat"
    aria-label="فتح نافذة الدردشة"
    :aria-expanded="chat.isOpen"
    class="fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl cursor-pointer shadow-xl transition-all focus:ring-0 duration-300 bg-gradient-to-br from-[#d2961e] to-[#b07f14] hover:scale-110 animate-pulse z-50"
  >
    <i class="fa-solid fa-headset text-3xl" aria-hidden="true"></i>
  </button>
</template>

<script setup>
import { useChatStore } from "../stores/chat";
const chat = useChatStore();
</script>
