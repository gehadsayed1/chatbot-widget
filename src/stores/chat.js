import {
  CHAT_CONFIG,
  ORG_INFO,
  HEAD_KEYWORDS,
  BRANCH_KEYWORDS,
} from "../constants";
import notificationSound from "../assets/mixkit-confirmation-tone-2867.wav";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { translations } from "../i18n/translations";

const API_BASE_URL = "http://41.155.190.166:8000";

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
  const isOpen = ref(true);
  const messages = ref([]);
  const isVoiceCallOpen = ref(false);
  const sessionId = ref(null);
  const currentLanguage = ref("ar");
  const languageSelected = ref(false);

  const t = computed(
    () => translations[currentLanguage.value] || translations["ar"]
  );
  const direction = computed(() => t.value.direction);

  if (typeof window !== "undefined") {
    const storedSession = getCookie("goeic_session_id");
    if (storedSession) {
      sessionId.value = storedSession;
    }
    const storedLang = getCookie("goeic_language");
    if (storedLang) {
      currentLanguage.value = storedLang;
      languageSelected.value = true;
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
    languageSelected.value = false;
    deleteCookie("goeic_session_id");
    deleteCookie("goeic_language");
    clearMessages();
  };

  const setLanguage = (lang) => {
    currentLanguage.value = lang;
    languageSelected.value = true;
    setCookie("goeic_language", lang, 24 * 30); // Store for 30 days
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

  function addBotMessage(response = {}) {
    try {
      console.log("Initializing audio with:", notificationSound);
      const sound = new Audio(notificationSound);
      sound.volume = 0.5;
      const playPromise = sound.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log("Audio played successfully."))
          .catch((error) => console.warn("Audio playback prevented:", error));
      }
    } catch (err) {
      console.error("Error initializing audio:", err);
    }

    messages.value.push({
      from: "bot",
      text: response.text || "",
      suggestions: response.suggestions || [],
      timestamp: Date.now(),
      ...response,
    });
  }

  const getChatHistory = () => {
    return messages.value
      .filter((m) => !m.loading && !m.error)
      .map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text || m.html || "",
      }));
  };

  const sendMessage = async (userText) => {
    if (!userText || !userText.toString().trim()) return;

    const text = userText.toString().trim();
    console.log("Sending message:", text);
    addUserMessage(text);

    // Check for Head Keywords locally
    const isHeadInquiry = HEAD_KEYWORDS.some((k) =>
      text.toLowerCase().includes(k.toLowerCase())
    );

    if (isHeadInquiry) {
      addBotMessage({
        text: `${t.value.headInfo.name}\n${t.value.headInfo.title}`,
        headImage: t.value.headInfo.imageUrl,
        headBio: t.value.headInfo.bio,
        headCv: t.value.headInfo.cvUrl,
        downloadText: t.value.headInfo.downloadCv,
      });
      return;
    }

    // Mock Response for Testing
    if (text.toLowerCase() === "mock") {
      setTimeout(() => {
        addBotMessage({
          text: "• المقر الرئيسي لهيئة الرقابة على الصادرات والواردات يقع في قرية البضائع بمطار القاهرة، والمقر الإداري في 1 شارع معروف، رمسيس، وسط القاهرة.\n\n• يمكن التواصل مع الهيئة عبر الخط الساخن 19591 أو من خلال الموقع الإلكتروني www.goeic.gov.eg.\n\n• ساعات العمل الرسمية للهيئة هي من الأحد إلى الخميس، من الساعة 8:30 صباحاً حتى 3:30 عصراً.\n\n• البند الجمركي 3204150010 يتعلق بأصباغ الراقود المستخدمة في الصناعات النسجية، ويخضع لشروط استيرادية معينة.\n\n• لا يتم الإفراج عن الكيماويات الصناعية السامة وغير السامة الواردة للمصانع أو الاتجار إلا بشروط محددة.\n\n• هناك قائمة من السلع التي يشترط عند تصديرها سداد كامل قيمتها مقومة بالعملات الأجنبية القابلة للتحويل عن طريق أحد البنوك المعتمدة لدى البنك المركزي المصري.",
          sources: [
            {
              title: "Official Contact & Hours",
              url: "https://www.goeic.gov.eg/ar/about-us/callUs",
              type: "link",
              snippet:
                "يمكنكم التواصل معنا عبر الخط الساخن 19591 طوال أيام الأسبوع...",
            },
            {
              title: "بند جمركي 3204150010",
              url: "hscode_3204150010",
              type: "doc",
              snippet: "تفاصيل البند الجمركي والتعريفة الجمركية المرتبطة به...",
            },
            {
              title: "قاموس المصطلحات",
              url: "https://www.goeic.gov.eg/ar/glossary?page=154",
              type: "link",
              snippet:
                "تعريف المصطلحات التجارية والجمركية المستخدمة في الهيئة...",
            },
            {
              title: "قاموس المصطلحات",
              url: "https://www.goeic.gov.eg/ar/glossary?page=153",
              type: "link",
            },
            {
              title:
                "منشور تصديري رقم 16 لسنه 2025 بشأن تطبيق قرار رقم 273 لسنه 2025",
              url: "https://www.goeic.gov.eg/upload/online/2025/07/documents/files/ar/1735.pdf",
              type: "link",
            },
            {
              title:
                "قرار وزير التجارة والصناعه رقم 2 لسنة 2013 في شأن تعديل القرار 983 لسنة 2012 بشان إختبارات الجلود",
              url: "https://www.goeic.gov.eg/upload/online/2024/03/documents/files/ar/1172.pdf",
              type: "link",
            },
          ],
          suggestions: [
            "ما هي الشروط الاستيرادية للبند الجمركي 3204150010؟",
            "كيف يمكن التواصل مع هيئة الرقابة على الصادرات والواردات؟",
            "ما هي ساعات العمل الرسمية للهيئة؟",
          ],
        });
      }, 500);
      return;
    }

    // Check for Branches/HQ Keywords locally (Specific Phrases Only)
    if (BRANCH_KEYWORDS.some((k) => text.toLowerCase().includes(k))) {
      addBotMessage({
        branchInfo: t.value.branchInfo,
      });
      return;
    }

    const typingIndex =
      messages.value.push({
        from: "bot",
        loading: true,
        timestamp: Date.now(),
      }) - 1;

    try {
      const payload = {
        question: text,
        language: currentLanguage.value,
        history: getChatHistory().slice(0, -1), // History excluding the current message
      };
      console.log("Sending API payload:", payload);

      const response = await axios.post(`${API_BASE_URL}/api/chat`, payload);
      const data = response.data;

      if (messages.value[typingIndex]) {
        messages.value.splice(typingIndex, 1);
      }

      addBotMessage({
        text: data.answer,
        sources: data.sources,
        suggestions: data.suggestions,
        language: currentLanguage.value,
      });
    } catch (error) {
      if (messages.value[typingIndex]) messages.value.splice(typingIndex, 1);
      console.error("Chat Error:", error);
      addBotMessage({
        text: "System is busy, please try again.",
        error: true,
      });
    }
  };

  const sendVoiceMessage = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("language", currentLanguage.value);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/voice`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;

      if (data.question) {
        addUserMessage(data.question);
      }

      addBotMessage({
        text: data.answer,
        sources: data.sources,
        suggestions: data.suggestions,
        language: currentLanguage.value,
        audio: data.audio, // Base64 audio
      });

      return data;
    } catch (error) {
      console.error("Voice Error:", error);
      addBotMessage({
        text: "Voice processing failed, please try again.",
        error: true,
      });
      return null;
    }
  };

  const inquireComplaint = async (complaintNum, taxNum) => {
    const typingIndex =
      messages.value.push({
        from: "bot",
        loading: true,
        timestamp: Date.now(),
      }) - 1;

    try {
      const url = `${API_BASE_URL}/api/callcenter/inquiry/${complaintNum}/${taxNum}`;
      const res = await axios.get(url);

      if (messages.value[typingIndex]) {
        messages.value.splice(typingIndex, 1);
      }

      if (Array.isArray(res.data) && res.data.length > 0) {
        addBotMessage({ inquiryData: res.data });
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
    currentLanguage,
    languageSelected,
    toggleChat,
    closeChat,
    openChat,
    sendMessage,
    sendVoiceMessage,
    setLanguage,
    inquireComplaint,
    clearMessages,
    clearSession,
    openVoiceCall,
    closeVoiceCall,
    t,
    direction,
  };
});
