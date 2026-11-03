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

export function listPolls(take: number) {
  return prisma.poll.findMany({
    orderBy: { id: 'desc' },
    take,
    include: { author: { select: { name: true } }, options: { orderBy: { id: 'asc' } } },
  });
}
