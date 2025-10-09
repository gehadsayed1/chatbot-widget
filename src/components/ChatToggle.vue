<template>
  <button
    id="chatToggle"
    @click="chat.toggleChat"
    aria-label="فتح نافذة الدردشة"
    :aria-expanded="chat.isOpen"
    class="fixed z-[10000] rounded-full flex items-center justify-center text-white cursor-pointer shadow-xl transition-all focus:ring-0 duration-300 bg-gradient-to-br from-[#d2961e] to-[#b07f14] hover:scale-110 sm:animate-pulse motion-reduce:animate-none
           right-4 bottom-4 w-14 h-14 text-2xl
           sm:right-8 sm:bottom-8 sm:w-16 sm:h-16 sm:text-3xl"
  >
    <i class="fa-solid fa-headset text-3xl" aria-hidden="true"></i>
  </button>
</template>

<script setup>
import { useChatStore } from "../stores/chat";
const chat = useChatStore();
</script>
