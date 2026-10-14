import { api } from './apiClient';
import type { AdminVisitsDTO, PageViewReport, VisitRange } from '@cyberstars/shared/visits';

export function reportPageView(report: PageViewReport) {
  return api.post<void>('/api/visits', report);
}

export function getVisits(range: VisitRange) {
  return api.get<AdminVisitsDTO>(`/api/admin/visits?range=${range}`);
}
