import {
  CHAT_CONFIG,
  ORG_INFO,
  MAIN_BRANCH,
  BRANCH_KEYWORDS,
  HEAD_KEYWORDS,
  COMPLAINT_KEYWORDS,
} from "../constants";

import { defineStore } from "pinia";
import { ref, nextTick } from "vue";

const API_URL = "https://r6suex81bgxkht-8000.proxy.runpod.net/api/ask";

function extractFirstUrl(text) {
  const rx = /(https?:\/\/[^\s]+)/i;
  const m = text.match(rx);
  return m ? m[0] : null;
}

export const useChatStore = defineStore("chat", () => {
  const isOpen = ref(false);
  const messages = ref([]);
  const isVoiceCallOpen = ref(false);

  const toggleChat = () => (isOpen.value = !isOpen.value);
  const openChat = () => (isOpen.value = true);
  const closeChat = () => (isOpen.value = false);

  const clearMessages = () => {
    messages.value = [];
  };

  const openVoiceCall = () => (isVoiceCallOpen.value = true);
  const closeVoiceCall = () => (isVoiceCallOpen.value = false);

  const addUserMessage = (text) => {
    messages.value.push({
      from: "user",
      text,
      timestamp: Date.now(),
    });
  };

  const addBotMessage = (payload) => {
    messages.value.push(
      Object.assign({ from: "bot", text: "", timestamp: Date.now() }, payload)
    );
  };

const checkLocalAnswer = (text) => {
  const lower = text.toLowerCase();
if (lower.includes("استفسار شكوى:") || lower.includes("رقم الشكوى:")) {
  return null;
}

  if (BRANCH_KEYWORDS.some((word) => lower.includes(word))) {
    return {
      branchCard: true,
      branchName: MAIN_BRANCH.NAME,
      branchTitle: MAIN_BRANCH.TITLE,
      branchAddress: MAIN_BRANCH.ADDRESS,
      branchMap: MAIN_BRANCH.MAP,
      branchLink: MAIN_BRANCH.LINK,
    };
  }

  if (HEAD_KEYWORDS.some((word) => lower.includes(word))) {
    const head = ORG_INFO.HEAD || {};
    const text = `${head.NAME || ""}\n${head.TITLE || ""}`;

    return {
      headImage: head.IMAGE,
      headCv: head.CV_URL || head.CV_PATH,
      headBio: head.BIO_SHORT,
      text,
    };
  }

  // ⭐ الكلام المهم هنا
  if (COMPLAINT_KEYWORDS.some((word) => lower.includes(word))) {
    return {
      complaintForm: true,
    };
  }

  return null;
};


  const sendMessage = async (userText) => {
    if (!userText || !userText.toString().trim()) return;

    const text = userText.toString().trim();

    addUserMessage(text);

    const local = checkLocalAnswer(text);
    if (local) {
      addBotMessage(local);
      return;
    }

    const typingIndex =
      messages.value.push({
        from: "bot",
        loading: true,
        timestamp: Date.now(),
      }) - 1;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: text }),
      });

      // remove loader
      if (messages.value[typingIndex]) {
        messages.value.splice(typingIndex, 1);
      }

      if (!res.ok) {
        addBotMessage({
          text: "لا يوجد اتصال بالخادم حاليًا، برجاء المحاولة لاحقًا.",
          error: true,
        });

        return;
      }

      const data = await res.json();

      // log entire response
      console.log("API RESPONSE:", data);

      const answer = data.answer || "لا يوجد رد.";

      // detect URL
      const firstUrl = extractFirstUrl(answer);

      if (firstUrl) {
        addBotMessage({
          text: answer.replace(firstUrl, "").trim() || "رابط:",
          link: firstUrl,
        });
      } else {
        addBotMessage({ text: answer });
      }
    } catch (err) {
      if (messages.value[typingIndex]) {
        messages.value.splice(typingIndex, 1);
      }

      console.error("sendMessage error:", err);

      addBotMessage({
        text: "يتعذّر في الوقت الحالي إتمام الاتصال بالخادم.يرجى من سيادتكم إعادة المحاولة لاحقًا.",
        error: true,
        timestamp: Date.now(),
      });
    }
  };

  return {
    isOpen,
    messages,
    isVoiceCallOpen,
    toggleChat,
    closeChat,
    openChat,
    sendMessage,
    clearMessages,
    openVoiceCall,
    closeVoiceCall,
  };
});
