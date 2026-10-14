import type { TutorMessage } from '@prisma/client';
import { prisma } from '../config/db.js';

// One student's conversation: the general one when it has no lesson.
export interface ConversationKey {
  userId: number;
  courseKey: string | null;
  lessonSlug: string | null;
}

export interface NewTutorMessage {
  role: string;
  text: string;
  finish: string | null;
  createdAt: Date;
}

// The newest `take` messages, newest first; with `before`, only older ones.
export function listNewest(
  key: ConversationKey,
  take: number,
  before?: number,
): Promise<TutorMessage[]> {
  return prisma.tutorMessage.findMany({
    where: { ...key, ...(before ? { id: { lt: before } } : {}) },
    orderBy: { id: 'desc' },
    take,
  });
}

// Insert the messages in order and drop the conversation's messages beyond the
// newest `cap`, in one transaction so it never outgrows the cap. Newest is the
// highest id, which is monotonic with insertion order.
export function saveAndPrune(
  key: ConversationKey,
  messages: NewTutorMessage[],
  cap: number,
): Promise<void> {
  return prisma.$transaction(async (tx) => {
    for (const message of messages) {
      await tx.tutorMessage.create({ data: { ...key, ...message } });
    }
    const boundary = await tx.tutorMessage.findMany({
      where: key,
      orderBy: { id: 'desc' },
      skip: cap,
      take: 1,
      select: { id: true },
    });
    if (boundary.length > 0) {
      await tx.tutorMessage.deleteMany({ where: { ...key, id: { lte: boundary[0].id } } });
    }
  });
}

export async function deleteConversation(key: ConversationKey): Promise<void> {
  await prisma.tutorMessage.deleteMany({ where: key });
}
