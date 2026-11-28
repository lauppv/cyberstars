import * as repo from '../repositories/messages.repository.js';
import * as userRepo from '../repositories/user.repository.js';
import * as blocks from './blocks.service.js';
import * as supportService from './support.service.js';
import { pushToUser } from './ws-user.js';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import type { ConversationDTO, ConversationHistory, MessageDTO } from '@cyberstars/shared/messages';

const HISTORY_PAGE = 30;

function shapeMessage(row: repo.MessageRow): MessageDTO {
  return {
    id: row.id,
    conversationId: row.conversationId,
    senderId: row.senderId,
    content: row.deleted ? '' : row.content,
    deleted: row.deleted,
    readAt: row.readAt ? row.readAt.toISOString() : null,
    editedAt: row.editedAt ? row.editedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    reactions: row.reactions.map((r) => ({ emoji: r.emoji, userId: r.userId })),
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
// 404 (not 403) so they can't even probe which conversation ids exist. A
// conversation with someone the caller blocked is hidden from them the same way
// until they unblock.
async function requireConversation(id: number, userId: number): Promise<repo.ConversationRow> {
  const row = await repo.findConversation(id);
  if (
    !row ||
    !isParticipant(row, userId) ||
    (await blocks.isBlockedBy(userId, otherParticipant(row, userId)))
  ) {
    throw new AppError(404, 'Conversation not found');
  }
  return row;
}

// Live frames reach the other side unless they blocked the one acting: their
// conversation is hidden from them, so nothing of it should show up live either.
// It runs after the write is saved, so a failed check only skips the live
// frame: the request still answers with what was saved.
async function pushToOther(
  row: repo.ConversationRow,
  actorId: number,
  frame: Parameters<typeof pushToUser>[1],
): Promise<void> {
  const otherId = otherParticipant(row, actorId);
  try {
    if (await blocks.isBlockedBy(otherId, actorId)) return;
  } catch (err) {
    console.error('[dm] block check before a live frame failed:', err);
    return;
  }
  pushToUser(otherId, frame);
}

export async function getInbox(userId: number): Promise<ConversationDTO[]> {
  const hidden = await blocks.blockedIds(userId);
  const [rows, unread] = await Promise.all([
    repo.listConversations(userId, hidden),
    repo.unreadByConversation(userId),
  ]);
  return rows.map((row) => shapeConversation(row, userId, unread.get(row.id) ?? 0));
}

// No conversation exists until its first message: this sends that message,
// creating the conversation, or appends to the pair's conversation if it exists.
export async function startConversation(
  userId: number,
  recipientId: number,
  content: string,
): Promise<{ conversation: ConversationDTO; message: MessageDTO }> {
  if (recipientId === userId) throw new AppError(400, 'Cannot message yourself');
  const recipient = await userRepo.findById(recipientId);
  if (!recipient) throw new AppError(404, 'User not found');
  if (await blocks.existsBetween(userId, recipientId)) {
    throw new AppError(403, blocks.MESSAGE_NOT_SENT);
  }
  const message = shapeMessage(await repo.sendToPair(userId, recipientId, content));
  const row = await requireConversation(message.conversationId, userId);
  const unread = await repo.unreadByConversation(userId);

  // Same live delivery as sendMessage
  await pushToOther(row, userId, { channel: 'dm', type: 'message', payload: message });
  pushToUser(userId, { channel: 'dm', type: 'message', payload: message });
  return { conversation: shapeConversation(row, userId, unread.get(row.id) ?? 0), message };
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
  const recipientId = otherParticipant(row, userId);
  // The caller didn't block them (requireConversation), but they may have
  // blocked the caller
  if (await blocks.isBlockedBy(recipientId, userId)) {
    throw new AppError(403, blocks.MESSAGE_NOT_SENT);
  }
  const message = shapeMessage(await repo.createMessage(conversationId, userId, content));

  // Live-deliver to both participants (recipient sees it instantly; the sender's
  // other tabs stay in sync). DB is the source of truth if either is offline.
  // No bell notification: the messages button's unread badge already covers it.
  // pushToOther checks the block again: one that landed since the check above
  // keeps the message off the blocker's screen, as it is out of their inbox.
  await pushToOther(row, userId, { channel: 'dm', type: 'message', payload: message });
  pushToUser(userId, { channel: 'dm', type: 'message', payload: message });
  return message;
}

export async function markRead(
  userId: number,
  conversationId: number,
  upToMessageId: number,
): Promise<number> {
  const row = await requireConversation(conversationId, userId);
  const count = await repo.markRead(conversationId, userId, upToMessageId);
  if (count > 0) {
    // Tell the other participant their messages were read, so their read receipts
    // update live. Echo the same frame to the reader's own tabs so their inbox
    // badge clears everywhere, not just in the tab that opened the thread
    // (clients tell the two apart by readerId).
    const frame = {
      channel: 'dm',
      type: 'read',
      payload: { conversationId, upToMessageId, readerId: userId },
    } as const;
    await pushToOther(row, userId, frame);
    pushToUser(userId, frame);
  }
  return count;
}

export async function toggleReaction(
  userId: number,
  messageId: number,
  emoji: string,
): Promise<MessageDTO> {
  const message = await repo.findMessage(messageId);
  if (!message) throw new AppError(404, 'Message not found');
  const row = await requireConversation(message.conversationId, userId);
  // A deleted message shows only a placeholder; reacting to it is noise.
  if (message.deleted) throw new AppError(400, 'Cannot react to a deleted message');
  // A block stops new reactions, not taking back one left before it
  const removing = message.reactions.some((r) => r.userId === userId && r.emoji === emoji);
  if (!removing && (await blocks.isBlockedBy(otherParticipant(row, userId), userId))) {
    throw new AppError(403, blocks.REACTION_NOT_ADDED);
  }

  const reactions = await repo.toggleReaction(messageId, userId, emoji);

  // Same live-delivery model as send/read/delete: both sides get the refreshed
  // list; removals ride the same frame since the list is authoritative. Silent
  // (no bell); the thread UI updating live is signal enough for a 1-to-1 chat.
  const frame = {
    channel: 'dm',
    type: 'reaction',
    payload: { conversationId: message.conversationId, messageId, reactions },
  } as const;
  await pushToOther(row, userId, frame);
  pushToUser(userId, frame);

  return shapeMessage({ ...message, reactions });
}

export async function editMessage(
  userId: number,
  messageId: number,
  content: string,
): Promise<MessageDTO> {
  const message = await repo.findMessage(messageId);
  // 404 for a non-owner or a missing/deleted message, same as delete, so a
  // caller can't probe which message ids exist or edit someone else's text.
  if (!message || message.senderId !== userId || message.deleted) {
    throw new AppError(404, 'Message not found');
  }
  // Hidden from one who blocked the other side, as everywhere else
  const row = await requireConversation(message.conversationId, userId);
  // An edit puts new words in front of the other side, so a block refuses it
  // as it refuses a send
  if (await blocks.isBlockedBy(otherParticipant(row, userId), userId)) {
    throw new AppError(403, blocks.MESSAGE_NOT_SENT);
  }
  const updated = await repo.editMessage(messageId, userId, content);
  if (!updated) throw new AppError(404, 'Message not found');
  const dto = shapeMessage(updated);

  // Push the refreshed content live to both sides (like send/delete) so the
  // edit lands on the other participant's screen without a refetch.
  await pushToOther(row, userId, { channel: 'dm', type: 'edited', payload: dto });
  pushToUser(userId, { channel: 'dm', type: 'edited', payload: dto });
  return dto;
}

// A student reports a message they received: it reaches the admins as a
// support ticket holding a copy of the message, so a later edit or delete by
// its sender doesn't change what they see. Reporting works after a block too.
export async function reportMessage(
  userId: number,
  messageId: number,
  note: string | undefined,
): Promise<number> {
  const message = await repo.findMessage(messageId);
  const row = message ? await repo.findConversation(message.conversationId) : null;
  if (!message || !row || !isParticipant(row, userId)) {
    throw new AppError(404, 'Message not found');
  }
  if (message.senderId === userId) throw new AppError(400, 'Cannot report your own message');
  if (message.deleted) throw new AppError(400, 'Cannot report a deleted message');

  const sender = row.userAId === message.senderId ? row.userA : row.userB;
  const subject = `Reported message from ${sender.name}`.slice(0, 200);
  const body = [
    'A direct message was reported.',
    '',
    `From: ${sender.name} (user ${sender.id})`,
    `Sent: ${message.createdAt.toISOString()}`,
    `Message ${message.id}, conversation ${message.conversationId}`,
    '',
    message.content,
    ...(note ? ['', `Note from the student: ${note}`] : []),
  ].join('\n');
  return supportService.openTicket(userId, 'RULE_VIOLATION', subject, body);
}

export async function deleteMessage(userId: number, messageId: number): Promise<MessageDTO> {
  const message = await repo.findMessage(messageId);
  if (!message || message.senderId !== userId) throw new AppError(404, 'Message not found');
  // Hidden from one who blocked the other side, as everywhere else
  const row = await requireConversation(message.conversationId, userId);
  const updated = await repo.softDeleteMessage(messageId, userId);
  if (!updated) throw new AppError(404, 'Message not found');
  const dto = shapeMessage(updated);

  // A delete is a redaction, so push it live to both sides (like send/read) so the
  // deleted content doesn't linger on the other participant's screen.
  await pushToOther(row, userId, { channel: 'dm', type: 'deleted', payload: dto });
  pushToUser(userId, { channel: 'dm', type: 'deleted', payload: dto });
  return dto;
}
