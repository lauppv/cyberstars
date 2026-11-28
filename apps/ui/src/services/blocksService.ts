import { api } from './apiClient';
import type { BlockedUser } from '@cyberstars/shared/blocks';

export function getBlocked() {
  return api.get<{ users: BlockedUser[] }>('/api/blocks');
}

// Also ends any connection or pending request between the two
export function block(userId: number) {
  return api.put<{ ok: boolean }>(`/api/blocks/${userId}`);
}

export function unblock(userId: number) {
  return api.delete<{ ok: boolean }>(`/api/blocks/${userId}`);
}
