import type { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';

const userSelect = { id: true, name: true, avatarUrl: true } as const;

// A block in either direction between two users: either one stops direct
// messages and connection requests between them.
export async function existsBetween(a: number, b: number): Promise<boolean> {
  const row = await prisma.userBlock.findFirst({
    where: {
      OR: [
        { blockerId: a, blockedId: b },
        { blockerId: b, blockedId: a },
      ],
    },
    select: { id: true },
  });
  return row !== null;
}

export async function isBlockedBy(blockerId: number, blockedId: number): Promise<boolean> {
  const row = await prisma.userBlock.findUnique({
    where: { blockerId_blockedId: { blockerId, blockedId } },
    select: { id: true },
  });
  return row !== null;
}

// The people `blockerId` blocked, newest first
export function listBlocked(blockerId: number) {
  return prisma.userBlock.findMany({
    where: { blockerId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true, blocked: { select: userSelect } },
  });
}

// The ids `blockerId` blocked, to hide their conversations
export async function blockedIds(blockerId: number): Promise<number[]> {
  const rows = await prisma.userBlock.findMany({
    where: { blockerId },
    select: { blockedId: true },
  });
  return rows.map((r) => r.blockedId);
}

// One transaction lock per pair of users, whichever order they come in: a
// block and a connection request between the same two take turns, so a
// request checked just before a block can't be written just after it
export async function lockPair(tx: Prisma.TransactionClient, a: number, b: number): Promise<void> {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(${Math.min(a, b)}::int, ${Math.max(a, b)}::int)`;
}

// Blocking also ends the pair's connection or pending request, in one write
export async function block(blockerId: number, blockedId: number): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await lockPair(tx, blockerId, blockedId);
    await tx.userBlock.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      create: { blockerId, blockedId },
      update: {},
    });
    await tx.connection.deleteMany({
      where: {
        OR: [
          { requesterId: blockerId, addresseeId: blockedId },
          { requesterId: blockedId, addresseeId: blockerId },
        ],
      },
    });
  });
}

export async function unblock(blockerId: number, blockedId: number): Promise<void> {
  await prisma.userBlock.deleteMany({ where: { blockerId, blockedId } });
}
