<template>
  <div
    class="px-3 py-2 flex flex-wrap gap-2 bg-white border-t border-gray-100 justify-center"
  >
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
import { ORG_INFO, SUGGESTIONS } from "../constants";
import { nextTick } from "vue";
import { useChatStore } from "../stores/chat";

const chat = useChatStore();
const suggestions = SUGGESTIONS;

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

const handleSuggestion = async (text) => {

  if (text === "شكوى") {
    window.open("https://www.goeic.gov.eg/ar/complaints-and-suggestions", "_blank");
    return;
  }

  
  if (text === "استفسار") {
    window.open("https://www.goeic.gov.eg/ar/ask-us", "_blank");
    return;
  }

  if (text === "استعلام عن شكوى") {
    chat.messages.push({
      from: "bot",
      complaintForm: true,
      timestamp: Date.now(),
    });
    await scrollToBottomLocal();
    return;
  }

 
  if (text === "اتصل بنا") {
    chat.messages.push({
      from: "user",
      text: "اتصل بنا",
      timestamp: Date.now(),
    });

    chat.messages.push({
      from: "bot",
      html: ` <div style="padding: 4px 2px;">
        <div style="font-weight: 600; margin-bottom: 10px; font-size: 15px;">
          يمكنك الاتصال:
        </div>

        <div style="margin-bottom: 12px;">
          <span style="color:#333;">الخط الساخن:</span>
          <a href="tel:${ORG_INFO.HOTLINE}" style="color:#b07f14; font-weight:bold; text-decoration:underline; margin-right:6px;">
            ${ORG_INFO.HOTLINE}
          </a>
        </div>

        <div>
          <span style="color:#333;">رقم الهاتف:</span>
          <a href="tel:${ORG_INFO.PHONE}" style="color:#b07f14; font-weight:bold; text-decoration:underline; margin-right:6px;">
            ${ORG_INFO.PHONE}
          </a>
        </div>
      </div>
      `,
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
