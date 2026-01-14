import { defineStore, storeToRefs } from "pinia";
import { useChatUiStore } from "./chatUi";
import { useChatSessionStore } from "./chatSession";
import { useChatMessagesStore } from "./chatMessages";
import { useChatActionsStore } from "./chatActions";

export const useChatStore = defineStore("chat", () => {
  const ui = useChatUiStore();
  const session = useChatSessionStore();
  const messagesStore = useChatMessagesStore();
  const actions = useChatActionsStore();

  return {
    ...storeToRefs(ui),
    ...storeToRefs(session),
    ...storeToRefs(messagesStore),

    // Actions
    toggleChat: ui.toggleChat,
    openChat: ui.openChat,
    closeChat: ui.closeChat,
    openVoiceCall: ui.openVoiceCall,
    closeVoiceCall: ui.closeVoiceCall,

    setLanguage: session.setLanguage,
    clearSessionState: session.clearSessionState,

    clearMessages: messagesStore.clearMessages,
    addUserMessage: messagesStore.addUserMessage,
    addBotMessage: messagesStore.addBotMessage,
    getChatHistory: messagesStore.getChatHistory,

    // Complex Actions
    clearSession: actions.clearSession,
    sendMessage: actions.sendMessage,
    sendVoiceMessage: actions.sendVoiceMessage,
    inquireComplaint: actions.inquireComplaint,
  };
});
