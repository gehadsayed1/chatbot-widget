<template>
  <div
    v-if="chat.languageSelected"
    class="px-3 py-2 flex flex-wrap gap-2 bg-white border-t border-gray-100 justify-center"
  >
    <button
      v-for="s in suggestions"
      :key="s.text"
      :disabled="chat.isLoading"
      class="suggest cursor-pointer px-3 py-1.5 rounded-full border border-primary font-semibold text-primary text-xs relative overflow-hidden transition-all duration-300 hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
import { useI18n } from "vue-i18n";

const chat = useChatStore();
const { t } = useI18n();

const suggestions = computed(() => {
  // Always show Default Main Menu mapped from constant
  return SUGGESTIONS.map(s => ({
    text: t(s.text), // Translate using the key provided in constant
    icon: s.icon,
    key: s.text // Keeps the original key (e.g. 'suggestion_query') for logic
  }));
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
  const key = item.key; 

  if (key === 'suggestion_complaint') {
    window.open("https://www.goeic.gov.eg/ar/complaints-and-suggestions", "_blank");
    return;
  }

  if (key === 'suggestion_query') {
    window.open("https://www.goeic.gov.eg/ar/ask-us", "_blank");
    return;
  }

  if (key === 'suggestion_complaintStatus') {
    chat.messages.push({
      from: "bot",
      complaintForm: true,
      timestamp: Date.now(),
    });
    await scrollToBottomLocal();
    return;
  }

  if (key === 'suggestion_inquiry') {
    chat.messages.push({
      from: "bot",
      inquiryForm: true,
      timestamp: Date.now(),
    });
    await scrollToBottomLocal();
    return;
  }

  if (key === 'suggestion_currency') {
    window.open("https://www.cbe.org.eg/ar/economic-research/statistics/exchange-rates", "_blank");
    return;
  }

  if (key === 'suggestion_contactUs') {
    chat.messages.push({
      from: "user",
      text: text,
      timestamp: Date.now(),
    });

    chat.messages.push({
      from: "bot",
      text: `${t('contactIntro')}\n\n**${t('hotlineLabel')}** [${ORG_INFO.HOTLINE}](tel:${ORG_INFO.HOTLINE})\n**${t('phoneLabel')}** [${ORG_INFO.PHONE}](tel:${ORG_INFO.PHONE})`,
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
