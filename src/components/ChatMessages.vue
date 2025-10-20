<template>
  <main
    id="chatMessages"
    role="log"
    aria-live="polite"
    aria-atomic="false"
    class="absolute inset-0 overflow-y-auto p-5 bg-transparent z-10"
  >
    <div class="space-y-4">
    <ChatWelcome v-if="!chat.messages.length" />

    <div
      v-else
      v-for="(msg, index) in chat.messages"
      :key="msg.timestamp || index"
      class="flex items-start gap-3 relative z-10"
      :class="msg.from === 'user' ? 'justify-end' : ''"
    >
      <template v-if="msg.from === 'bot'">
        <img
          class="w-10 h-10 rounded-full shrink-0 bg-cover bg-center border border-[#d2961e]/30 shadow-sm"
          src="../assets/logo2.png"
          alt="صورة البوت"
          aria-hidden="true"
        />
        <div
          role="article"
          class="message-bubble from-bot bg-gradient-to-br from-[#fff8e1] to-[#f4e6c2] border border-[#d2961e]/20 text-gray-800 rounded-2xl px-4 py-3 shadow max-w-[80%] break-words whitespace-pre-line"
        >
          <template v-if="msg.mapEmbed">
            <div class="mb-2">
              <div class="font-bold mb-1">العنوان الرئيسي</div>
              <div>المبنى الإلكتروني بميناء القاهرة الجوي أمام قرية البضائع</div>
            </div>
            <iframe
              :src="msg.mapEmbed"
              width="280"
              height="180"
              style="border:0;border-radius:12px;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            <div class="mt-2">
              <a :href="msg.mapLink" target="_blank" class="text-[#b07f14] underline">افتح في خرائط جوجل</a>
            </div>
          </template>
          <template v-else-if="msg.headImage || msg.headCv">
            <div class="text-center">
              <img :src="msg.headImage" alt="رئيس الهيئة" class="w-24 h-24 rounded-full object-cover border mx-auto" />
              <div class="mt-3 font-bold">{{ msg.text.split('\n')[0] }}</div>
              <div class="text-sm opacity-80">{{ msg.text.split('\n')[1] }}</div>
              <div v-if="msg.headBio" class="mt-2 text-sm leading-relaxed whitespace-pre-line">
                {{ msg.headBio }}
              </div>
              <div class="mt-3">
                <a :href="msg.headCv" download class="inline-flex items-center gap-2 bg-[#d2961e] text-white px-3 py-1.5 rounded-full shadow hover:shadow-md">
                  <i class="fa-solid fa-file-pdf"></i>
                  تحميل CV
                </a>
              </div>
            </div>
          </template>
          <template v-else-if="msg.link">
            <span>{{ msg.text }} </span>
            <a :href="msg.link" target="_blank" rel="noopener" class="text-[#b07f14] underline">زور من هنا</a>
          </template>
          <template v-else>
            <ReadMore :text="msg.text" :maxChars="220" />
          </template>
        </div>
      </template>

      <template v-else>
        <div
          role="article"
          class="message-bubble from-user bg-gradient-to-br from-[#d2961e] to-[#b07f14] text-white border border-white/30 rounded-2xl px-4 py-3 shadow max-w-[80%] break-words whitespace-pre-line"
        >
          <ReadMore :text="msg.text" :maxChars="220" />
        </div>
        <img
          class="w-10 h-10 rounded-full shrink-0 bg-cover bg-center border border-[#d2961e]/30 shadow-sm"
          src="../assets/user.webp"
          alt="صورة المستخدم"
          aria-hidden="true"
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
    </div>
  </main>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import { useChatStore } from "../stores/chat";
import { CHAT_CONFIG, BOT_RESPONSES, ORG_INFO } from "../constants";
import ChatWelcome from "./ChatWelcome.vue";
import ReadMore from "./ReadMore.vue";

const chat = useChatStore();
const isBotTyping = ref(false);
let botTypingTimeout = null;

const scrollToBottom = async () => {
    await nextTick();
    const chatContainer = document.getElementById("chatMessages");
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
      behavior: CHAT_CONFIG.SCROLL_BEHAVIOR,
    });
  }
};

watch(
  () => chat.messages.length,
  scrollToBottom
);

watch(
  () => chat.messages[chat.messages.length - 1],
  (lastMsg) => {
    if (lastMsg?.from === "user") {
      isBotTyping.value = true;
      const userText = (lastMsg.text || '').toLowerCase();

      botTypingTimeout = setTimeout(() => {
        isBotTyping.value = false;

        // Address query
        if (/(عنوان|العنوان|المقر|address)/.test(userText)) {
          const embed = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110438.27380289446!2d31.558433302734386!3d30.117202900000024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14581706bbb11871%3A0x4c1f90ec64e1da5c!2z2KfZhNmH2YrYptipINin2YTYudin2YXYqSDZhNmE2LHZgtin2KjYqSDYudmE2Ykg2KfZhNi12KfYr9ix2KfYqiDZiNin2YTZiNin2LHYr9in2Kog2KfZhNmF2YLYsSDYp9mE2LHYptmK2LPZiiDYqNmC2LHZitipINin2YTYqNi22KfYpti5IC0g2YXYt9in2LEg2KfZhNmC2KfZh9ix2Kk!5e0!3m2!1sar!2seg!4v1760975416123!5m2!1sar!2seg";
          const details = `المبنى الإلكتروني بميناء القاهرة الجوي أمام قرية البضائع\nالهاتف: ${ORG_INFO.PHONE} — الخط الساخن: ${ORG_INFO.HOTLINE}`;
          chat.messages.push({ from: "bot", text: details, mapEmbed: embed, mapLink: embed.replace('/embed?', '?'), timestamp: Date.now() });
          chat.messages.push({ from: "bot", text: `لمعرفة المزيد من أفرع الهيئة`, link: 'https://www.goeic.gov.eg/ar/about-us/contact-us', timestamp: Date.now() });
          return;
        }

        // Head of organization query
          if (/(رئيس|رئيس الهيئة|head)/.test(userText)) {
          // بطاقة تعريف رئيس الهيئة: صورة + اسم + منصب + زر تحميل CV + نبذة مختصرة
          chat.messages.push({
            from: "bot",
            text: `${ORG_INFO.HEAD.NAME}\n${ORG_INFO.HEAD.TITLE}`,
            headImage: ORG_INFO.HEAD.IMAGE,
            headCv: ORG_INFO.HEAD.CV_PATH || ORG_INFO.HEAD.CV_URL,
              headBio: ORG_INFO.HEAD.BIO_SHORT || '',
            timestamp: Date.now(),
          });
          return;
        }

        // Default auto-reply
        chat.messages.push({
          from: "bot",
          text: BOT_RESPONSES.AUTO_REPLY,
          timestamp: Date.now()
        });
      }, CHAT_CONFIG.BOT_RESPONSE_DELAY);
    }
  },
  { deep: true }
);

// Cleanup timeout on component unmount
onBeforeUnmount(() => {
  if (botTypingTimeout) {
    clearTimeout(botTypingTimeout);
  }
});
</script>
