<template>
  <div
    class="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col w-full h-full rounded-none"
    role="dialog"
    aria-label="مكالمة صوتية"
    aria-modal="true"
  >
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-3 bg-[#b5893d] text-white">
      <h1 class="text-lg font-bold">Voice Chat</h1>
      <button
        @click="onClose"
        class="p-2 hover:bg-white/20 rounded-full"
        aria-label="إنهاء المكالمة"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </header>

    <!-- Content -->
    <main class="flex flex-col items-center justify-center flex-grow p-6">
      <div class="relative flex items-center justify-center">
        <!-- Pulsing circles behind avatar -->
        <span class="absolute inline-flex h-44 w-44 rounded-full bg-[#b5893d]/20 animate-ping"></span>
        <span class="absolute inline-flex h-56 w-56 rounded-full bg-[#b5893d]/10 animate-ping [animation-delay:200ms]"></span>
        <span class="absolute inline-flex h-64 w-64 rounded-full bg-[#b5893d]/5 animate-ping [animation-delay:400ms]"></span>

        <!-- Avatar with subtle wave -->
        <div class="w-36 h-36 rounded-full overflow-hidden border-4 border-[#b5893d] shadow-lg wave">
          <img
            src="https://t3.ftcdn.net/jpg/01/27/80/10/240_F_127801046_ArruIMeKVplhBv4xDPPoqkXSZQBIWgKW.jpg"
            class="w-full h-full object-cover"
            alt="صورة المتصل"
          />
        </div>
      </div>
      <p class="mt-8 text-lg font-semibold text-gray-700">🎙️ Speaking...</p>
    </main>

    <!-- Footer -->
    <footer class="p-6 flex justify-center">
      <button
        @click="onClose"
        class="w-44 h-12 bg-red-600 rounded-lg flex items-center justify-center gap-2 text-white font-semibold shadow-md hover:bg-red-700 transition"
      >
        <svg class="w-6 h-6 rotate-135" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.2.48 2.53.73 3.88.73a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.25 2.68.73 3.88a1 1 0 01-.21 1.11l-2.2 2.2z"/>
        </svg>
        End Call
      </button>
    </footer>
  </div>
</template>

<script setup>
import { useChatStore } from "../stores/chat";
const chat = useChatStore();

function onClose() {
  chat.closeVoiceCall();
}
</script>

<style scoped>
@keyframes wave {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}
.wave { animation: wave 2s infinite ease-in-out; }
</style>


