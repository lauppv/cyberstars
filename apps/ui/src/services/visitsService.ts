import { api } from './apiClient';
import type {
  AdminVisitsDTO,
  GuestVisitsDTO,
  PageViewReport,
  StepsReport,
  VisitRange,
} from '@cyberstars/shared/visits';

export function reportPageView(report: PageViewReport) {
  return api.post<void>('/api/visits', report);
}

// keepalive lets the report finish when it's sent as the tab closes.
export function reportSteps(report: StepsReport) {
  return api.post<void>('/api/visits/steps', report, { keepalive: true });
}

export function getVisits(range: VisitRange) {
  return api.get<AdminVisitsDTO>(`/api/admin/visits?range=${range}`);
}

export function getGuestVisits(range: VisitRange, source?: string, before?: number) {
  const query = new URLSearchParams({ range: String(range) });
  if (source !== undefined) query.set('source', source);
  if (before !== undefined) query.set('before', String(before));
  return api.get<GuestVisitsDTO>(`/api/admin/visits/guests?${query}`);
}
