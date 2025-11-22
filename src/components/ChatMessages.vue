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
        <template v-if="msg.from === 'bot' && !msg.loading">
          <img
            class="w-10 h-10 rounded-full shrink-0 bg-cover bg-center border border-[#d2961e]/30 shadow-sm"
            src="../assets/logo2.png"
            alt="صورة البوت"
            aria-hidden="true"
          />

          <div
            role="article"
            class="message-bubble from-bot bg-gradient-to-br from-[#fff8e1] to-[#f4e6c2] border border-[#d2961e]/20 text-gray-800 rounded-2xl px-3 py-3 shadow max-w-[80%] break-words whitespace-pre-line"
          >
            <template v-if="msg.error">
              <div class="text-red-600 font-bold text-sm">
                {{ msg.text }}
              </div>
            </template>

            <template v-else-if="msg.headImage || msg.headCv">
              <div class="text-center">
                <img
                  :src="msg.headImage"
                  alt="رئيس الهيئة"
                  class="w-24 h-24 rounded-full object-cover border mx-auto"
                />

                <div class="mt-3 font-bold">{{ msg.text.split("\n")[0] }}</div>
                <div class="text-sm opacity-80">
                  {{ msg.text.split("\n")[1] }}
                </div>

                <div
                  v-if="msg.headBio"
                  class="mt-2 text-sm leading-relaxed whitespace-pre-line"
                >
                  {{ msg.headBio }}
                </div>

                <div class="mt-3">
                  <a
                    href="/1528.pdf"
                    download="CV-رئيس-الهيئة.pdf"
                    class="inline-flex items-center gap-2 bg-[#d2961e] text-white px-3 py-1.5 rounded-full shadow hover:shadow-md"
                  >
                    <i class="fa-solid fa-file-pdf"></i>
                    تحميل CV
                  </a>
                </div>
              </div>
            </template>

            <template v-else-if="msg.link">
              <span>{{ msg.text }} </span>
              <a
                :href="msg.link"
                target="_blank"
                rel="noopener"
                class="text-[#b07f14] underline"
              >
                زور من هنا
              </a>
            </template>

            <template v-else-if="msg.branchCard">
              <div>
                <div class="text-lg font-bold mb-2">{{ msg.branchName }}</div>
                <div class="text-sm opacity-80 mb-3 whitespace-pre-line">
                  {{ msg.branchAddress }}
                </div>

                <iframe
                  :src="msg.branchMap"
                  width="290"
                  height="180"
                  allowfullscreen=""
                  loading="lazy"
                  class="mx-auto mb-3"
                ></iframe>

                <a
                  :href="msg.branchLink"
                  target="_blank"
                  class="inline-flex items-center gap-2 text-[#b07f14] underline"
                >
                  لمزيد من الفروع
                </a>
              </div>
            </template>

            <template v-else-if="msg.html">
              <div class="contact-card" v-html="msg.html"></div>
            </template>

            <template v-else-if="msg.complaintForm">
              <div class="space-y-3 w-full max-w-[260px]">
                <div class="font-semibold text-base text-gray-800">
                  من فضلك أدخل البيانات التالية:
                </div>

                <input
                  v-model="complaintNumber"
                  type="text"
                  placeholder="رقم الشكوى"
                  class="border border-[#d2961e]/40 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#d2961e]"
                />

                <input
                  v-model="taxNumber"
                  type="text"
                  placeholder="الرقم الضريبي"
                  class="border border-[#d2961e]/40 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#d2961e]"
                />

                <button
                  @click="submitComplaint"
                  class="bg-[#d2961e] text-white w-full py-2 rounded-xl font-semibold shadow hover:opacity-90 transition"
                >
                  إرسال
                </button>
              </div>
            </template>

            <template v-else>
              <div dir="auto" class="message-text">
                <ReadMore :text="msg.text" :maxChars="220" />
              </div>
            </template>
          </div>
        </template>

        <template v-else-if="msg.from === 'user'">
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

      <!-- Loader -->
      <div
        v-if="chat.messages.some((m) => m.loading)"
        class="flex items-start gap-3 relative z-10"
      >
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
import { CHAT_CONFIG } from "../constants";
import ChatWelcome from "./ChatWelcome.vue";
import ReadMore from "./ReadMore.vue";
import { ref, watch, nextTick } from "vue";
import { useChatStore } from "../stores/chat";

const chat = useChatStore();

const complaintNumber = ref("");
const taxNumber = ref("");

const submitComplaint = () => {
  if (!complaintNumber.value || !taxNumber.value) {
    chat.messages.push({
      from: "bot",
      error: true,
      text: "برجاء إدخال جميع البيانات المطلوبة.",
      timestamp: Date.now(),
    });
    return;
  }

  const text = `رقم الشكوى: ${complaintNumber.value} - الرقم الضريبي: ${taxNumber.value}`;

  chat.sendMessage(text);

  complaintNumber.value = "";
  taxNumber.value = "";
};

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

watch(() => chat.messages.length, scrollToBottom);
</script>

<style scoped>
.contact-card {
  width: 100%;
  display: block;
  text-align: right;
  direction: rtl;
  font-size: 15px;
  line-height: 1.2;
  color: #444;
  white-space: normal !important;
}

.message-text {
  white-space: pre-line;
  line-height: 1.7;
  direction: auto;
  unicode-bidi: plaintext;
  text-align: start;
  font-size: 15px;
}
</style>
