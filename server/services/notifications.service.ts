import * as repo from '../repositories/notifications.repository.js';
import { pushToUser } from './ws-user.js';
import { COLLAPSIBLE_TYPES } from '../../shared/notifications.js';
import type {
  NotificationData,
  NotificationDTO,
  NotificationsPage,
  NotificationType,
} from '../../shared/notifications.js';

// Deterministic per-user ceiling so the table cannot grow unbounded on the
// 1GB VPS; enforced best-effort on every insert.
const RETENTION_CAP = 100;

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
      const count = (prev.count ?? 1) + 1;
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
// failure here can't fail the request that triggered it.
export async function notify(input: NotifyInput): Promise<void> {
  try {
    const recipients = new Set(input.recipientIds.filter((id) => id !== input.actorId));
    for (const userId of recipients) {
      const row = await upsertFor(userId, input);
      await repo.pruneOverCap(userId, RETENTION_CAP);
      const unreadCount = await repo.countUnread(userId);
      pushToUser(userId, { channel: 'notification', type: 'new', payload: shape(row) });
      pushToUser(userId, {
        channel: 'notification',
        type: 'unread-count',
        payload: { unreadCount },
      });
    }
  } catch (err) {
    console.error('[notifications] notify failed:', err);
  }
}

// Redaction hook for source-entity soft-deletes (forum post delete): drop the
// snapshotted excerpt from matching notifications. Fire-and-forget like notify —
// cleanup must never fail the delete that triggered it.
export async function redactExcerpt(
  type: NotificationType,
  entityId: number,
  excerpt: string,
): Promise<void> {
  try {
    await repo.clearExcerpt(type, entityId, excerpt);
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

export function markRead(userId: number, upToId: number): Promise<number> {
  return repo.markReadUpTo(userId, upToId);
}

// Auto-read the notification tied to a source entity (e.g. opening a DM
// conversation clears its DM_MESSAGE bell entry). Pushes a fresh unread count so
// the badge updates live. Fire-and-forget; never throws.
export async function markEntityRead(
  userId: number,
  type: NotificationType,
  entityId: number,
): Promise<void> {
  try {
    const cleared = await repo.markReadByEntity(userId, type, entityId);
    if (cleared > 0) {
      const unreadCount = await repo.countUnread(userId);
      pushToUser(userId, {
        channel: 'notification',
        type: 'unread-count',
        payload: { unreadCount },
      });
    }
  } catch (err) {
    console.error('[notifications] markEntityRead failed:', err);
  }
}

export function markOneRead(userId: number, id: number): Promise<void> {
  return repo.markOneRead(userId, id);
}
