// DTOs for 1-to-1 direct messaging. The DB is the source of truth; the shared
// /ws/user socket only delivers these instantly when the recipient is online.

interface ConversationParticipant {
  id: number;
  name: string;
  avatarUrl: string | null;
}

// Raw per-user reaction rows; the client groups by emoji and derives `active`
// from its own user id, so the same payload works for both participants (no
// per-viewer shaping server-side, unlike the forum's grouped DTO).
export interface MessageReactionDTO {
  emoji: string;
  userId: number;
}

export interface MessageDTO {
  id: number;
  conversationId: number;
  senderId: number;
  content: string; // replaced with a placeholder when `deleted`
  deleted: boolean;
  readAt: string | null;
  createdAt: string;
  reactions: MessageReactionDTO[];
}

export interface ConversationDTO {
  id: number;
  other: ConversationParticipant;
  lastMessage: MessageDTO | null;
  unreadCount: number;
  updatedAt: string;
}

// Keyset-paginated history (newest-first by id); `hasMore` drives "load older".
export interface ConversationHistory {
  conversation: ConversationDTO;
  messages: MessageDTO[];
  hasMore: boolean;
}

// Frames pushed over the shared per-user socket (/ws/user) on the `dm` channel.
// `read` tells the other participant their messages were read up to an id.
export type DmSocketFrame =
  | { channel: 'dm'; type: 'message'; payload: MessageDTO }
  // Soft-delete redaction: the already-blanked DTO, so the deleted content
  // disappears from the other participant's screen without a refetch.
  | { channel: 'dm'; type: 'deleted'; payload: MessageDTO }
  | {
      channel: 'dm';
      type: 'read';
      payload: { conversationId: number; upToMessageId: number; readerId: number };
    }
  // A reaction was toggled: the full refreshed list for one message, pushed to
  // both participants (add and remove alike — the list is authoritative).
  | {
      channel: 'dm';
      type: 'reaction';
      payload: { conversationId: number; messageId: number; reactions: MessageReactionDTO[] };
    };
