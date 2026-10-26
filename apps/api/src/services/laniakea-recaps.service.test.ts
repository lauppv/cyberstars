import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DAY_MS, FOREVER_LEVEL } from '@cyberstars/shared/laniakea';

const mockRepo = {
  listRecapPlanets: vi.fn(),
  listPlayers: vi.fn(),
  markSeen: vi.fn(),
  markNotified: vi.fn(),
};
const mockNotifications = { notify: vi.fn(), markEntityRead: vi.fn() };
vi.mock('../repositories/laniakea.repository.js', () => mockRepo);
vi.mock('./notifications.service.js', () => mockNotifications);
vi.mock('./laniakea.service.js', () => ({ dayMs: () => DAY_MS }));
vi.mock('./visits.service.js', async () => {
  const format = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' });
  return { today: (now: Date) => format.format(now) };
});

const { recapsToTell, tellOpenRecaps, markSeen, scheduleRecapBell } =
  await import('./laniakea-recaps.service.js');

// 12:00 in Romania (UTC+2 in winter)
const NOW = new Date('2026-11-10T10:00:00Z');
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 60 * 60 * 1000);
// A planet at `level` whose recap opened `h` hours ago (negative: still to open)
const openedAgo = (level: number, h: number, userId = 1) => ({
  userId,
  level,
  passedAt: new Date(hoursAgo(h).getTime() - [1, 2, 4, 8, 16, 32, 64][level - 1] * DAY_MS),
});

beforeEach(() => {
  vi.clearAllMocks();
  mockRepo.listPlayers.mockResolvedValue([]);
});

describe('recapsToTell', () => {
  it('counts every recap open for a student who never opened the game since', () => {
    const planets = [openedAgo(1, 2), openedAgo(3, 30), openedAgo(7, 1)];
    expect(recapsToTell(planets, undefined, NOW, DAY_MS)).toBe(3);
  });

  it('tells nothing while no recap is open', () => {
    expect(recapsToTell([openedAgo(2, -5)], undefined, NOW, DAY_MS)).toBe(0);
    expect(recapsToTell([], undefined, NOW, DAY_MS)).toBe(0);
  });

  it('leaves out the recaps still to open', () => {
    expect(recapsToTell([openedAgo(1, 2), openedAgo(4, -1)], undefined, NOW, DAY_MS)).toBe(1);
  });

  it('tells nothing when every open recap was open at the last visit to the game', () => {
    const player = { seenAt: hoursAgo(1), notifiedAt: null };
    expect(recapsToTell([openedAgo(1, 2), openedAgo(2, 5)], player, NOW, DAY_MS)).toBe(0);
  });

  it('counts the old open recaps too once a new one opens after the visit', () => {
    const player = { seenAt: hoursAgo(3), notifiedAt: null };
    expect(recapsToTell([openedAgo(1, 2), openedAgo(2, 5)], player, NOW, DAY_MS)).toBe(2);
  });

  it('tells nothing new when no recap opened since the last notification', () => {
    const player = { seenAt: null, notifiedAt: hoursAgo(26) };
    expect(recapsToTell([openedAgo(1, 30)], player, NOW, DAY_MS)).toBe(0);
  });

  it('tells a recap that opened after yesterday’s notification', () => {
    const player = { seenAt: null, notifiedAt: hoursAgo(20) };
    expect(recapsToTell([openedAgo(1, 30), openedAgo(2, 3)], player, NOW, DAY_MS)).toBe(2);
  });

  it('tells at most once a day in Romania', () => {
    // 01:00 in Romania today, though 23:00 of yesterday in UTC
    const player = { seenAt: null, notifiedAt: new Date('2026-11-09T23:00:00Z') };
    expect(recapsToTell([openedAgo(1, 2)], player, NOW, DAY_MS)).toBe(0);
    const lateYesterday = { seenAt: null, notifiedAt: new Date('2026-11-09T21:30:00Z') };
    expect(recapsToTell([openedAgo(1, 2)], lateYesterday, NOW, DAY_MS)).toBe(1);
  });

  it('counts a shorter day on dev', () => {
    const minute = 60_000;
    const planets = [{ level: 1, passedAt: new Date(NOW.getTime() - 2 * minute) }];
    expect(recapsToTell(planets, undefined, NOW, minute)).toBe(1);
  });
});

describe('tellOpenRecaps', () => {
  it('asks only for the planets with a recap ahead', async () => {
    mockRepo.listRecapPlanets.mockResolvedValue([]);
    expect(await tellOpenRecaps(NOW)).toBe(0);
    expect(mockRepo.listRecapPlanets).toHaveBeenCalledWith('python', FOREVER_LEVEL);
    expect(mockRepo.listPlayers).not.toHaveBeenCalled();
  });

  it('sends each student one notification with their count, and marks them told', async () => {
    mockRepo.listRecapPlanets.mockResolvedValue([
      openedAgo(1, 2, 1),
      openedAgo(2, 3, 1),
      openedAgo(1, 4, 2),
      openedAgo(3, -2, 3),
    ]);
    mockRepo.listPlayers.mockResolvedValue([{ userId: 2, seenAt: hoursAgo(1), notifiedAt: null }]);
    expect(await tellOpenRecaps(NOW)).toBe(1);
    expect(mockRepo.listPlayers).toHaveBeenCalledWith([1, 2, 3]);
    expect(mockRepo.markNotified).toHaveBeenCalledTimes(1);
    expect(mockRepo.markNotified).toHaveBeenCalledWith(1, NOW);
    expect(mockNotifications.notify).toHaveBeenCalledWith({
      recipientIds: [1],
      type: 'LANIAKEA_RECAP',
      entityId: 0,
      data: { count: 2 },
    });
  });
});

describe('markSeen', () => {
  it('keeps the visit and reads the recap notification', async () => {
    await markSeen(4, NOW);
    expect(mockRepo.markSeen).toHaveBeenCalledWith(4, NOW);
    expect(mockNotifications.markEntityRead).toHaveBeenCalledWith(4, 'LANIAKEA_RECAP', 0);
  });
});

describe('scheduleRecapBell', () => {
  it('runs at once and then every hour, and only logs a failure', async () => {
    vi.useFakeTimers();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockRepo.listRecapPlanets.mockRejectedValueOnce(new Error('db down')).mockResolvedValue([]);
    const timer = scheduleRecapBell();
    await vi.advanceTimersByTimeAsync(0);
    expect(error).toHaveBeenCalledWith('[laniakea] recap bell failed:', expect.any(Error));
    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);
    expect(mockRepo.listRecapPlanets).toHaveBeenCalledTimes(2);
    clearInterval(timer);
    error.mockRestore();
    vi.useRealTimers();
  });
});
