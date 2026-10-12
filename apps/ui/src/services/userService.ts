import { api } from './apiClient';
import type { PublicProfile } from '@cyberstars/shared/profile';

export function getPublicProfile(userId: number) {
  return api.get<PublicProfile>(`/api/users/${userId}/profile`);
}
