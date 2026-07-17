import { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';
import type { NotificationData, NotificationType } from '../../shared/notifications.js';

const actorInclude = { actor: { select: { name: true, avatarUrl: true } } };

export type NotificationRow = Prisma.NotificationGetPayload<{
  include: { actor: { select: { name: true; avatarUrl: true } } };
}>;

export interface CreateNotificationInput {
  userId: number;
  actorId: number | null;
  type: NotificationType;
  entityId: number;
  data?: NotificationData;
}

function jsonData(
  data: NotificationData | undefined,
): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  return data ? (data as Prisma.InputJsonValue) : Prisma.JsonNull;
}

export function list(userId: number, take: number, before?: number): Promise<NotificationRow[]> {
  return prisma.notification.findMany({
    where: { userId, ...(before ? { id: { lt: before } } : {}) },
    orderBy: { id: 'desc' },
    take,
    include: actorInclude,
  });
}

export function countUnread(userId: number): Promise<number> {
  return prisma.notification.count({ where: { userId, readAt: null } });
}

export function findUnreadFor(
  userId: number,
  type: NotificationType,
  entityId: number,
): Promise<NotificationRow | null> {
  return prisma.notification.findFirst({
    where: { userId, type, entityId, readAt: null },
    include: actorInclude,
  });
}

export function create(input: CreateNotificationInput): Promise<NotificationRow> {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      actorId: input.actorId,
      type: input.type,
      entityId: input.entityId,
      data: jsonData(input.data),
    },
    include: actorInclude,
  });
}

// Fold a repeat event into a REPLACEMENT of the existing unread notification:
// the stale row is deleted and a fresh one inserted (newest actor wins, data
// with bumped count). The replacement gets a NEW id, which keeps `id desc`
// ordering — and the client's keyset pagination — monotonic with recency; an
// in-place update would leave the most recent activity buried at its old id.
// deleteMany (not delete) so a concurrent read-and-prune can't make this throw.
export async function collapse(
  existing: NotificationRow,
  actorId: number | null,
  data: NotificationData,
): Promise<NotificationRow> {
  const [, created] = await prisma.$transaction([
    prisma.notification.deleteMany({ where: { id: existing.id } }),
    prisma.notification.create({
      data: {
        userId: existing.userId,
        actorId,
        type: existing.type,
        entityId: existing.entityId,
        data: data as Prisma.InputJsonValue,
      },
      include: actorInclude,
    }),
  ]);
  return created;
}

// A deleted forum post's excerpt shouldn't linger in notification snapshots.
// Only rows still carrying exactly that excerpt are touched — a collapsed row
// re-snapshotted by a newer reply keeps its (still-live) excerpt. updateMany
// per id so a concurrent prune can't make this throw.
export async function clearExcerpt(
  type: NotificationType,
  entityId: number,
  excerpt: string,
): Promise<void> {
  const rows = await prisma.notification.findMany({
    where: { type, entityId, data: { path: ['excerpt'], equals: excerpt } },
    select: { id: true, data: true },
  });
  await Promise.all(
    rows.map((row) => {
      const { excerpt: _dropped, ...rest } = row.data as Record<string, unknown>;
      return prisma.notification.updateMany({
        where: { id: row.id },
        data: { data: rest as Prisma.InputJsonValue },
      });
    }),
  );
}

export async function markReadUpTo(userId: number, upToId: number): Promise<number> {
  const res = await prisma.notification.updateMany({
    where: { userId, id: { lte: upToId }, readAt: null },
    data: { readAt: new Date() },
  });
  return res.count;
}

// Mark every unread notification for a given source entity read (e.g. the
// DM_MESSAGE for a conversation, when its thread is opened). Returns how many.
export async function markReadByEntity(
  userId: number,
  type: NotificationType,
  entityId: number,
): Promise<number> {
  const res = await prisma.notification.updateMany({
    where: { userId, type, entityId, readAt: null },
    data: { readAt: new Date() },
  });
  return res.count;
}

export async function markOneRead(userId: number, id: number): Promise<void> {
  // Scoped by userId so a caller can only mark their own notifications read.
  await prisma.notification.updateMany({
    where: { id, userId, readAt: null },
    data: { readAt: new Date() },
  });
}

// Keep at most `cap` notifications per user: find the id at position `cap`
// (newest-first) and delete everything at or below it. A no-op when under cap.
export async function pruneOverCap(userId: number, cap: number): Promise<void> {
  const boundary = await prisma.notification.findMany({
    where: { userId },
    orderBy: { id: 'desc' },
    skip: cap,
    take: 1,
    select: { id: true },
  });
  if (boundary.length > 0) {
    await prisma.notification.deleteMany({ where: { userId, id: { lte: boundary[0].id } } });
  }
}
