import type { DmSocketFrame } from './messages.js';

export type NotificationType =
  | 'FORUM_REPLY'
  | 'FORUM_SOLUTION'
  | 'SUPPORT_TICKET_NEW'
  | 'SUPPORT_REPLY'
  | 'SUPPORT_STATUS'
  | 'CONNECTION_REQUEST'
  | 'CONNECTION_ACCEPTED'
  | 'LANIAKEA_RECAP'
  | 'ANNOUNCEMENT'
  | 'POLL'
  | 'POLL_ANSWER';

// The longest official announcement an admin can send
export const ANNOUNCEMENT_MAX_LENGTH = 2000;

// Repeat events on the same entity fold into one unread row instead of
// spamming; the server collapses on insert. An event that carries its own
// count, like the open Laniakea recaps, replaces the old count instead of
// adding one to it. None of them is a bell row, so the client only ever sees
// the counts they make
export const COLLAPSIBLE_TYPES: ReadonlySet<NotificationType> = new Set([
  'FORUM_REPLY',
  'LANIAKEA_RECAP',
]);

// The bell keeps only what comes from the team: announcements, polls, and the
// written poll answers the admins read. Everything else belongs to a page and
// shows as a count on that page's sidebar row
export const BELL_TYPES = ['ANNOUNCEMENT', 'POLL', 'POLL_ANSWER'] as const;
export type BellNotificationType = (typeof BELL_TYPES)[number];

export function isBellType(type: NotificationType): type is BellNotificationType {
  return (BELL_TYPES as readonly NotificationType[]).includes(type);
}

// The sidebar rows that count their own notifications, and which types each
// one counts. Every type is in the bell or in exactly one of these
export type NotificationSection = 'forum' | 'support' | 'connections' | 'laniakea';

export const SECTION_TYPES: Record<NotificationSection, readonly NotificationType[]> = {
  forum: ['FORUM_REPLY', 'FORUM_SOLUTION'],
  support: ['SUPPORT_TICKET_NEW', 'SUPPORT_REPLY', 'SUPPORT_STATUS'],
  connections: ['CONNECTION_REQUEST', 'CONNECTION_ACCEPTED'],
  laniakea: ['LANIAKEA_RECAP'],
};

export const NOTIFICATION_SECTIONS = Object.keys(SECTION_TYPES) as NotificationSection[];

// A thread or a ticket with something unread, newest first; its title is the
// one snapshotted when the notification was made
export interface SectionEntity {
  entityId: number;
  title: string;
}

// What each sidebar row has unread. The forum and support list their threads
// and tickets, so the page can point at them; connections count the unread
// requests and acceptances; laniakea is how many recaps the notification told
// of, 0 once read
export interface UnreadSections {
  forum: SectionEntity[];
  support: SectionEntity[];
  connections: number;
  laniakea: number;
}

export const EMPTY_SECTIONS: UnreadSections = {
  forum: [],
  support: [],
  connections: 0,
  laniakea: 0,
};

// What the admins and the founder send to everyone, which the dashboard opens
// in a window as well as listing it in the bell
export const NOTICE_TYPES: readonly NotificationType[] = ['ANNOUNCEMENT', 'POLL'];

// The most the window opens with at once, and marks shown, so a long backlog
// can't make the shown mark fail and bring the window back every time
export const NOTICES_MAX = 100;

// Snapshot of the source entity, taken at creation time so the list renders
// without N+1 joins and survives deletion of that entity (forum soft-delete, DM
// cascade). The actor's name/avatar are NOT snapshotted; they come from the
// `actor` relation (single source of truth), which SetNulls to null if the
// actor is later deleted.
export interface NotificationData {
  title?: string; // thread title / ticket subject / the poll's question for POLL_ANSWER
  excerpt?: string;
  postId?: number; // forum post the excerpt was snapshotted from (redaction key)
  count?: number; // collapsed count for COLLAPSIBLE_TYPES, open recaps for LANIAKEA_RECAP
  categorySlug?: string; // forum deep-link
  status?: string; // new ticket status for SUPPORT_STATUS
  text?: string; // the whole announcement for ANNOUNCEMENT, the question for POLL, what was written for POLL_ANSWER
}

interface NotificationActor {
  name: string;
  avatarUrl: string | null;
}

export interface NotificationDTO {
  id: number;
  type: NotificationType;
  entityId: number; // threadId / conversationId / ticketId / announcement id / poll id (POLL, POLL_ANSWER), interpreted by type; 0 for LANIAKEA_RECAP
  data: NotificationData | null;
  actor: NotificationActor | null;
  readAt: string | null;
  createdAt: string;
}

// One page of the bell; unreadCount is the bell's own, sections are the
// sidebar's
export interface NotificationsPage {
  items: NotificationDTO[];
  unreadCount: number;
  sections: UnreadSections;
}

export interface UnreadState {
  unreadCount: number;
  sections: UnreadSections;
}

// Frames pushed over the shared per-user socket (/ws/user). The socket carries
// both notification frames and messaging's `dm` frames: one connection, demuxed
// client-side on `channel`.
export type UserSocketFrame =
  | { channel: 'notification'; type: 'new'; payload: NotificationDTO }
  | { channel: 'notification'; type: 'unread-count'; payload: UnreadState }
  | DmSocketFrame;
