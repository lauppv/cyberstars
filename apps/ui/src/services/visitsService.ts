import { api } from './apiClient';
import type { PageViewReport } from '@cyberstars/shared/visits';

export function reportPageView(report: PageViewReport) {
  return api.post<void>('/api/visits', report);
}
