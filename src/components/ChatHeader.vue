<template>
  <header
    class="bg-gradient-to-br from-[#d2961e] via-[#b07f14] to-[#8d680f] p-4 text-center relative text-white"
  >
    <h1 class="font-bold text-xl">Smart GOEIC </h1>
    <div class="flex justify-center items-center gap-2 mt-1 text-sm opacity-90">
      <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
      <span>نحن متواجدون الآن</span>
    </div>
    <button
      @click="chat.closeChat"
      class="absolute top-3 left-3 bg-white/20 rounded-full w-9 h-9 flex items-center justify-center hover:bg-white/30 transition-all"
    >
      <i class="fa-solid fa-times text-white"></i>
    </button>
  </header>
</template>

<script setup>
import { useChatStore } from "../stores/chat";
const chat = useChatStore();
</script>
