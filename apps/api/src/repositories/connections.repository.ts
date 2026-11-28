import { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';
import { lockPair } from './blocks.repository.js';

const userSelect = { id: true, name: true, avatarUrl: true } as const;

export type ConnectionRow = Prisma.ConnectionGetPayload<{
  include: {
    requester: { select: typeof userSelect };
    addressee: { select: typeof userSelect };
  };
}>;

const connectionInclude = {
  requester: { select: userSelect },
  addressee: { select: userSelect },
} satisfies Prisma.ConnectionInclude;

// The single row (if any) between two users, in either direction. Used to decide
// whether a new request is allowed and to resolve the viewer's relationship to a
// profile.
export function findBetween(a: number, b: number): Promise<ConnectionRow | null> {
  return prisma.connection.findFirst({
    where: {
      OR: [
        { requesterId: a, addresseeId: b },
        { requesterId: b, addresseeId: a },
      ],
    },
    include: connectionInclude,
  });
}

export function findById(id: number): Promise<ConnectionRow | null> {
  return prisma.connection.findUnique({ where: { id }, include: connectionInclude });
}

// The request, or null when a block stands between the two: checked under
// the pair's lock, which a block takes too, so one landing at the same moment
// can't leave the request behind
export function create(requesterId: number, addresseeId: number): Promise<ConnectionRow | null> {
  return prisma.$transaction(async (tx) => {
    await lockPair(tx, requesterId, addresseeId);
    const blocked = await tx.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: requesterId, blockedId: addresseeId },
          { blockerId: addresseeId, blockedId: requesterId },
        ],
      },
      select: { id: true },
    });
    if (blocked) return null;
    return tx.connection.create({
      data: { requesterId, addresseeId },
      include: connectionInclude,
    });
  });
}

export function accept(id: number): Promise<ConnectionRow> {
  return prisma.connection.update({
    where: { id },
    data: { status: 'ACCEPTED', respondedAt: new Date() },
    include: connectionInclude,
  });
}

// Decline / cancel / remove all collapse to deleting the row: a declined or
// removed connection leaves no trace, so the pair can re-request later.
export async function remove(id: number): Promise<void> {
  await prisma.connection.deleteMany({ where: { id } });
}

// Accepted connections for a user, either direction, newest first.
export function listAccepted(userId: number): Promise<ConnectionRow[]> {
  return prisma.connection.findMany({
    where: {
      status: 'ACCEPTED',
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    orderBy: { respondedAt: 'desc' },
    include: connectionInclude,
  });
}

// Pending requests this user must respond to.
export function listIncoming(userId: number): Promise<ConnectionRow[]> {
  return prisma.connection.findMany({
    where: { addresseeId: userId, status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    include: connectionInclude,
  });
}

// Pending requests this user sent.
export function listOutgoing(userId: number): Promise<ConnectionRow[]> {
  return prisma.connection.findMany({
    where: { requesterId: userId, status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    include: connectionInclude,
  });
}
