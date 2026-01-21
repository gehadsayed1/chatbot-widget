import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useChatUiStore } from "./chatUi";
import { useChatSessionStore } from "./chatSession";
import { useChatMessagesStore } from "./chatMessages";
import { API_BASE_URL, COMPLAINT_API_URL } from "../constants/apiConfig";
import { HEAD_KEYWORDS, BRANCH_KEYWORDS } from "../constants";
import i18n from "../i18n";

export const useChatActionsStore = defineStore("chat-actions", () => {
  const ui = useChatUiStore();
  const session = useChatSessionStore();
  const messagesStore = useChatMessagesStore();

  /* State for controlling requests */
  const abortController = ref(null);
  const isLoading = ref(false);

  const clearSession = () => {
    session.clearSessionState();
    messagesStore.clearMessages();
    // Clear persistence handled by store logic
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("goeic_chat_messages");
    }
  };

  const stopGeneration = () => {
    if (abortController.value) {
      abortController.value.abort();
      abortController.value = null;
    }

    // Remove the loading message if it exists
    const lastMsg = messagesStore.messages[messagesStore.messages.length - 1];
    if (lastMsg && lastMsg.loading) {
      messagesStore.messages.pop();
    }

    isLoading.value = false;
  };

  const sendMessage = async (userText) => {
    if (!userText || !userText.toString().trim()) return;

    // Abort previous request if active
    if (isLoading.value) {
      stopGeneration();
    }

    const text = userText.toString().trim();
    messagesStore.addUserMessage(text);

    // Check for Head Keywords locally
    const isHeadInquiry = HEAD_KEYWORDS.some((k) =>
      text.toLowerCase().includes(k.toLowerCase()),
    );

    if (isHeadInquiry) {
      const headInfo = i18n.global.tm("headInfo");
      messagesStore.addBotMessage({
        text: `${headInfo.name}\n${headInfo.title}`,
        headImage: headInfo.imageUrl,
        headBio: headInfo.bio,
        headCv: headInfo.cvUrl,
        downloadText: headInfo.downloadCv,
      });
      return;
    }

    // Check for Branches/HQ Keywords locally
    if (BRANCH_KEYWORDS.some((k) => text.toLowerCase().includes(k))) {
      messagesStore.addBotMessage({
        branchInfo: i18n.global.tm("branchInfo"),
      });
      return;
    }

    const typingIndex =
      messagesStore.messages.push({
        from: "bot",
        loading: true,
        timestamp: Date.now(),
      }) - 1;

    isLoading.value = true;
    abortController.value = new AbortController();

    try {
      const payload = {
        question: text,
        language: session.currentLanguage,
        history: messagesStore.getChatHistory().slice(0, -1),
      };

      const response = await axios.post(`${API_BASE_URL}/api/chat`, payload, {
        signal: abortController.value.signal,
      });
      const data = response.data;
      console.log("Chat API Response:", data);

      if (messagesStore.messages[typingIndex]) {
        messagesStore.messages.splice(typingIndex, 1);
      }

      messagesStore.addBotMessage({
        text: data.answer,
        sources: data.sources,
        suggestions: data.suggestions,
        language: session.currentLanguage,
      });
    } catch (error) {
      // If aborted, do nothing (we likely removed the loading msg in stopGeneration)
      if (axios.isCancel(error)) {
        console.log("Request canceled");
        return;
      }

      if (messagesStore.messages[typingIndex])
        messagesStore.messages.splice(typingIndex, 1);
      console.error("Chat Error:", error);
      messagesStore.addBotMessage({
        text: i18n.global.t("systemBusy"),
        error: true,
      });
    } finally {
      isLoading.value = false;
      abortController.value = null;
    }
  };

  const sendVoiceMessage = async (audioBlob) => {
    // Abort previous request if active
    if (isLoading.value) {
      stopGeneration();
    }

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("language", session.currentLanguage);

    isLoading.value = true;
    abortController.value = new AbortController();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/voice`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: abortController.value.signal,
      });

      const data = response.data;

      if (data.question) {
        messagesStore.addUserMessage(data.question);
      }

      messagesStore.addBotMessage({
        text: data.answer,
        sources: data.sources,
        suggestions: data.suggestions,
        language: session.currentLanguage,
        audio: data.audio,
      });

      return data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Voice Request canceled");
        return null;
      }
      console.error("Voice Error:", error);
      messagesStore.addBotMessage({
        text: i18n.global.t("voiceFailed"),
        error: true,
      });
      return null;
    } finally {
      isLoading.value = false;
      abortController.value = null;
    }
  };

  const inquireComplaint = async (complaintNum, taxNum) => {
    const typingIndex =
      messagesStore.messages.push({
        from: "bot",
        loading: true,
        timestamp: Date.now(),
      }) - 1;

    isLoading.value = true;

    try {
      const url = `${COMPLAINT_API_URL}/${complaintNum}/${taxNum}`;

      console.log("InquireComplaint Called With:");
      console.log("Tax Num:", taxNum);
      console.log("Complaint Num:", complaintNum);
      console.log("Request URL:", url);

      const res = await axios.get(url, {
        headers: {
          "Portal-Api-Key": "E3F1A6D5-BD91-4B3A-AE2C-51A74C8E8D42",
        },
      });
      console.log("Complaint API Response:", res.data);

      if (messagesStore.messages[typingIndex]) {
        messagesStore.messages.splice(typingIndex, 1);
      }

      if (Array.isArray(res.data) && res.data.length > 0) {
        messagesStore.addBotMessage({ inquiryData: res.data });
      } else {
        messagesStore.addBotMessage({
          text: i18n.global.t("noDataFound"),
          error: true,
        });
      }
    } catch (err) {
      if (messagesStore.messages[typingIndex])
        messagesStore.messages.splice(typingIndex, 1);
      console.error("inquireComplaint error:", err);
      messagesStore.addBotMessage({
        text: i18n.global.t("connectionError"),
        error: true,
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    clearSession,
    sendMessage,
    sendVoiceMessage,
    inquireComplaint,
    stopGeneration,
    isLoading,
  };
});
