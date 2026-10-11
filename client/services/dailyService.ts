import { api } from './apiClient';
import type { DailyResponse } from '@cyberstars/shared/daily';

export function fetchDaily() {
  return api.get<DailyResponse>('/api/daily');
}
