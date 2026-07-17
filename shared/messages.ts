// DTOs for 1-to-1 direct messaging. The DB is the source of truth; the shared
// /ws/user socket only delivers these instantly when the recipient is online.

interface ConversationParticipant {
  id: number;
  name: string;
  avatarUrl: string | null;
}

export interface MessageDTO {
  id: number;
  conversationId: number;
  senderId: number;
  content: string; // replaced with a placeholder when `deleted`
  deleted: boolean;
  readAt: string | null;
  createdAt: string;
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
    };
