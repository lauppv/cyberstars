import * as repo from '../repositories/messages.repository.js';
import * as userRepo from '../repositories/user.repository.js';
import * as notificationsService from './notifications.service.js';
import { pushToUser } from './ws-user.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ConversationDTO, ConversationHistory, MessageDTO } from '../../shared/messages.js';

const HISTORY_PAGE = 30;

function shapeMessage(row: repo.MessageRow): MessageDTO {
  return {
    id: row.id,
    conversationId: row.conversationId,
    senderId: row.senderId,
    content: row.deleted ? '' : row.content,
    deleted: row.deleted,
    readAt: row.readAt ? row.readAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  };
}

// Shape a conversation from `userId`'s perspective: `other` is always the *other*
// participant, and unreadCount is what they haven't read.
function shapeConversation(
  row: repo.ConversationRow,
  userId: number,
  unread: number,
): ConversationDTO {
  const other = row.userAId === userId ? row.userB : row.userA;
  const last = row.messages[0] ? shapeMessage(row.messages[0]) : null;
  return {
    id: row.id,
    other: { id: other.id, name: other.name, avatarUrl: other.avatarUrl },
    lastMessage: last,
    unreadCount: unread,
    updatedAt: row.updatedAt.toISOString(),
  };
}

function isParticipant(row: repo.ConversationRow, userId: number): boolean {
  return row.userAId === userId || row.userBId === userId;
}

function otherParticipant(row: repo.ConversationRow, userId: number): number {
  return row.userAId === userId ? row.userBId : row.userAId;
}

// Load a conversation and assert the caller participates. A non-participant gets
// 404 (not 403) so they can't even probe which conversation ids exist.
async function requireConversation(id: number, userId: number): Promise<repo.ConversationRow> {
  const row = await repo.findConversation(id);
  if (!row || !isParticipant(row, userId)) throw new AppError(404, 'Conversation not found');
  return row;
}

export async function getInbox(userId: number): Promise<ConversationDTO[]> {
  const [rows, unread] = await Promise.all([
    repo.listConversations(userId),
    repo.unreadByConversation(userId),
  ]);
  return rows.map((row) => shapeConversation(row, userId, unread.get(row.id) ?? 0));
}

export async function openConversation(
  userId: number,
  recipientId: number,
): Promise<ConversationDTO> {
  if (recipientId === userId) throw new AppError(400, 'Cannot message yourself');
  const recipient = await userRepo.findById(recipientId);
  if (!recipient) throw new AppError(404, 'User not found');
  const row = await repo.findOrCreatePair(userId, recipientId);
  const unread = await repo.unreadByConversation(userId);
  return shapeConversation(row, userId, unread.get(row.id) ?? 0);
}

export async function getHistory(
  userId: number,
  conversationId: number,
  take = HISTORY_PAGE,
  before?: number,
): Promise<ConversationHistory> {
  const row = await requireConversation(conversationId, userId);
  const rows = await repo.listMessages(conversationId, take + 1, before);
  const hasMore = rows.length > take;
  const messages = rows.slice(0, take).map(shapeMessage);
  const unread = await repo.unreadByConversation(userId);
  return {
    conversation: shapeConversation(row, userId, unread.get(conversationId) ?? 0),
    messages,
    hasMore,
  };
}

export async function sendMessage(
  userId: number,
  conversationId: number,
  content: string,
): Promise<MessageDTO> {
  const row = await requireConversation(conversationId, userId);
  const message = shapeMessage(await repo.createMessage(conversationId, userId, content));
  const recipientId = otherParticipant(row, userId);

  // Live-deliver to both participants (recipient sees it instantly; the sender's
  // other tabs stay in sync). DB is the source of truth if either is offline.
  pushToUser(recipientId, { channel: 'dm', type: 'message', payload: message });
  pushToUser(userId, { channel: 'dm', type: 'message', payload: message });

  // Bell notification for the recipient (collapses per conversation while unread).
  // No message excerpt is snapshotted: the DM notification only renders a count,
  // and storing content would leave a copy behind after a message is deleted.
  void notificationsService.notify({
    recipientIds: [recipientId],
    actorId: userId,
    type: 'DM_MESSAGE',
    entityId: conversationId,
  });
  return message;
}

export async function markRead(
  userId: number,
  conversationId: number,
  upToMessageId: number,
): Promise<number> {
  const row = await requireConversation(conversationId, userId);
  const count = await repo.markRead(conversationId, userId, upToMessageId);
  // Opening the thread also clears its bell notification (§4.7).
  void notificationsService.markEntityRead(userId, 'DM_MESSAGE', conversationId);
  if (count > 0) {
    // Tell the other participant their messages were read, so their read receipts
    // update live.
    pushToUser(otherParticipant(row, userId), {
      channel: 'dm',
      type: 'read',
      payload: { conversationId, upToMessageId, readerId: userId },
    });
  }
  return count;
}

export async function deleteMessage(userId: number, messageId: number): Promise<MessageDTO> {
  const message = await repo.findMessage(messageId);
  if (!message || message.senderId !== userId) throw new AppError(404, 'Message not found');
  const updated = await repo.softDeleteMessage(messageId, userId);
  if (!updated) throw new AppError(404, 'Message not found');
  const dto = shapeMessage(updated);

  // A delete is a redaction — push it live to both sides (like send/read) so the
  // deleted content doesn't linger on the other participant's screen.
  const row = await repo.findConversation(message.conversationId);
  if (row) {
    pushToUser(otherParticipant(row, userId), { channel: 'dm', type: 'deleted', payload: dto });
    pushToUser(userId, { channel: 'dm', type: 'deleted', payload: dto });
  }
  return dto;
}
