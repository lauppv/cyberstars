import { api } from './apiClient';
import type {
  SupportTicketDTO,
  SupportMessageDTO,
  CreateTicketRequest,
  TicketStatus,
} from '../../shared/support';

export function createTicket(data: CreateTicketRequest) {
  return api.post<{ ticketId: number }>('/api/support/tickets', data);
}

export function getMyTickets() {
  return api.get<SupportTicketDTO[]>('/api/support/tickets/mine');
}

export function getAllTickets() {
  return api.get<SupportTicketDTO[]>('/api/support/tickets');
}

export function updateTicketStatus(id: number, status: TicketStatus) {
  return api.put<{ ok: boolean }>(`/api/support/tickets/${id}/status`, { status });
}

export function getTicketMessages(id: number) {
  return api.get<SupportMessageDTO[]>(`/api/support/tickets/${id}/messages`);
}

export function addTicketMessage(id: number, message: string) {
  return api.post<{ ok: boolean }>(`/api/support/tickets/${id}/messages`, { message });
}
