<template>
  <main
    id="chatMessages"
    role="log"
    aria-live="polite"
    aria-atomic="false"
    class="absolute inset-0 overflow-y-auto p-5 bg-transparent z-10"
  >
    <div class="space-y-4">
      <ChatWelcome v-if="!chat.messages.length || !chat.languageSelected" />

      <div
        v-if="chat.languageSelected"
        v-for="(msg, index) in chat.messages"
        :key="msg.timestamp || index"
        class="flex items-start gap-3 relative z-10"
        :class="msg.from === 'user' ? 'justify-end' : ''"
      >
        <template v-if="msg.from === 'bot' && !msg.loading">
          <img
            class="w-10 h-10 rounded-full shrink-0 bg-cover bg-center border border-primary/30 shadow-sm"
            src="../assets/logo2.png"
            alt="صورة البوت"
            aria-hidden="true"
          />

          <div
            role="article"
            class="message-bubble from-bot bg-gradient-to-br from-primary-light to-primary-light border border-primary/20 text-gray-800 rounded-2xl px-3 py-3 shadow max-w-[80%] break-words whitespace-pre-line"
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
                    class="inline-flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-full shadow hover:shadow-md"
                  >
                    <i class="fa-solid fa-file-pdf"></i>
                    {{ msg.downloadText || "تحميل CV" }}
                  </a>
                </div>
              </div>
            </template>

            <template v-else-if="msg.links && msg.links.length > 0">
              <div>
                <span>{{ msg.text }}</span>
                <div class="mt-2 flex flex-col gap-2">
                  <a
                    v-for="(linkObj, idx) in msg.links"
                    :key="idx"
                    :href="linkObj.url"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-2 text-primary-dark hover:text-primary underline transition-colors"
                  >
                    <i class="fa-solid fa-link text-sm"></i>
                    <span>{{ linkObj.label }}</span>
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
                class="text-primary-dark underline"
              >
                {{ chat.t.visitLink || "زور من هنا" }}
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
                  class="inline-flex items-center gap-2 text-primary-dark underline"
                >
                  لمزيد من الفروع
                </a>
              </div>
            </template>

            <template v-else-if="msg.branchInfo">
              <div class="w-full">
                <!-- HQ Section -->
                <div class="mb-4">
                  <h3
                    class="font-bold text-primary-dark mb-2 flex items-center gap-2"
                  >
                    <i class="fa-solid fa-building-columns"></i>
                    {{ msg.branchInfo.hqTitle }}
                  </h3>
                  <div
                    class="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm border border-primary/20 mb-2"
                  >
                    <iframe
                      :src="msg.branchInfo.hqMapUrl"
                      class="w-full h-full border-0"
                      allowfullscreen=""
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <p class="text-sm font-medium leading-relaxed">
                    <i class="fa-solid fa-location-dot text-primary ml-1"></i>
                    {{ msg.branchInfo.hqAddress }}
                  </p>
                </div>

                <div class="w-full h-px bg-primary/20 my-3"></div>

                <!-- Other Branches Section -->
                <div>
                  <h4 class="font-bold text-sm mb-2 opacity-90">
                    {{ msg.branchInfo.otherBranchesTitle }}
                  </h4>
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span
                      v-for="branch in msg.branchInfo.branchesList"
                      :key="branch"
                      class="px-2.5 py-1 bg-white border border-primary/30 rounded-lg text-xs text-primary-hover font-medium"
                    >
                      {{ branch }}
                    </span>
                  </div>
                  <a
                    :href="msg.branchInfo.moreDetailsLink"
                    target="_blank"
                    class="block text-xs text-center text-primary-dark hover:text-primary underline py-1"
                  >
                    {{ msg.branchInfo.moreDetails }}
                  </a>
                </div>
              </div>
            </template>

            <template v-else>
              <div
                class="contact-card"
                :dir="msg.language === 'ar' ? 'rtl' : 'ltr'"
                :style="{ textAlign: msg.language === 'ar' ? 'right' : 'left' }"
              >
                <ReadMoreHtml>
                  <div
                    class="markdown-body"
                    v-html="renderMarkdown(msg.text || msg.html)"
                  ></div>

                  <div
                    v-if="msg.sources && msg.sources.length"
                    class="mt-4 pt-3 border-t border-primary/20"
                  >
                    <div class="text-xs font-bold mb-2 opacity-80">
                      المصادر / Sources
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        v-for="(source, idx) in msg.sources"
                        :key="idx"
                        :href="source.url"
                        target="_blank"
                        rel="noopener"
                        class="p-2 bg-primary/10 text-primary-dark text-xs rounded-2xl border border-primary/30 hover:bg-primary/20 transition-all flex flex-col items-start gap-1 h-full text-right"
                      >
                        <div class="flex items-center gap-2 w-full">
                          <i class="fa-solid fa-link text-[10px] shrink-0"></i>
                          <span class="truncate font-bold">{{
                            source.title || source.url
                          }}</span>
                        </div>
                        <div v-if="source.snippet" class="text-[10px] opacity-80 line-clamp-2 w-full whitespace-normal">
                          {{ source.snippet }}
                        </div>
                      </a>
                    </div>
                  </div>
                </ReadMoreHtml>
              </div>
            </template>
          </div>
        </template>

        <template v-else-if="msg.from === 'user'">
          <div
            role="article"
            class="message-bubble from-user bg-gradient-to-br from-primary to-primary-dark text-white border border-white/30 rounded-2xl px-4 py-3 shadow max-w-[80%] break-words whitespace-pre-line"
          >
            <ReadMoreHtml>
              {{ msg.text }}
            </ReadMoreHtml>
          </div>

          <img
            class="w-10 h-10 rounded-full shrink-0 bg-cover bg-center border border-primary/30 shadow-sm"
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
          class="w-10 h-10 rounded-full shrink-0 bg-cover bg-center border border-primary/30 shadow-sm"
          src="../assets/logo2.png"
          alt="chatbot typing"
        />

        <div
          class="bg-gradient-to-br from-primary-light to-primary-light border border-primary/20 text-gray-800 rounded-2xl px-4 py-3 shadow flex gap-1"
        >
          <span class="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
          <span
            class="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"
          ></span>
          <span
            class="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"
          ></span>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { CHAT_CONFIG } from "../constants";
import ChatWelcome from "./ChatWelcome.vue";

import ReadMoreHtml from "./ReadMoreHtml.vue";
import { ref, watch, nextTick } from "vue";
import { useChatStore } from "../stores/chat";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// Open links in new tab
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrPush(["target", "_blank"]);
  tokens[idx].attrPush(["rel", "noopener noreferrer"]);
  tokens[idx].attrPush([
    "style",
    "color: var(--color-primary-dark); text-decoration: underline;",
  ]);
  return defaultRender(tokens, idx, options, env, self);
};

const chat = useChatStore();

const renderMarkdown = (content) => {
  if (!content) return "";
  return md.render(content);
};

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

  chat.inquireComplaint(complaintNumber.value, taxNumber.value);

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
