import { api } from './apiClient';
import type { UsageSummary } from '../../shared/usage';

export function getUsage(): Promise<UsageSummary> {
  return api.get<UsageSummary>('/api/usage');
}

// Records a Show Solution reveal; resolves with the refreshed summary or rejects
// (429) when the daily cap is already reached.
export function consumeSolution(): Promise<UsageSummary> {
  return api.post<UsageSummary>('/api/usage/solution');
}
