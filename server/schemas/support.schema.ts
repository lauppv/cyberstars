import { z } from "zod";

export const createTicketSchema = z.object({
  type: z.enum(["BUG", "QUESTION", "RULE_VIOLATION", "FEEDBACK", "ACCOUNT", "OTHER"]),
  subject: z.string().min(1, "Subject is required").max(200, "Subject is too long (max 200 chars)"),
  message: z.string().min(1, "Message is required"),
});

export const addMessageSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});
