<template>
  <main
    id="chatMessages"
    class="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fdfcfb] relative"
  >
    <div
      class="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
    >
      <img
        v-if="chat.messages.length"
        src="../assets/logo2.png"
        alt="background logo"
        class="w-56 h-56 object-contain opacity-10 select-none brightness-75"
      />
    </div>

    <ChatWelcome v-if="!chat.messages.length" />

    <div
      v-else
      v-for="(msg, index) in chat.messages"
      :key="index"
      class="flex items-start gap-3 relative z-10"
      :class="msg.from === 'user' ? 'justify-end' : ''"
    >
      <template v-if="msg.from === 'bot'">
        <img
          class="w-10 h-10 rounded-full shrink-0 bg-cover bg-center border border-[#d2961e]/30 shadow-sm"
          src="../assets/logo2.png"
          alt="chatbot"
        />
        <div
          class="message-bubble from-bot bg-gradient-to-br from-[#fff8e1] to-[#f4e6c2] border border-[#d2961e]/20 text-gray-800 rounded-2xl px-4 py-3 shadow"
        >
          {{ msg.text }}
        </div>
      </template>

      <template v-else>
        <div
          class="message-bubble from-user bg-gradient-to-br from-[#d2961e] to-[#b07f14] text-white border border-white/30 rounded-2xl px-4 py-3 shadow"
        >
          {{ msg.text }}
        </div>
        <img
          class="w-10 h-10 rounded-full shrink-0 bg-cover bg-center border border-[#d2961e]/30 shadow-sm"
          src="../assets/user.webp"
          alt="user"
        />
      </template>
    </div>

    <div v-if="isBotTyping" class="flex items-start gap-3 relative z-10">
      <img
        class="w-10 h-10 rounded-full shrink-0 bg-cover bg-center border border-[#d2961e]/30 shadow-sm"
        src="../assets/logo2.png"
        alt="chatbot typing"
      />
      <div
        class="bg-gradient-to-br from-[#fff8e1] to-[#f4e6c2] border border-[#d2961e]/20 text-gray-800 rounded-2xl px-4 py-3 shadow flex gap-1"
      >
        <span class="w-2 h-2 bg-[#d2961e] rounded-full animate-bounce"></span>
        <span
          class="w-2 h-2 bg-[#d2961e] rounded-full animate-bounce [animation-delay:0.2s]"
        ></span>
        <span
          class="w-2 h-2 bg-[#d2961e] rounded-full animate-bounce [animation-delay:0.4s]"
        ></span>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useChatStore } from "../stores/chat";
import ChatWelcome from "./ChatWelcome.vue";

const chat = useChatStore();
const isBotTyping = ref(false);

watch(
  () => chat.messages.length,
  async () => {
    await nextTick();
    const chatContainer = document.getElementById("chatMessages");
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }
);

watch(
  () => chat.messages[chat.messages.length - 1],
  (lastMsg) => {
    if (lastMsg?.from === "user") {
      isBotTyping.value = true;

      setTimeout(() => {
        isBotTyping.value = false;
        chat.messages.push({
          from: "bot",
          text: "تمام، تم استلام رسالتك 🤖",
        });
      }, 1500);
    }
  }
);
</script>
