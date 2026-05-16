import { api } from "./apiClient";
import type {
  SupportTicketDTO,
  CreateTicketRequest,
  TicketStatus,
} from "../../shared/support";

export function createTicket(data: CreateTicketRequest) {
  return api.post<{ ticketId: number }>("/api/support/tickets", data);
}

export function getMyTickets() {
  return api.get<SupportTicketDTO[]>("/api/support/tickets/mine");
}

export function getAllTickets() {
  return api.get<SupportTicketDTO[]>("/api/support/tickets");
}

export function updateTicketStatus(id: number, status: TicketStatus) {
  return api.put<{ ok: boolean }>(`/api/support/tickets/${id}/status`, { status });
}
