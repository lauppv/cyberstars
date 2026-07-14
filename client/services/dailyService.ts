import { api } from './apiClient';
import type { DailyResponse } from '../../shared/daily';

export function fetchDaily() {
  return api.get<DailyResponse>('/api/daily');
}
