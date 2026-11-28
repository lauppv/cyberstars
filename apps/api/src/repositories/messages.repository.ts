import { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';

const participantSelect = { id: true, name: true, avatarUrl: true } as const;

const reactionsInclude = {
  reactions: { select: { emoji: true, userId: true }, orderBy: { id: 'asc' } },
} as const;

export type MessageRow = Prisma.DirectMessageGetPayload<{ include: typeof reactionsInclude }>;

export type ConversationRow = Prisma.ConversationGetPayload<{
  include: {
    userA: { select: typeof participantSelect };
    userB: { select: typeof participantSelect };
    messages: { include: typeof reactionsInclude };
  };
}>;

const conversationInclude = {
  userA: { select: participantSelect },
  userB: { select: participantSelect },
  messages: { take: 1, orderBy: { id: 'desc' }, include: reactionsInclude },
} satisfies Prisma.ConversationInclude;

// The first message creates the conversation in the same write, so a
// conversation never exists without a message. Canonical ordered pair
// (userAId < userBId) so A<->B and B<->A resolve to the same row.
export async function sendToPair(
  senderId: number,
  recipientId: number,
  content: string,
): Promise<MessageRow> {
  const [userAId, userBId] =
    senderId < recipientId ? [senderId, recipientId] : [recipientId, senderId];
  const where = { userAId_userBId: { userAId, userBId } };
  const existing = await prisma.conversation.findUnique({ where, select: { id: true } });
  if (existing) return createMessage(existing.id, senderId, content);
  try {
    const created = await prisma.conversation.create({
      data: { userAId, userBId, messages: { create: { senderId, content } } },
      include: { messages: { include: reactionsInclude } },
    });
    return created.messages[0];
  } catch (err) {
    // Two concurrent first messages can both miss the findUnique and race the
    // create; the loser hits the unique constraint, so append to the winner's row.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const winner = await prisma.conversation.findUnique({ where, select: { id: true } });
      if (winner) return createMessage(winner.id, senderId, content);
    }
    throw err;
  }
}

export function findConversation(id: number): Promise<ConversationRow | null> {
  return prisma.conversation.findUnique({ where: { id }, include: conversationInclude });
}

// `hiddenUserIds`: people the user blocked, whose conversations stay out of the
// inbox until they're unblocked
export function listConversations(
  userId: number,
  hiddenUserIds: number[] = [],
): Promise<ConversationRow[]> {
  return prisma.conversation.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
      userAId: { notIn: hiddenUserIds },
      userBId: { notIn: hiddenUserIds },
    },
    orderBy: { updatedAt: 'desc' },
    include: conversationInclude,
  });
}

// Unread counts per conversation for a user: messages the *other* side sent that
// this user hasn't read yet. Deleted messages don't count; there is nothing
// left to read, and a badge pointing at a redacted bubble is just noise. One
// grouped query, not one per conversation.
export async function unreadByConversation(userId: number): Promise<Map<number, number>> {
  const rows = await prisma.directMessage.groupBy({
    by: ['conversationId'],
    where: {
      readAt: null,
      deleted: false,
      senderId: { not: userId },
      conversation: { OR: [{ userAId: userId }, { userBId: userId }] },
    },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.conversationId, r._count._all]));
}

export function listMessages(
  conversationId: number,
  take: number,
  before?: number,
): Promise<MessageRow[]> {
  return prisma.directMessage.findMany({
    where: { conversationId, ...(before ? { id: { lt: before } } : {}) },
    orderBy: { id: 'desc' },
    take,
    include: reactionsInclude,
  });
}

export async function createMessage(
  conversationId: number,
  senderId: number,
  content: string,
): Promise<MessageRow> {
  const [message] = await prisma.$transaction([
    prisma.directMessage.create({
      data: { conversationId, senderId, content },
      include: reactionsInclude,
    }),
    prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } }),
  ]);
  return message;
}

// Mark every message the other side sent (id <= upTo, still unread) as read.
export async function markRead(
  conversationId: number,
  readerId: number,
  upToMessageId: number,
): Promise<number> {
  const res = await prisma.directMessage.updateMany({
    where: {
      conversationId,
      senderId: { not: readerId },
      id: { lte: upToMessageId },
      readAt: null,
    },
    data: { readAt: new Date() },
  });
  return res.count;
}

export function findMessage(id: number): Promise<MessageRow | null> {
  return prisma.directMessage.findUnique({ where: { id }, include: reactionsInclude });
}

// Toggle semantics like ForumReaction: same (message, user, emoji) removes,
// otherwise adds. Returns the refreshed reaction list for the message.
export async function toggleReaction(
  messageId: number,
  userId: number,
  emoji: string,
): Promise<{ emoji: string; userId: number }[]> {
  const where = { messageId_userId_emoji: { messageId, userId, emoji } };
  const existing = await prisma.dmReaction.findUnique({ where });
  if (existing) {
    await prisma.dmReaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.dmReaction.create({ data: { messageId, userId, emoji } });
  }
  return prisma.dmReaction.findMany({
    where: { messageId },
    select: { emoji: true, userId: true },
    orderBy: { id: 'asc' },
  });
}

// Edit like ForumPost: replace the content and stamp editedAt. Scoped to the
// sender and to non-deleted rows so a caller can only edit their own live
// message. Returns the refreshed row (with reactions) or null if nothing matched.
export async function editMessage(
  id: number,
  senderId: number,
  content: string,
): Promise<MessageRow | null> {
  const res = await prisma.directMessage.updateMany({
    where: { id, senderId, deleted: false },
    data: { content, editedAt: new Date() },
  });
  if (res.count === 0) return null;
  return prisma.directMessage.findUnique({ where: { id }, include: reactionsInclude });
}

// Soft-delete like ForumPost: the row stays (thread integrity) but content is
// blanked. Scoped to the sender so a caller can only delete their own message.
export async function softDeleteMessage(id: number, senderId: number): Promise<MessageRow | null> {
  const res = await prisma.directMessage.updateMany({
    where: { id, senderId, deleted: false },
    data: { deleted: true, content: '' },
  });
  if (res.count === 0) return null;
  return prisma.directMessage.findUnique({ where: { id }, include: reactionsInclude });
}
