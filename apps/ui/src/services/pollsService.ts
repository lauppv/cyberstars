import { api } from './apiClient';
import type { PollDTO } from '@cyberstars/shared/polls';

export function getPoll(id: number) {
  return api.get<PollDTO>(`/api/polls/${id}`);
}

// An answer only with the poll's Other among the options
export function vote(id: number, optionIds: number[], answer?: string) {
  return api.post<void>(`/api/polls/${id}/vote`, { optionIds, answer });
}
