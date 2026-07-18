import { api } from './apiClient';
import type { ConnectionsOverview } from '../../shared/connections';

export function getOverview() {
  return api.get<ConnectionsOverview>('/api/connections');
}

export function sendRequest(addresseeId: number) {
  return api.post<{ ok: boolean }>('/api/connections', { addresseeId });
}

export function accept(connectionId: number) {
  return api.post<{ ok: boolean }>(`/api/connections/${connectionId}/accept`);
}

export function decline(connectionId: number) {
  return api.post<{ ok: boolean }>(`/api/connections/${connectionId}/decline`);
}

// Cancels a pending request the caller sent, or removes an accepted connection.
export function remove(connectionId: number) {
  return api.delete<{ ok: boolean }>(`/api/connections/${connectionId}`);
}
