<template>
  <div class="px-3 py-2 flex flex-wrap gap-2 bg-white border-t border-gray-100 justify-center">
    <button
      v-for="s in suggestions"
      :key="s.text"
      class="suggest px-4 py-2 rounded-full border border-[#d2961e] font-semibold text-[#d2961e] text-sm relative overflow-hidden transition-all duration-300 hover:scale-[1.03]"
      @click="handleSuggestion(s.text)"
    >
      <span class="relative z-10 flex items-center gap-2">
        <i :class="s.icon"></i>
        {{ s.text }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { useChatStore } from "../stores/chat";
const chat = useChatStore();

const suggestions = [
  { text: "استفسار", icon: "fa-solid fa-question-circle" },
  { text: "شكوى", icon: "fa-solid fa-exclamation-triangle" },
  { text: "اقتراح", icon: "fa-solid fa-lightbulb" },
  { text: "أخبار الهيئة", icon: "fa-solid fa-newspaper" },
];


function handleSuggestion(text) {
  if (chat.showWelcome) chat.showWelcome = false; 
  chat.sendMessage(text); 
}
</script>

<style scoped>
.suggest::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to left, #d2961e, #b07f14);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
  z-index: 0;
  border-radius: 9999px;
}

.suggest:hover::before {
  transform: scaleX(1);
}

.suggest:hover {
  color: #fff !important;
}
</style>
