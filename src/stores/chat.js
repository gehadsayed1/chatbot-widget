import { CHAT_CONFIG, ORG_INFO, HEAD_KEYWORDS } from "../constants";

import { defineStore } from "pinia";
import { ref, nextTick } from "vue";

const API_URL = "https://goeic.stadiaholding.com/api/chat";

function extractAllUrls(text) {
  const rx = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(rx);

  if (!matches || matches.length === 0) {
    return [];
  }

  return matches.map((url, index) => ({ url, label: url }));
}

/* ---------------------- COOKIE HELPERS ---------------------- */
function setCookie(name, value, hours = 24) {
  const maxAge = hours * 60 * 60;
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; max-age=0; path=/`;
}
/* ------------------------------------------------------------- */

export const useChatStore = defineStore("chat", () => {
  const isOpen = ref(false);
  const messages = ref([]);
  const isVoiceCallOpen = ref(false);

  const sessionId = ref(null);

  // ⭐ Load session ID from Cookie instead of localStorage
  if (typeof window !== "undefined") {
    const stored = getCookie("goeic_session_id");
    if (stored) {
      sessionId.value = stored;
      console.log("Loaded existing session from cookie:", stored);
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
    deleteCookie("goeic_session_id");
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

      console.log("Sending with session:", requestBody.session_id);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      // ⭐ Save session ID into cookie (24 hours expiry)
      if (data.session_id && data.session_id !== sessionId.value) {
        sessionId.value = data.session_id;
        setCookie("goeic_session_id", data.session_id, 24);
      }

      const answer = data.answer || "لا يوجد رد.";
      const urls = extractAllUrls(answer);

      // ⭐ Replace URLs inside text without removing them
      let finalText = answer.replace(/\n/g, "<br>");
      urls.forEach(({ url }) => {
        finalText = finalText.replace(
          url,
          `<a href="${url}" target="_blank" rel="noopener" class="text-[#b07f14] underline">${url}</a>`
        );
      });

      addBotMessage({
        html: finalText,
        language: data.language,
        sources: data.sources,
      });
    } catch (err) {
      if (messages.value[typingIndex]) messages.value.splice(typingIndex, 1);

      console.error("sendMessage error:", err);

      addBotMessage({
        text: "يتعذّر في الوقت الحالي إتمام الاتصال بالخادم. يرجى إعادة المحاولة لاحقًا.",
        error: true,
      });
    }
  };

  const inquireComplaint = async (complaintNum, taxNum) => {
    // Add loading indicator
    const typingIndex =
      messages.value.push({
        from: "bot",
        loading: true,
        timestamp: Date.now(),
      }) - 1;

    try {
      const url = `https://goeic.stadiaholding.com/api/callcenter/inquiry/${complaintNum}/${taxNum}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (messages.value[typingIndex]) {
        messages.value.splice(typingIndex, 1);
      }

      if (!res.ok) {
        addBotMessage({
          text: "حدث خطأ أثناء الاستعلام، يرجى التأكد من الانترنت والمحاولة مرة أخرى.",
          error: true,
        });
        return;
      }

      const data = await res.json();
      console.log("Inquiry Response:", data);

      if (Array.isArray(data) && data.length > 0) {
        addBotMessage({ inquiryData: data });
      } else {
        addBotMessage({
          text: "لم يتم العثور على بيانات لهذا الرقم.",
          error: true,
        });
      }
    } catch (err) {
      if (messages.value[typingIndex]) messages.value.splice(typingIndex, 1);
      console.error("inquireComplaint error:", err);
      addBotMessage({
        text: "تعذر الاتصال بالخادم، يرجى المحاولة لاحقًا.",
        error: true,
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
    inquireComplaint,
    clearMessages,
    clearSession,
    openVoiceCall,
    closeVoiceCall,
  };
});
