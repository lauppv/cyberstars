import { describe, it, expect, vi, beforeEach } from 'vitest';

const api = { get: vi.fn(), post: vi.fn() };
vi.mock('./apiClient', () => ({ api }));

const { reportSteps, getGuestVisits } = await import('./visitsService');

beforeEach(() => vi.clearAllMocks());

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
