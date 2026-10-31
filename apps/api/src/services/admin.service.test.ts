import os from 'os';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { WebSocket } from 'ws';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';
process.env.ADMIN_STATS_CACHE_MS = '60000';

const mockAdminRepo = {
  userStats: vi.fn(),
  progressStats: vi.fn(),
  forumStats: vi.fn(),
  supportStats: vi.fn(),
  countNonFounders: vi.fn(),
};

const mockContainer = {
  liveMetrics: vi.fn(),
  onlineGuests: vi.fn(),
};

vi.mock('../repositories/admin.repository.js', () => mockAdminRepo);
// The real sandbox, its line included, with the containers and guests faked
vi.mock('./sandbox.js', async (importOriginal) => {
  const real = await importOriginal<typeof import('./sandbox.js')>();
  return {
    ...real,
    onlineGuests: mockContainer.onlineGuests,
    sandbox: { ...real.sandbox, liveMetrics: mockContainer.liveMetrics },
  };
});

const { getStats, clearCache } = await import('./admin.service.js');
const { sandbox } = await import('./sandbox.js');
const { registerUserSocket, clearUserSockets } = await import('./ws-user.js');

beforeEach(() => {
  vi.clearAllMocks();
  clearCache();
  clearUserSockets();
  mockAdminRepo.countNonFounders.mockResolvedValue(0);
  mockContainer.onlineGuests.mockReturnValue(0);
  mockAdminRepo.userStats.mockResolvedValue({
    total: 3,
    byRole: { USER: 2, MODERATOR: 0, ADMIN: 1 },
    newLast7Days: 1,
    newLast30Days: 2,
    active: 2,
  });
  mockAdminRepo.progressStats.mockResolvedValue({
    totalCompletions: 5,
    byCourse: [],
    topLessons: [],
  });
  mockAdminRepo.forumStats.mockResolvedValue({ threads: 1, posts: 2, reactions: 3 });
  mockAdminRepo.supportStats.mockResolvedValue({
    total: 0,
    byStatus: { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 },
  });
  mockContainer.liveMetrics.mockReturnValue({
    activeContainers: 0,
    runningNow: 0,
    maxContainers: 50,
    openSessions: 0,
    perLanguage: {},
  });
});

describe('admin.service getStats', () => {
  it('aggregates all sources on a cold call', async () => {
    const stats = await getStats();
    expect(stats.users.total).toBe(3);
    expect(stats.progress.totalCompletions).toBe(5);
    expect(stats.forum.posts).toBe(2);
    expect(stats.codeExec.maxContainers).toBe(50);
    expect(stats.codeExec.busySlots).toBe(0);
    expect(stats.codeExec.maxBusySlots).toBe(os.availableParallelism() * 4);
    expect(mockAdminRepo.userStats).toHaveBeenCalledTimes(1);
  });

  it('serves the DB aggregates from cache within TTL (no re-query)', async () => {
    await getStats();
    await getStats();
    expect(mockAdminRepo.userStats).toHaveBeenCalledTimes(1);
    expect(mockAdminRepo.progressStats).toHaveBeenCalledTimes(1);
  });

  it('reads code-exec metrics live on every call, even when cached', async () => {
    await getStats();
    mockContainer.liveMetrics.mockReturnValue({
      activeContainers: 4,
      runningNow: 2,
      maxContainers: 50,
      openSessions: 3,
      perLanguage: { python: 4 },
    });
    const release = await sandbox.acquireSlot();
    const second = await getStats();
    release();
    expect(second.codeExec.activeContainers).toBe(4);
    expect(second.codeExec.busySlots).toBe(1);
    expect(mockContainer.liveMetrics).toHaveBeenCalledTimes(2);
    expect(mockAdminRepo.userStats).toHaveBeenCalledTimes(1);
  });

  it('counts who is online live on every call, even when cached', async () => {
    await getStats();
    registerUserSocket(7, {} as WebSocket);
    registerUserSocket(9, {} as WebSocket);
    mockAdminRepo.countNonFounders.mockResolvedValue(1);
    mockContainer.onlineGuests.mockReturnValue(4);
    const second = await getStats();
    expect(second.online).toEqual({ users: 1, guests: 4 });
    expect(mockAdminRepo.countNonFounders).toHaveBeenLastCalledWith([7, 9]);
    expect(mockAdminRepo.userStats).toHaveBeenCalledTimes(1);
  });

  it('re-queries after clearCache', async () => {
    await getStats();
    clearCache();
    await getStats();
    expect(mockAdminRepo.userStats).toHaveBeenCalledTimes(2);
  });

  it('bypasses the cache when force=true and refreshes it', async () => {
    await getStats();
    await getStats(true);
    expect(mockAdminRepo.userStats).toHaveBeenCalledTimes(2);
    // the forced recompute repopulates the cache, so the next normal call is a hit
    await getStats();
    expect(mockAdminRepo.userStats).toHaveBeenCalledTimes(2);
  });
});
