<template>
  <div
    v-if="chat.languageSelected"
    class="px-3 py-2 flex flex-wrap gap-2 bg-white border-t border-gray-100 justify-center"
  >
    <button
      v-for="s in suggestions"
      :key="s.text"
      class="suggest cursor-pointer px-3 py-1.5 rounded-full border border-primary font-semibold text-primary text-xs relative overflow-hidden transition-all duration-300 hover:scale-[1.03]"
      @click="handleSuggestion(s)"
    >
      <span class="relative z-10 flex items-center gap-2">
        <i :class="s.icon"></i>
        {{ s.text }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { ORG_INFO, SUGGESTIONS } from "../constants";
import { nextTick, computed } from "vue";
import { useChatStore } from "../stores/chat";

const chat = useChatStore();

const suggestions = computed(() => {
  // Find the last bot message that has suggestions
  const botMessages = chat.messages.filter(m => m.from === 'bot' && m.suggestions);
  if (botMessages.length > 0) {
    const lastBotMsg = botMessages[botMessages.length - 1];
    return lastBotMsg.suggestions.map(s => ({ text: s, icon: 'fa-solid fa-comment-dots' }));
  }
  
  // Default translated suggestions
  return [
    { text: chat.t.suggestion_query, icon: "fa-solid fa-question-circle", key: 'query' },
    { text: chat.t.suggestion_complaint, icon: "fa-solid fa-exclamation-triangle", key: 'complaint' },
    { text: chat.t.suggestion_suggestion, icon: "fa-solid fa-lightbulb", key: 'suggestion' },
    { text: chat.t.suggestion_complaintStatus, icon: "fa-solid fa-magnifying-glass", key: 'complaintStatus' },
    { text: chat.t.suggestion_currency, icon: "fa-solid fa-money-bill-transfer", key: 'currency' },
    { text: chat.t.suggestion_contactUs, icon: "fa-solid fa-phone", key: 'contactUs' },
  ];
});

const scrollToBottomLocal = async () => {
  await nextTick();
  const chatContainer = document.getElementById("chatMessages");
  if (chatContainer) {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
  }
};

const handleSuggestion = async (item) => {
  const text = typeof item === 'string' ? item : item.text;
  const key = item.key; // May be undefined for dynamic suggestions

  if (key === 'complaint' || text === "شكوى" || text === "Complaint" || text === "Plainte") {
    window.open("https://www.goeic.gov.eg/ar/complaints-and-suggestions", "_blank");
    return;
  }

  if (key === 'query' || text === "استفسار" || text === "Inquiry" || text === "Enquête") {
    window.open("https://www.goeic.gov.eg/ar/ask-us", "_blank");
    return;
  }

  if (key === 'complaintStatus' || text === "استعلام عن شكوى" || text === "Complaint Status" || text === "Statut de la plainte") {
    chat.messages.push({
      from: "bot",
      complaintForm: true,
      timestamp: Date.now(),
    });
    await scrollToBottomLocal();
    return;
  }

  if (key === 'currency') {
    window.open("https://www.cbe.org.eg/ar/economic-research/statistics/exchange-rates", "_blank");
    return;
  }

  if (key === 'contactUs' || text === "اتصل بنا" || text === "Contact Us" || text === "Contactez-nous") {
    chat.messages.push({
      from: "user",
      text: text,
      timestamp: Date.now(),
    });

    chat.messages.push({
      from: "bot",
      text: `يمكنك الاتصال:\n\n**الخط الساخن:** [${ORG_INFO.HOTLINE}](tel:${ORG_INFO.HOTLINE})\n**رقم الهاتف:** [${ORG_INFO.PHONE}](tel:${ORG_INFO.PHONE})`,
      timestamp: Date.now(),
    });

    await scrollToBottomLocal();
    return;
  }

  chat.sendMessage(text);
  await scrollToBottomLocal();
};
</script>


<style scoped>
.suggest::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to left, var(--color-primary), var(--color-primary-dark));
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
