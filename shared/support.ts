export type TicketType =
  | "BUG"
  | "QUESTION"
  | "RULE_VIOLATION"
  | "FEEDBACK"
  | "ACCOUNT"
  | "OTHER";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

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
