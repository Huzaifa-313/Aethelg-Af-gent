# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: web\hooks\useConversation.ts
# Merge Date: 2026-05-07T19:17:41.713127
# ---

import { useChatStore } from "@/lib/store";

export function useConversation(id: string) {
  const { conversations, addMessage, updateMessage, deleteConversation } = useChatStore();
  const conversation = conversations.find((c) => c.id === id) ?? null;

  return {
    conversation,
    messages: conversation?.messages ?? [],
    addMessage: (msg: Parameters<typeof addMessage>[1]) => addMessage(id, msg),
    updateMessage: (msgId: string, updates: Parameters<typeof updateMessage>[2]) =>
      updateMessage(id, msgId, updates),
    deleteConversation: () => deleteConversation(id),
  };
}
