import type { DmSocketFrame } from './messages.js';

export type NotificationType =
  | 'FORUM_REPLY'
  | 'FORUM_SOLUTION'
  | 'FORUM_REACTION'
  | 'DM_MESSAGE'
  | 'SUPPORT_TICKET_NEW'
  | 'SUPPORT_REPLY'
  | 'SUPPORT_STATUS';

// Snapshot of the source entity, taken at creation time so the list renders
// without N+1 joins and survives deletion of that entity (forum soft-delete, DM
// cascade). The actor's name/avatar are NOT snapshotted — they come from the
// `actor` relation (single source of truth), which SetNulls to null if the
// actor is later deleted.
export interface NotificationData {
  title?: string; // thread title / ticket subject
  excerpt?: string;
  count?: number; // collapsed count for FORUM_REPLY / DM_MESSAGE
  categorySlug?: string; // forum deep-link
  status?: string; // new ticket status for SUPPORT_STATUS
}

interface NotificationActor {
  name: string;
  avatarUrl: string | null;
}

export interface NotificationDTO {
  id: number;
  type: NotificationType;
  entityId: number; // threadId / conversationId / ticketId, interpreted by type
  data: NotificationData | null;
  actor: NotificationActor | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationsPage {
  items: NotificationDTO[];
  unreadCount: number;
}

// Frames pushed over the shared per-user socket (/ws/user). The socket carries
// both notification frames and messaging's `dm` frames — one connection, demuxed
// client-side on `channel`.
export type UserSocketFrame =
  | { channel: 'notification'; type: 'new'; payload: NotificationDTO }
  | { channel: 'notification'; type: 'unread-count'; payload: { unreadCount: number } }
  | DmSocketFrame;
