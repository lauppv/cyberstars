import { api } from './apiClient';
import type { SolutionReveal, UsageSummary } from '@cyberstars/shared/usage';

export function getUsage(): Promise<UsageSummary> {
  return api.get<UsageSummary>('/api/usage');
}

// Spends a Show Solution reveal; resolves with the solution and the refreshed
// summary, or rejects (429) when the daily cap is already reached.
export function revealSolution(
  courseKey: string,
  lessonSlug: string,
  lang: 'en' | 'ro',
): Promise<SolutionReveal> {
  return api.post<SolutionReveal>(`/api/usage/solution/${courseKey}/${lessonSlug}`, { lang });
}
