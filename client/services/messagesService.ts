import { api } from './apiClient';
import type { ConversationDTO, ConversationHistory, MessageDTO } from '../../shared/messages';

export function getConversations() {
  return api.get<{ conversations: ConversationDTO[] }>('/api/messages/conversations');
}

export function openConversation(recipientId: number) {
  return api.post<{ conversation: ConversationDTO }>('/api/messages/conversations', {
    recipientId,
  });
}

export function getHistory(conversationId: number, take = 30, before?: number) {
  const q = new URLSearchParams({ take: String(take) });
  if (before) q.set('before', String(before));
  return api.get<ConversationHistory>(`/api/messages/conversations/${conversationId}?${q}`);
}

export function sendMessage(conversationId: number, content: string) {
  return api.post<{ message: MessageDTO }>(`/api/messages/conversations/${conversationId}`, {
    content,
  });
}

export function markRead(conversationId: number, upToMessageId: number) {
  return api.post<{ ok: boolean }>(`/api/messages/conversations/${conversationId}/read`, {
    upToMessageId,
  });
}

export function editMessage(messageId: number, content: string) {
  return api.patch<{ message: MessageDTO }>(`/api/messages/${messageId}`, { content });
}

export function deleteMessage(messageId: number) {
  return api.delete<{ message: MessageDTO }>(`/api/messages/${messageId}`);
}

export function toggleReaction(messageId: number, emoji: string) {
  return api.post<{ message: MessageDTO }>(`/api/messages/${messageId}/reactions`, { emoji });
}
