<template>
  <div class="flex items-start gap-3 relative z-10 w-full">
    <img
      class="w-10 h-10 rounded-full shrink-0 bg-cover bg-center border border-primary/30 shadow-sm"
      src="../../assets/logo2.png"
      alt="صورة البوت"
      aria-hidden="true"
    />

    <div class="flex flex-col gap-2 max-w-[80%]">
      <div
        role="article"
        class="message-bubble from-bot bg-gradient-to-br from-primary-light to-primary-light border border-primary/20 text-gray-800 rounded-2xl px-3 py-3 shadow break-words whitespace-pre-line"
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
            {{ t('visitLink') }}
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
              {{ t('moreBranches') }}
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

        <template v-else-if="msg.complaintForm">
           <ComplaintForm :loading="msg.loading" />
        </template>

        <template v-else-if="msg.inquiryData">
           <div class="space-y-4 w-full"> 
             <div v-for="(item, i) in msg.inquiryData" :key="i">
                <ComplaintResult :data="item" />
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
            </ReadMoreHtml>

            <div
              v-if="msg.sources && msg.sources.length"
              class="mt-4 pt-3 border-t border-primary/20"
            >
              <div class="text-xs font-bold mb-2 opacity-80">
                {{ t('sources') }}
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 transition-all duration-300">
                <a
                  v-for="(source, idx) in (expanded ? msg.sources : msg.sources.slice(0, 2))"
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
              
              <div v-if="msg.sources.length > 2" class="mt-2 text-center">
                <button 
                  @click="toggleSources" 
                  class="text-xs cursor-pointer hover:text-primary transition-colors focus:outline-none flex items-center justify-center gap-1 mx-auto bg-transparent border-none shadow-none"
                >
                  <span>{{ expanded ? t('showLess') : t('showMore') }}</span>
                  <i :class="expanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Suggestions -->
      <div v-if="msg.suggestions && msg.suggestions.length > 0" class="flex flex-wrap items-center justify-center gap-2 p-2 mt-1">
        <button
          v-for="(suggestion, sIdx) in msg.suggestions"
          :key="sIdx"
          @click="chat.sendMessage(suggestion)"
          :disabled="chat.isLoading"
          class="px-2 py-1 text-xs font-bold text-primary border border-primary/30 rounded-full hover:bg-primary hover:text-white transition-all bg-white/50 backdrop-blur-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useChatStore } from "../../stores/chat";
import ReadMoreHtml from "../ReadMoreHtml.vue";
import MarkdownIt from "markdown-it";
import ComplaintForm from "./ComplaintForm.vue";
import ComplaintResult from "./ComplaintResult.vue";

defineProps({
  msg: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
const chat = useChatStore();

// Markdown Setup
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

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

const renderMarkdown = (content) => {
  if (!content) return "";
  return md.render(content);
};

// Sources Logic
const expanded = ref(false);
const toggleSources = () => {
  expanded.value = !expanded.value;
};
</script>

<style scoped>
.contact-card {
  width: 100%;
  display: block;
  text-align: right;
  direction: rtl;
  font-size: 15px;
  line-height: 1.6; /* Increased for better readability */
  color: #444;
  white-space: normal !important;
}

/* Ensure LTR messages also have good spacing */
.contact-card[dir="ltr"] {
  text-align: left;
  direction: ltr;
}

/* Add spacing between paragraphs if they exist */
.contact-card p {
  margin-bottom: 0.5rem;
}
</style>
