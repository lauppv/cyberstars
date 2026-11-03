import { prisma } from '../config/db.js';
import { actorInclude, type NotificationRow } from './notifications.repository.js';

// The poll, its options and a bell row of it for every account but the
// author's, in one transaction, so the history never lists one nobody got
export function createPoll(
  authorId: number,
  question: string,
  options: string[],
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
        options: { create: options.map((text) => ({ text })) },
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
      options: { orderBy: { id: 'asc' }, select: { id: true, text: true } },
      voted: { where: { userId }, select: { userId: true } },
    },
  });
}

// One anonymous vote: the voter goes in poll_voters so they can't vote again,
// and each option picked counts one more, with nothing tying the two. False
// when they had voted already, from another tab too
export function vote(pollId: number, userId: number, optionIds: number[]): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.pollVoter.createMany({
      data: [{ pollId, userId }],
      skipDuplicates: true,
    });
    if (count === 0) return false;
    await tx.pollOption.updateMany({
      where: { pollId, id: { in: optionIds } },
      data: { votes: { increment: 1 } },
    });
    await tx.poll.update({ where: { id: pollId }, data: { voters: { increment: 1 } } });
    return true;
  });
}

export function listPolls(take: number) {
  return prisma.poll.findMany({
    orderBy: { id: 'desc' },
    take,
    include: { author: { select: { name: true } }, options: { orderBy: { id: 'asc' } } },
  });
}
