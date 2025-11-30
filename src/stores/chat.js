import { CHAT_CONFIG, ORG_INFO, HEAD_KEYWORDS } from "../constants";

import { defineStore } from "pinia";
import { ref, nextTick } from "vue";

const API_URL = "https://r6suex81bgxkht-8000.proxy.runpod.net/api/ask";

function extractAllUrls(text) {
  const rx = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(rx);

  if (!matches || matches.length === 0) {
    return [];
  }

  return matches.map((url, index) => {
    let label = `زور من هنا ${index + 1}`;

    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      const pathParts = pathname.split("/").filter((p) => p && p.length > 0);
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];

        const cleanPart = decodeURIComponent(
          lastPart.replace(/\.(html|php|aspx|pdf|doc|docx)$/i, "")
        );

        if (cleanPart.length > 2 && !/^\d+$/.test(cleanPart)) {
          label = cleanPart.replace(/[-_]/g, " ");
        } else if (urlObj.hostname) {
          label = urlObj.hostname.replace("www.", "");
        }
      } else if (urlObj.hostname) {
        // Use domain name if no path
        label = urlObj.hostname.replace("www.", "");
      }
    } catch (e) {
      // If URL parsing fails, use default label
    }

    return { url, label };
  });
}

export const useChatStore = defineStore("chat", () => {
  const isOpen = ref(false);
  const messages = ref([]);
  const isVoiceCallOpen = ref(false);

  const sessionId = ref(null);

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("goeic_session_id");
    if (stored) {
      sessionId.value = stored;
      console.log("Loaded existing session:", stored);
    }
  }

  const toggleChat = () => (isOpen.value = !isOpen.value);
  const openChat = () => (isOpen.value = true);
  const closeChat = () => (isOpen.value = false);

  const clearMessages = () => {
    messages.value = [];
  };

  const clearSession = () => {
    sessionId.value = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("goeic_session_id");
    }
    clearMessages();
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
      const requestBody = {
        question: text,
        language: "ar",
      };

      if (sessionId.value) {
        requestBody.session_id = sessionId.value;
      }

      console.log("Sending request with session:", requestBody.session_id);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

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

      console.log("API RESPONSE:", data);

      if (data.session_id && data.session_id !== sessionId.value) {
        sessionId.value = data.session_id;
        if (typeof window !== "undefined") {
          localStorage.setItem("goeic_session_id", data.session_id);
        }
      }

      const answer = data.answer || "لا يوجد رد.";

      const urls = extractAllUrls(answer);

      if (urls.length > 0) {
        let cleanText = answer;
        urls.forEach(({ url }) => {
          cleanText = cleanText.replace(url, "");
        });
        cleanText = cleanText.trim() || "روابط:";

        addBotMessage({
          text: cleanText,
          links: urls,
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
    sessionId,
    toggleChat,
    closeChat,
    openChat,
    sendMessage,
    clearMessages,
    clearSession,
    openVoiceCall,
    closeVoiceCall,
  };
});
