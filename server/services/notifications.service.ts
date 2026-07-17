import * as repo from '../repositories/notifications.repository.js';
import { pushToUser } from './ws-user.js';
import type {
  NotificationData,
  NotificationDTO,
  NotificationsPage,
  NotificationType,
} from '../../shared/notifications.js';

// Deterministic per-user ceiling so the table cannot grow unbounded on the
// 1GB VPS; enforced best-effort on every insert.
const RETENTION_CAP = 100;
// Repeat events on the same entity fold into one unread row instead of spamming.
const COLLAPSIBLE = new Set<NotificationType>(['FORUM_REPLY', 'DM_MESSAGE']);

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
  if (COLLAPSIBLE.has(input.type)) {
    const existing = await repo.findUnreadFor(userId, input.type, input.entityId);
    if (existing) {
      const prev = (existing.data as NotificationData | null) ?? {};
      const count = (prev.count ?? 1) + 1;
      return repo.collapse(existing.id, input.actorId ?? null, { ...prev, ...input.data, count });
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

export function markOneRead(userId: number, id: number): Promise<void> {
  return repo.markOneRead(userId, id);
}
