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

// Fold a repeat event into an existing unread notification: newest actor wins,
// data (with bumped count) is replaced, createdAt bumps so it sorts to the top.
export function collapse(
  id: number,
  actorId: number | null,
  data: NotificationData,
): Promise<NotificationRow> {
  return prisma.notification.update({
    where: { id },
    data: { actorId, data: data as Prisma.InputJsonValue, createdAt: new Date() },
    include: actorInclude,
  });
}

export async function markReadUpTo(userId: number, upToId: number): Promise<number> {
  const res = await prisma.notification.updateMany({
    where: { userId, id: { lte: upToId }, readAt: null },
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
