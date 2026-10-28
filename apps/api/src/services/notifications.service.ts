import * as repo from '../repositories/notifications.repository.js';
import { isUserOnline, pushToUser } from './ws-user.js';
import { COLLAPSIBLE_TYPES } from '@cyberstars/shared/notifications';
import type {
  NotificationData,
  NotificationDTO,
  NotificationsPage,
  NotificationType,
} from '@cyberstars/shared/notifications';
import type { AnnouncementDTO } from '@cyberstars/shared/admin';

// Deterministic per-user ceiling so the table cannot grow unbounded on the
// 1GB VPS; enforced best-effort on every insert.
const RETENTION_CAP = 100;

// Announcements are rare, so the admin page's history is the last 50, unpaged
const ANNOUNCEMENT_HISTORY = 50;

function shape(row: repo.NotificationRow): NotificationDTO {
  return {
    id: row.id,
    type: row.type,
    entityId: row.entityId,
    data: (row.data as NotificationData | null) ?? null,
    actor: row.actor ? { name: row.actor.name, avatarUrl: row.actor.avatarUrl } : null,
    readAt: row.readAt ? row.readAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  };
}

export interface NotifyInput {
  recipientIds: number[];
  actorId?: number;
  type: NotificationType;
  entityId: number;
  data?: NotificationData;
}

async function upsertFor(userId: number, input: NotifyInput): Promise<repo.NotificationRow> {
  if (COLLAPSIBLE_TYPES.has(input.type)) {
    const existing = await repo.findUnreadFor(userId, input.type, input.entityId);
    if (existing) {
      const prev = (existing.data as NotificationData | null) ?? {};
      const count = input.data?.count ?? (prev.count ?? 1) + 1;
      return repo.collapse(existing, input.actorId ?? null, { ...prev, ...input.data, count });
    }
  }
  return repo.create({
    userId,
    actorId: input.actorId ?? null,
    type: input.type,
    entityId: input.entityId,
    data: input.data,
  });
}

// Fan out a notification to each recipient (the actor is always excluded so no
// one is notified of their own action). Fire-and-forget: never throws, so a
// failure here can't fail the request that triggered it. Returns how many
// recipients got it.
export async function notify(input: NotifyInput): Promise<number> {
  const recipients = new Set(input.recipientIds.filter((id) => id !== input.actorId));
  let delivered = 0;
  for (const userId of recipients) {
    // Per-recipient isolation: one failing insert must not starve the rest
    // (e.g. a support event fanned out to several admins).
    try {
      const row = await upsertFor(userId, input);
      await repo.pruneOverCap(userId, RETENTION_CAP);
      const unreadCount = await repo.countUnread(userId);
      pushToUser(userId, { channel: 'notification', type: 'new', payload: shape(row) });
      pushToUser(userId, {
        channel: 'notification',
        type: 'unread-count',
        payload: { unreadCount },
      });
      delivered++;
    } catch (err) {
      console.error(`[notifications] notify failed for user ${userId}:`, err);
    }
  }
  return delivered;
}

// An official announcement for every account but the sender's: one insert
// instead of notify()'s loop, and only those online get it live. It skips the
// prune, the next notify() brings a user back under the cap. Unlike notify() it
// throws when the insert fails, so the admin knows it didn't go out
export async function announce(actorId: number, text: string): Promise<number> {
  const rows = await repo.createAnnouncement(actorId, text);
  for (const row of rows) {
    if (!isUserOnline(row.userId)) continue;
    try {
      const unreadCount = await repo.countUnread(row.userId);
      pushToUser(row.userId, { channel: 'notification', type: 'new', payload: shape(row) });
      pushToUser(row.userId, {
        channel: 'notification',
        type: 'unread-count',
        payload: { unreadCount },
      });
    } catch (err) {
      console.error(`[notifications] announce push failed for user ${row.userId}:`, err);
    }
  }
  return rows.length;
}

// The latest announcements, newest first, for the admin page
export async function listAnnouncements(): Promise<AnnouncementDTO[]> {
  const rows = await repo.listAnnouncements(ANNOUNCEMENT_HISTORY);
  return rows.map((row) => ({
    id: row.id,
    text: row.text,
    authorName: row.author?.name ?? null,
    createdAt: row.createdAt.toISOString(),
  }));
}

// Redaction hook for source-entity soft-deletes (forum post delete): drop the
// snapshotted excerpt from matching notifications, keyed by the snapshotted
// postId (content-based matching would miss posts edited after the snapshot).
// Fire-and-forget like notify; cleanup must never fail the delete that
// triggered it.
export async function redactExcerpt(
  type: NotificationType,
  entityId: number,
  postId: number,
): Promise<void> {
  try {
    await repo.clearExcerpt(type, entityId, postId);
  } catch (err) {
    console.error('[notifications] redactExcerpt failed:', err);
  }
}

export async function getPage(
  userId: number,
  take: number,
  before?: number,
): Promise<NotificationsPage> {
  const [rows, unreadCount] = await Promise.all([
    repo.list(userId, take, before),
    repo.countUnread(userId),
  ]);
  return { items: rows.map(shape), unreadCount };
}

// Push the authoritative unread count after a read mutation, so every tab of
// the user (including the one that made the request, whose optimistic zero may
// be wrong if it missed rows) converges on the true badge value.
async function pushUnreadCount(userId: number): Promise<void> {
  const unreadCount = await repo.countUnread(userId);
  pushToUser(userId, { channel: 'notification', type: 'unread-count', payload: { unreadCount } });
}

export async function markRead(userId: number, upToId: number): Promise<number> {
  const count = await repo.markReadUpTo(userId, upToId);
  await pushUnreadCount(userId);
  return count;
}

// Auto-read the notification tied to a source entity (e.g. responding to a
// connection request clears its CONNECTION_REQUEST bell entry). Pushes a fresh
// unread count so the badge updates live. Fire-and-forget; never throws.
export async function markEntityRead(
  userId: number,
  type: NotificationType,
  entityId: number,
): Promise<void> {
  try {
    const cleared = await repo.markReadByEntity(userId, type, entityId);
    if (cleared > 0) await pushUnreadCount(userId);
  } catch (err) {
    console.error('[notifications] markEntityRead failed:', err);
  }
}

export async function markOneRead(userId: number, id: number): Promise<void> {
  const count = await repo.markOneRead(userId, id);
  if (count > 0) await pushUnreadCount(userId);
}
