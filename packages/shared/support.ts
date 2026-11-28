export type TicketType = 'BUG' | 'QUESTION' | 'RULE_VIOLATION' | 'FEEDBACK' | 'ACCOUNT' | 'OTHER';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

/** A ticket's subject, as long as its column holds. */
export const SUPPORT_SUBJECT_MAX_LENGTH = 200;

/**
 * A ticket's first message or a reply. Room for a long bug report, and for a
 * feedback note with a Laniakea question added under it.
 */
export const SUPPORT_MESSAGE_MAX_LENGTH = 5000;

export interface SupportTicketDTO {
  id: number;
  type: TicketType;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  /** Present only in the admin-wide listing. */
  authorName?: string;
  authorEmail?: string;
}

export interface SupportMessageDTO {
  id: number;
  userId: number;
  authorName: string;
  isAdmin: boolean;
  message: string;
  createdAt: string;
}

export interface CreateTicketRequest {
  type: TicketType;
  subject: string;
  message: string;
}
