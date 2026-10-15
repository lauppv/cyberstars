import type { TutorConversation, TutorMessage } from '@prisma/client';
import { prisma } from '../config/db.js';

// What a new conversation is: whose, about which lesson (none for a general
// one) and its title.
export interface NewTutorConversation {
  userId: number;
  courseKey: string | null;
  lessonSlug: string | null;
  title: string;
}

export interface NewTutorMessage {
  role: string;
  text: string;
  finish: string | null;
  createdAt: Date;
}

// How much a save keeps: messages per conversation, conversations per student.
export interface TutorCaps {
  messages: number;
  conversations: number;
}

// A student's newest `take` conversations, the one saved to last first.
export function listConversations(userId: number, take: number): Promise<TutorConversation[]> {
  return prisma.tutorConversation.findMany({
    where: { userId },
    orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
    take,
  });
}

// The conversation only when it is this student's.
export function findConversation(userId: number, id: number): Promise<TutorConversation | null> {
  return prisma.tutorConversation.findFirst({ where: { id, userId } });
}

// The newest `take` messages, newest first; with `before`, only older ones.
export function listNewest(
  conversationId: number,
  take: number,
  before?: number,
): Promise<TutorMessage[]> {
  return prisma.tutorMessage.findMany({
    where: { conversationId, ...(before ? { id: { lt: before } } : {}) },
    orderBy: { id: 'desc' },
    take,
  });
}

// Inserts the messages in order, into the conversation or into a new one, and
// keeps the caps, all in one transaction so neither is ever outgrown. Newest is
// the highest id, which is monotonic with insertion order. Returns the
// conversation's id.
export function saveAndPrune(
  to: number | NewTutorConversation,
  messages: NewTutorMessage[],
  caps: TutorCaps,
): Promise<number> {
  return prisma.$transaction(async (tx) => {
    const updatedAt = messages[messages.length - 1].createdAt;
    const conversation =
      typeof to === 'number'
        ? await tx.tutorConversation.update({ where: { id: to }, data: { updatedAt } })
        : await tx.tutorConversation.create({
            data: { ...to, createdAt: messages[0].createdAt, updatedAt },
          });
    for (const message of messages) {
      await tx.tutorMessage.create({ data: { ...message, conversationId: conversation.id } });
    }
    const boundary = await tx.tutorMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { id: 'desc' },
      skip: caps.messages,
      take: 1,
      select: { id: true },
    });
    if (boundary.length > 0) {
      await tx.tutorMessage.deleteMany({
        where: { conversationId: conversation.id, id: { lte: boundary[0].id } },
      });
    }
    const older = await tx.tutorConversation.findMany({
      where: { userId: conversation.userId },
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      skip: caps.conversations,
      select: { id: true },
    });
    if (older.length > 0) {
      await tx.tutorConversation.deleteMany({ where: { id: { in: older.map((c) => c.id) } } });
    }
    return conversation.id;
  });
}

// Deletes the conversation only when it is this student's; says whether it did.
export async function deleteConversation(userId: number, id: number): Promise<boolean> {
  const { count } = await prisma.tutorConversation.deleteMany({ where: { id, userId } });
  return count > 0;
}
