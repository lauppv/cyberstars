import { api } from './apiClient';
import type { PollDTO } from '@cyberstars/shared/polls';

export function getPoll(id: number) {
  return api.get<PollDTO>(`/api/polls/${id}`);
}

export function vote(id: number, optionIds: number[]) {
  return api.post<void>(`/api/polls/${id}/vote`, { optionIds });
}
