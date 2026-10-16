import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockRepo = {
  addVisit: vi.fn(),
  saltFor: vi.fn(),
  rollUpBefore: vi.fn(),
  totalsSince: vi.fn(),
  newAccountsSince: vi.fn(),
  guestVisitFor: vi.fn(),
  guestVisitId: vi.fn(),
  countSteps: vi.fn(),
  addSteps: vi.fn(),
  topClicksSince: vi.fn(),
  placementStepsSince: vi.fn(),
  guestVisitsSince: vi.fn(),
};
vi.mock('../repositories/visits.repository.js', () => mockRepo);

const service = await import('./visits.service.js');

const BROWSER = 'Mozilla/5.0 (X11; Linux x86_64) Firefox/131.0';

beforeEach(() => {
  vi.clearAllMocks();
  mockRepo.saltFor.mockResolvedValue('salt');
  mockRepo.addVisit.mockResolvedValue(undefined);
  mockRepo.rollUpBefore.mockResolvedValue(undefined);
  mockRepo.guestVisitFor.mockResolvedValue(7);
  mockRepo.guestVisitId.mockResolvedValue(7);
  mockRepo.countSteps.mockResolvedValue(0);
  mockRepo.topClicksSince.mockResolvedValue([]);
  mockRepo.placementStepsSince.mockResolvedValue([]);
});

afterEach(() => vi.useRealTimers());

describe('today', () => {
  it('goes by Romania, so 22:30 UTC is already the next day there', () => {
    expect(service.today(new Date('2026-10-14T22:30:00Z'))).toBe('2026-10-15');
    expect(service.today(new Date('2026-10-14T20:30:00Z'))).toBe('2026-10-14');
  });
});

describe('isBot', () => {
  it.each([
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; bingbot/2.0)',
    'Mozilla/5.0 HeadlessChrome/120.0',
    'curl/8.5.0',
    'python-requests/2.31',
  ])('leaves out %s', (ua) => {
    expect(service.isBot(ua)).toBe(true);
  });

  it('leaves out a request with no user agent at all', () => {
    expect(service.isBot(undefined)).toBe(true);
  });

  it('counts an ordinary browser', () => {
    expect(service.isBot(BROWSER)).toBe(false);
  });
});

describe('sourceOf', () => {
  it('is null for a page opened inside the app', () => {
    expect(service.sourceOf(undefined)).toBeNull();
  });

  it('is direct when the browser sent no referrer', () => {
    expect(service.sourceOf('')).toBe('direct');
  });

  it.each([
    ['www.google.com', 'google'],
    ['google.ro', 'google'],
    ['www.bing.com', 'bing'],
    ['old.reddit.com', 'reddit'],
    ['news.ycombinator.com', 'hackernews'],
    ['dev.to', 'devto'],
    ['GitHub.com', 'github'],
  ])('names %s as %s', (referrer, source) => {
    expect(service.sourceOf(referrer)).toBe(source);
  });

  it('keeps any other site by its domain', () => {
    expect(service.sourceOf('www.example.org')).toBe('example.org');
  });

  it('files a domain too long to store under other', () => {
    const long = `${'a'.repeat(60)}.${'b'.repeat(60)}.com`;
    expect(service.sourceOf(long)).toBe('other');
    expect(service.sourceOf(`${'a'.repeat(96)}.com`)).toBe(`${'a'.repeat(96)}.com`);
  });

  it('files something that is not a domain under other', () => {
    expect(service.sourceOf('<script>')).toBe('other');
  });
});

describe('recordPageView', () => {
  it('stores a hash of the salt, IP and browser, never the IP itself', async () => {
    await service.recordPageView({ path: '/courses' }, '203.0.113.7', BROWSER, false);
    const row = mockRepo.addVisit.mock.calls[0][0];
    expect(row.visitor).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(row)).not.toContain('203.0.113.7');
    expect(row).toMatchObject({ path: '/courses', source: null, signedIn: false, lang: 'en' });
  });

  it('gives the same visitor the same hash, and another IP another one', async () => {
    await service.recordPageView({ path: '/' }, '203.0.113.7', BROWSER, false);
    await service.recordPageView({ path: '/courses' }, '203.0.113.7', BROWSER, false);
    await service.recordPageView({ path: '/' }, '198.51.100.1', BROWSER, false);
    const [a, b, c] = mockRepo.addVisit.mock.calls.map((call) => call[0].visitor);
    expect(a).toBe(b);
    expect(c).not.toBe(a);
  });

  it('counts a Romanian page as its English twin, in Romanian', async () => {
    await service.recordPageView({ path: '/ro/courses/python' }, '1.1.1.1', BROWSER, true);
    await service.recordPageView({ path: '/ro' }, '1.1.1.1', BROWSER, true);
    expect(mockRepo.addVisit.mock.calls[0][0]).toMatchObject({
      path: '/courses/python',
      lang: 'ro',
      signedIn: true,
    });
    expect(mockRepo.addVisit.mock.calls[1][0]).toMatchObject({ path: '/', lang: 'ro' });
  });

  it('keeps where the visit came from', async () => {
    await service.recordPageView(
      { path: '/', referrer: 'news.ycombinator.com' },
      '1.1.1.1',
      BROWSER,
      false,
    );
    expect(mockRepo.addVisit.mock.calls[0][0].source).toBe('hackernews');
  });

  it('records nothing for a bot', async () => {
    await service.recordPageView({ path: '/' }, '1.1.1.1', 'Googlebot/2.1', false);
    expect(mockRepo.addVisit).not.toHaveBeenCalled();
  });

  it('asks for the salt once a day, and again once the day changes', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-01T10:00:00Z'));
    await service.recordPageView({ path: '/' }, '1.1.1.1', BROWSER, false);
    await service.recordPageView({ path: '/' }, '1.1.1.1', BROWSER, false);
    expect(mockRepo.saltFor).toHaveBeenCalledTimes(1);
    expect(mockRepo.saltFor.mock.calls[0][0]).toEqual(new Date('2026-11-01T00:00:00Z'));

    vi.setSystemTime(new Date('2026-11-02T10:00:00Z'));
    await service.recordPageView({ path: '/' }, '1.1.1.1', BROWSER, false);
    expect(mockRepo.saltFor).toHaveBeenCalledTimes(2);
  });

  it('asks again after the salt could not be read', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-05T10:00:00Z'));
    mockRepo.saltFor.mockRejectedValueOnce(new Error('db down'));
    await expect(service.recordPageView({ path: '/' }, '1.1.1.1', BROWSER, false)).rejects.toThrow(
      'db down',
    );
    await service.recordPageView({ path: '/' }, '1.1.1.1', BROWSER, false);
    expect(mockRepo.saltFor).toHaveBeenCalledTimes(2);
    expect(mockRepo.addVisit).toHaveBeenCalledTimes(1);
  });
});

describe('guest steps', () => {
  const run = { kind: 'click', target: 'run' } as const;
  const deep = { kind: 'scroll', target: '75' } as const;

  it("makes the visit on a guest's page and adds the page after the steps that led to it", async () => {
    await service.recordPageView(
      { path: '/ro/courses', referrer: 'old.reddit.com', steps: [deep, run] },
      '1.1.1.1',
      BROWSER,
      false,
    );
    expect(mockRepo.guestVisitFor).toHaveBeenCalledWith(
      expect.any(Date),
      expect.stringMatching(/^[0-9a-f]{64}$/),
      'reddit',
      'ro',
    );
    expect(mockRepo.addSteps).toHaveBeenCalledWith(7, [
      deep,
      run,
      { kind: 'page', target: '/courses' },
    ]);
  });

  it('gives a signed-in page no step, and looks for no visit when nothing came with it', async () => {
    await service.recordPageView({ path: '/' }, '1.1.1.1', BROWSER, true);
    expect(mockRepo.guestVisitFor).not.toHaveBeenCalled();
    expect(mockRepo.guestVisitId).not.toHaveBeenCalled();
    expect(mockRepo.addSteps).not.toHaveBeenCalled();
  });

  it('adds what a guest pressed before making an account to the visit they had', async () => {
    await service.recordPageView({ path: '/', steps: [run] }, '1.1.1.1', BROWSER, true);
    expect(mockRepo.guestVisitFor).not.toHaveBeenCalled();
    expect(mockRepo.addSteps).toHaveBeenCalledWith(7, [run]);
  });

  it("adds steps on their own to today's visit, and drops them when there is none", async () => {
    await service.recordSteps({ steps: [run] }, '1.1.1.1', BROWSER);
    expect(mockRepo.addSteps).toHaveBeenCalledWith(7, [run]);

    mockRepo.guestVisitId.mockResolvedValueOnce(null);
    await service.recordSteps({ steps: [run] }, '1.1.1.1', BROWSER);
    expect(mockRepo.addSteps).toHaveBeenCalledTimes(1);
  });

  it('records no steps for a bot', async () => {
    await service.recordSteps({ steps: [run] }, '1.1.1.1', 'Googlebot/2.1');
    expect(mockRepo.guestVisitId).not.toHaveBeenCalled();
  });

  it('stops a visit at 500 steps', async () => {
    mockRepo.countSteps.mockResolvedValueOnce(499);
    await service.recordSteps({ steps: [run, run] }, '1.1.1.1', BROWSER);
    expect(mockRepo.addSteps).toHaveBeenCalledWith(7, [run]);

    mockRepo.countSteps.mockResolvedValueOnce(500);
    await service.recordSteps({ steps: [run] }, '1.1.1.1', BROWSER);
    expect(mockRepo.addSteps).toHaveBeenCalledTimes(1);
  });
});

describe('rollUp', () => {
  it('rolls up every day before today and keeps guest visits for 90 days', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-01T23:30:00Z')); // already Nov 2 in Romania
    await service.rollUp();
    expect(mockRepo.rollUpBefore).toHaveBeenCalledWith(
      new Date('2026-11-02T00:00:00Z'),
      new Date('2026-08-05T00:00:00Z'), // the first of the 90 days up to Nov 2
    );
  });
});

describe('scheduleRollUp', () => {
  it('runs at once and then every hour, and only logs a failure', async () => {
    vi.useFakeTimers();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockRepo.rollUpBefore.mockRejectedValueOnce(new Error('db down'));
    const timer = service.scheduleRollUp();
    await vi.advanceTimersByTimeAsync(0);
    expect(mockRepo.rollUpBefore).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('[visits] roll-up failed:', expect.any(Error));

    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);
    expect(mockRepo.rollUpBefore).toHaveBeenCalledTimes(2);
    clearInterval(timer);
    error.mockRestore();
  });
});

describe('report', () => {
  const day = (d: string) => new Date(`${d}T00:00:00Z`);

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-30T12:00:00Z'));
  });

  it('gives one row per day of the range, oldest first, with gaps as zeros', async () => {
    mockRepo.totalsSince.mockResolvedValue([
      { day: day('2026-11-30'), dimension: 'all', key: '', visitors: 4, views: 9 },
      { day: day('2026-11-28'), dimension: 'all', key: '', visitors: 2, views: 3 },
    ]);
    mockRepo.newAccountsSince.mockResolvedValue([{ day: day('2026-11-30'), count: 1 }]);

    const dto = await service.report(30);

    expect(mockRepo.totalsSince).toHaveBeenCalledWith(day('2026-11-01'));
    expect(dto.range).toBe(30);
    expect(dto.days).toHaveLength(30);
    expect(dto.days[0]).toEqual({ day: '2026-11-01', visitors: 0, views: 0, newAccounts: 0 });
    expect(dto.days[27]).toEqual({ day: '2026-11-28', visitors: 2, views: 3, newAccounts: 0 });
    expect(dto.days[29]).toEqual({ day: '2026-11-30', visitors: 4, views: 9, newAccounts: 1 });
  });

  it('adds each page, source, guest/signed-in and language up across days', async () => {
    mockRepo.totalsSince.mockResolvedValue([
      { day: day('2026-11-29'), dimension: 'page', key: '/courses', visitors: 2, views: 3 },
      { day: day('2026-11-30'), dimension: 'page', key: '/courses', visitors: 1, views: 1 },
      { day: day('2026-11-30'), dimension: 'page', key: '/', visitors: 5, views: 6 },
      { day: day('2026-11-30'), dimension: 'source', key: 'reddit', visitors: 1, views: 1 },
      { day: day('2026-11-30'), dimension: 'source', key: 'google', visitors: 3, views: 3 },
      { day: day('2026-11-30'), dimension: 'auth', key: 'guest', visitors: 5, views: 7 },
      { day: day('2026-11-30'), dimension: 'lang', key: 'ro', visitors: 2, views: 2 },
    ]);
    mockRepo.newAccountsSince.mockResolvedValue([]);

    const dto = await service.report(90);

    expect(mockRepo.totalsSince).toHaveBeenCalledWith(day('2026-09-02'));
    expect(dto.pages).toEqual([
      { key: '/', visitors: 5, views: 6 },
      { key: '/courses', visitors: 3, views: 4 },
    ]);
    expect(dto.sources.map((s) => s.key)).toEqual(['google', 'reddit']);
    expect(dto.auth).toEqual([{ key: 'guest', visitors: 5, views: 7 }]);
    expect(dto.lang).toEqual([{ key: 'ro', visitors: 2, views: 2 }]);
  });

  it('passes on the most pressed buttons', async () => {
    mockRepo.totalsSince.mockResolvedValue([]);
    mockRepo.newAccountsSince.mockResolvedValue([]);
    mockRepo.topClicksSince.mockResolvedValue([{ key: 'run', visitors: 2, views: 5 }]);

    const dto = await service.report(30);

    expect(mockRepo.topClicksSince).toHaveBeenCalledWith(day('2026-11-01'), 10);
    expect(dto.clicks).toEqual([{ key: 'run', visitors: 2, views: 5 }]);
  });

  it('lines the placement test up from its page to Get started', async () => {
    mockRepo.totalsSince.mockResolvedValue([]);
    mockRepo.newAccountsSince.mockResolvedValue([]);
    mockRepo.placementStepsSince.mockResolvedValue([
      { key: 'opened', visitors: 9 },
      { key: 'placement-start', visitors: 6 },
      { key: 'placement-q1', visitors: 5 },
      { key: 'placement-q2', visitors: 4 },
      { key: 'placement-submit', visitors: 2 },
      { key: 'placement-get-started', visitors: 1 },
    ]);

    const dto = await service.report(30);

    expect(mockRepo.placementStepsSince).toHaveBeenCalledWith(day('2026-11-01'));
    expect(dto.placement).toEqual({
      opened: 9,
      started: 6,
      answered: [5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      getStarted: 1,
    });
  });
});

describe('guestVisits', () => {
  const row = (id: number) => ({
    id,
    day: new Date('2026-11-30T00:00:00Z'),
    startedAt: new Date('2026-11-30T09:41:00Z') as Date | null,
    source: 'reddit',
    lang: 'en',
    steps: [{ kind: 'page', target: '/' }],
  });

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-30T12:00:00Z'));
  });

  it('gives a page of visits and where the next one starts', async () => {
    mockRepo.guestVisitsSince.mockResolvedValue(Array.from({ length: 21 }, (_, i) => row(100 - i)));

    const dto = await service.guestVisits(30, { source: 'reddit', before: 101 });

    expect(mockRepo.guestVisitsSince).toHaveBeenCalledWith(new Date('2026-11-01T00:00:00Z'), {
      source: 'reddit',
      before: 101,
      take: 21,
    });
    expect(dto.visits).toHaveLength(20);
    expect(dto.visits[0]).toEqual({
      id: 100,
      day: '2026-11-30',
      startedAt: '2026-11-30T09:41:00.000Z',
      source: 'reddit',
      lang: 'en',
      steps: [{ kind: 'page', target: '/' }],
    });
    expect(dto.next).toBe(81);
  });

  it('gives no start time for a visit from before it was kept', async () => {
    mockRepo.guestVisitsSince.mockResolvedValue([{ ...row(5), startedAt: null }]);
    const dto = await service.guestVisits(90);
    expect(dto.visits[0].startedAt).toBeNull();
  });

  it('has no next page after the last one', async () => {
    mockRepo.guestVisitsSince.mockResolvedValue([row(5)]);
    const dto = await service.guestVisits(90);
    expect(dto.next).toBeNull();
  });
});
