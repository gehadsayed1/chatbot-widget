<template>
  <header
    class="bg-gradient-to-br from-[#d2961e] via-[#b07f14] to-[#8d680f] p-4 text-center relative text-white"
    role="banner"
  >
    <div class="flex items-center justify-center gap-3 relative">
      <img src="../assets/logo2.png" alt="Smart GOEIC" class="h-8 object-contain" />
      <span class="absolute right-3 top-3 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></span>
    </div>
    <button
      @click="chat.closeChat"
      aria-label="إغلاق نافذة الدردشة"
      class="absolute top-3 left-3 bg-white/20 rounded-full w-9 h-9 flex items-center justify-center hover:bg-white/30 transition-all"
    >
      <i class="fa-solid fa-times text-white" aria-hidden="true"></i>
    </button>
  </header>
</template>

<script setup>
import { useChatStore } from "../stores/chat";
const chat = useChatStore();
</script>
