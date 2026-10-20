import { api } from './apiClient';

// Whether the Run Tests or terminal command sent with this id is waiting in a
// line for a free sandbox rather than running
export function isRunWaiting(runId: string): Promise<{ waiting: boolean }> {
  return api.get<{ waiting: boolean }>(`/api/runs/${runId}/waiting`);
}
