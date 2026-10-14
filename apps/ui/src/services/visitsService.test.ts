import { describe, it, expect, vi, beforeEach } from 'vitest';

const api = { get: vi.fn(), post: vi.fn() };
vi.mock('./apiClient', () => ({ api }));

const { reportPageView, reportSteps, getVisits, getGuestVisits } = await import('./visitsService');

beforeEach(() => vi.clearAllMocks());

describe('reportPageView and getVisits', () => {
  it('post the page and ask for the range', async () => {
    await reportPageView({ path: '/' });
    await getVisits(90);
    expect(api.post).toHaveBeenCalledWith('/api/visits', { path: '/' });
    expect(api.get).toHaveBeenCalledWith('/api/admin/visits?range=90');
  });
});

describe('reportSteps', () => {
  it('sends the steps so they still arrive when the tab closes', async () => {
    const report = { steps: [{ kind: 'click' as const, target: 'run' }] };
    await reportSteps(report);
    expect(api.post).toHaveBeenCalledWith('/api/visits/steps', report, { keepalive: true });
  });
});

describe('getGuestVisits', () => {
  it('asks for the range, and the source and start only when given', async () => {
    await getGuestVisits(30);
    await getGuestVisits(90, 'reddit', 41);
    expect(api.get).toHaveBeenNthCalledWith(1, '/api/admin/visits/guests?range=30');
    expect(api.get).toHaveBeenNthCalledWith(
      2,
      '/api/admin/visits/guests?range=90&source=reddit&before=41',
    );
  });
});
