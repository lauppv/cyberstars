import { api } from './apiClient';
import type { AdminStatsDTO } from '@cyberstars/shared/admin';

export function getStats(force = false) {
  return api.get<AdminStatsDTO>(`/api/admin/stats${force ? '?fresh=1' : ''}`);
}
