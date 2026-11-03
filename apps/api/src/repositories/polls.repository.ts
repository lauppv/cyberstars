import type { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';
import { actorInclude, type NotificationRow } from './notifications.repository.js';

// The poll, its options (Other last, when asked for) and a bell row of it for
// every account but the author's, in one transaction, so the history never
// lists one nobody got
export function createPoll(
  authorId: number,
  question: string,
  options: string[],
  other: boolean,
): Promise<NotificationRow[]> {
  return prisma.$transaction(async (tx) => {
    const users = await tx.user.findMany({
      where: { id: { not: authorId } },
      select: { id: true },
    });
    const { id } = await tx.poll.create({
      data: {
        authorId,
        question,
        recipients: users.length,
        options: {
          create: [
            ...options.map((text) => ({ text })),
            ...(other ? [{ text: 'Other', writeIn: true }] : []),
          ],
        },
      },
      select: { id: true },
    });
    return tx.notification.createManyAndReturn({
      data: users.map((u) => ({
        userId: u.id,
        actorId: authorId,
        type: 'POLL' as const,
        entityId: id,
        data: { text: question },
      })),
      include: actorInclude,
    });
  });
}

// A poll with its options in the order they were written, no counts, and
// whether this user voted
export function findPoll(id: number, userId: number) {
  return prisma.poll.findUnique({
    where: { id },
    include: {
      options: { orderBy: { id: 'asc' }, select: { id: true, text: true, writeIn: true } },
      voted: { where: { userId }, select: { userId: true } },
    },
  });
}

// When this account was made, null once it's gone
export async function joinedAt(userId: number): Promise<Date | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true } });
  return user?.createdAt ?? null;
}

// An account opening a poll counts once in its viewers, however often it opens
// it. The vote does it too, so a voter is always among them
async function view(tx: Prisma.TransactionClient, pollId: number, userId: number) {
  const { count } = await tx.pollViewer.createMany({
    data: [{ pollId, userId }],
    skipDuplicates: true,
  });
  if (count > 0) {
    await tx.poll.update({ where: { id: pollId }, data: { viewers: { increment: 1 } } });
  }
}

export function noteView(pollId: number, userId: number): Promise<void> {
  return prisma.$transaction((tx) => view(tx, pollId, userId));
}

// One anonymous vote: the voter goes in poll_voters so they can't vote again,
// and each option picked counts one more, with nothing tying the two, nor to
// what they wrote under Other. False when they had voted already, from another
// tab too
export function vote(
  pollId: number,
  userId: number,
  optionIds: number[],
  answer?: string,
): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.pollVoter.createMany({
      data: [{ pollId, userId }],
      skipDuplicates: true,
    });
    if (count === 0) return false;
    await view(tx, pollId, userId);
    await tx.pollOption.updateMany({
      where: { pollId, id: { in: optionIds } },
      data: { votes: { increment: 1 } },
    });
    await tx.poll.update({ where: { id: pollId }, data: { voters: { increment: 1 } } });
    if (answer) await tx.pollAnswer.create({ data: { pollId, text: answer } });
    return true;
  });
}

export function listPolls(take: number) {
  return prisma.poll.findMany({
    orderBy: { id: 'desc' },
    take,
    include: {
      author: { select: { name: true } },
      options: { orderBy: { id: 'asc' } },
      answers: { orderBy: { id: 'desc' }, select: { text: true } },
    },
  });
}
