import { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';
import {
  BELL_TYPES,
  NOTICE_TYPES,
  NOTICES_MAX,
  SECTION_TYPES,
} from '@cyberstars/shared/notifications';
import type { NotificationData, NotificationType } from '@cyberstars/shared/notifications';

export const actorInclude = { actor: { select: { name: true, avatarUrl: true } } };

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

const SECTION_TYPE_LIST = Object.values(SECTION_TYPES).flat();

// The bell's rows only; the rest are counted on the sidebar
export function list(userId: number, take: number, before?: number): Promise<NotificationRow[]> {
  return prisma.notification.findMany({
    where: { userId, type: { in: [...BELL_TYPES] }, ...(before ? { id: { lt: before } } : {}) },
    orderBy: { id: 'desc' },
    take,
    include: actorInclude,
  });
}

// The announcements and polls this user hasn't read and the dashboard hasn't
// shown, the oldest first and at most NOTICES_MAX, but a poll they voted in
// already, from another device too. Those are left out by the query, before
// the limit, so they can't fill it and hold back the newer ones
export async function listNotices(userId: number): Promise<NotificationRow[]> {
  const voted = await prisma.pollVoter.findMany({ where: { userId }, select: { pollId: true } });
  return prisma.notification.findMany({
    where: {
      userId,
      readAt: null,
      shownAt: null,
      type: { in: [...NOTICE_TYPES] },
      NOT: { type: 'POLL', entityId: { in: voted.map((v) => v.pollId) } },
    },
    orderBy: { id: 'asc' },
    take: NOTICES_MAX,
    include: actorInclude,
  });
}

// The dashboard's window showed these, so it doesn't open with them again.
// Scoped by userId, and to announcements and polls
export async function markShown(userId: number, ids: number[]): Promise<number> {
  const res = await prisma.notification.updateMany({
    where: { userId, id: { in: ids }, type: { in: [...NOTICE_TYPES] }, shownAt: null },
    data: { shownAt: new Date() },
  });
  return res.count;
}

// What the bell has unread
export function countUnread(userId: number): Promise<number> {
  return prisma.notification.count({
    where: { userId, readAt: null, type: { in: [...BELL_TYPES] } },
  });
}

export type UnreadSectionRow = Prisma.NotificationGetPayload<{
  select: { type: true; entityId: true; data: true };
}>;

// Every unread row the sidebar counts, newest first. Bounded by the per-user
// retention cap, so it never grows past that
export function listUnreadSections(userId: number): Promise<UnreadSectionRow[]> {
  return prisma.notification.findMany({
    where: { userId, readAt: null, type: { in: SECTION_TYPE_LIST } },
    orderBy: { id: 'desc' },
    select: { type: true, entityId: true, data: true },
  });
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

// The announcement and a bell row of it for every account but the author's, in
// one insert and one transaction, so the history never lists one nobody got
export function createAnnouncement(authorId: number, text: string): Promise<NotificationRow[]> {
  return prisma.$transaction(async (tx) => {
    const { id } = await tx.announcement.create({
      data: { authorId, text },
      select: { id: true },
    });
    const users = await tx.user.findMany({
      where: { id: { not: authorId } },
      select: { id: true },
    });
    return tx.notification.createManyAndReturn({
      data: users.map((u) => ({
        userId: u.id,
        actorId: authorId,
        type: 'ANNOUNCEMENT' as const,
        entityId: id,
        data: { text },
      })),
      include: actorInclude,
    });
  });
}

export function listAnnouncements(take: number) {
  return prisma.announcement.findMany({
    orderBy: { id: 'desc' },
    take,
    include: { author: { select: { name: true } } },
  });
}

// Fold a repeat event into a REPLACEMENT of the existing unread notification:
// the stale row is deleted and a fresh one inserted (newest actor wins, data
// with bumped count). The replacement gets a NEW id, which keeps `id desc`
// ordering (and the client's keyset pagination) monotonic with recency; an
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
// Rows are matched by the snapshotted postId (stable across edits), so only
// notifications whose excerpt came from THIS post are touched. A collapsed row
// re-snapshotted by a newer reply carries that reply's postId and keeps its
// (still-live) excerpt. updateMany per id so a concurrent prune can't throw.
export async function clearExcerpt(
  type: NotificationType,
  entityId: number,
  postId: number,
): Promise<void> {
  const rows = await prisma.notification.findMany({
    where: { type, entityId, data: { path: ['postId'], equals: postId } },
    select: { id: true, data: true },
  });
  await Promise.all(
    rows.map((row) => {
      const { excerpt: _dropped, postId: _key, ...rest } = row.data as Record<string, unknown>;
      return prisma.notification.updateMany({
        where: { id: row.id },
        data: { data: rest as Prisma.InputJsonValue },
      });
    }),
  );
}

// The bell's "mark all read", so it leaves the sidebar's counts alone
export async function markReadUpTo(userId: number, upToId: number): Promise<number> {
  const res = await prisma.notification.updateMany({
    where: { userId, id: { lte: upToId }, readAt: null, type: { in: [...BELL_TYPES] } },
    data: { readAt: new Date() },
  });
  return res.count;
}

// Mark every unread notification for a given source entity read (e.g. the
// CONNECTION_REQUEST for a request, when it is responded to). Returns how many.
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

// Mark a sidebar section read: all of it, or only what is about one thread or
// ticket. Scoped by userId and to the section's types
export async function markSectionRead(
  userId: number,
  types: readonly NotificationType[],
  entityId?: number,
): Promise<number> {
  const res = await prisma.notification.updateMany({
    where: {
      userId,
      type: { in: [...types] },
      readAt: null,
      ...(entityId !== undefined ? { entityId } : {}),
    },
    data: { readAt: new Date() },
  });
  return res.count;
}

export async function markOneRead(userId: number, id: number): Promise<number> {
  // Scoped by userId so a caller can only mark their own notifications read.
  const res = await prisma.notification.updateMany({
    where: { id, userId, readAt: null },
    data: { readAt: new Date() },
  });
  return res.count;
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
