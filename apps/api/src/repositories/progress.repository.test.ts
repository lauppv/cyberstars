import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  userLessonProgress: {
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  userSavedCode: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./progress.repository.js');

beforeEach(() => vi.clearAllMocks());

describe('getByCourse', () => {
  it('returns progress rows for the user and course', async () => {
    const rows = [{ id: 1 }];
    mockPrisma.userLessonProgress.findMany.mockResolvedValue(rows);
    const result = await repo.getByCourse(1, 'python');
    expect(mockPrisma.userLessonProgress.findMany).toHaveBeenCalledWith({
      where: { userId: 1, courseKey: 'python' },
    });
    expect(result).toBe(rows);
  });
});

describe('upsertProgress', () => {
  it('sets completedAt when marking complete', async () => {
    mockPrisma.userLessonProgress.upsert.mockResolvedValue({});
    await repo.upsertProgress(1, 'python', 'intro', true);
    const arg = mockPrisma.userLessonProgress.upsert.mock.calls[0][0];
    expect(arg.create.completedAt).toBeInstanceOf(Date);
    expect(arg.update.completed).toBe(true);
  });

  it('clears completedAt when un-marking', async () => {
    mockPrisma.userLessonProgress.upsert.mockResolvedValue({});
    await repo.upsertProgress(1, 'python', 'intro', false);
    const arg = mockPrisma.userLessonProgress.upsert.mock.calls[0][0];
    expect(arg.create.completedAt).toBeNull();
    expect(arg.update.completed).toBe(false);
  });
});

describe('touchAccess', () => {
  it('upserts the last accessed timestamp', async () => {
    mockPrisma.userLessonProgress.upsert.mockResolvedValue({});
    await repo.touchAccess(1, 'python', 'intro');
    const arg = mockPrisma.userLessonProgress.upsert.mock.calls[0][0];
    expect(arg.where).toEqual({
      userId_courseKey_lessonSlug: { userId: 1, courseKey: 'python', lessonSlug: 'intro' },
    });
    expect(arg.update.lastAccessedAt).toBeInstanceOf(Date);
  });
});

describe('getSavedCode', () => {
  it('returns the saved code when present', async () => {
    mockPrisma.userSavedCode.findUnique.mockResolvedValue({ code: 'print(1)' });
    expect(await repo.getSavedCode(1, 'python', 'intro')).toBe('print(1)');
  });

  it('returns null when no saved code exists', async () => {
    mockPrisma.userSavedCode.findUnique.mockResolvedValue(null);
    expect(await repo.getSavedCode(1, 'python', 'intro')).toBeNull();
  });
});

describe('upsertCode', () => {
  it('upserts the saved code', async () => {
    mockPrisma.userSavedCode.upsert.mockResolvedValue({});
    await repo.upsertCode(1, 'python', 'intro', 'print(2)');
    const arg = mockPrisma.userSavedCode.upsert.mock.calls[0][0];
    expect(arg.create).toMatchObject({ userId: 1, courseKey: 'python', code: 'print(2)' });
    expect(arg.update.code).toBe('print(2)');
  });
});

describe('getActivityDates', () => {
  it('selects the activity timestamps for the user', async () => {
    const rows = [{ completedAt: null, lastAccessedAt: new Date() }];
    mockPrisma.userLessonProgress.findMany.mockResolvedValue(rows);
    const result = await repo.getActivityDates(1);
    expect(mockPrisma.userLessonProgress.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      select: { completedAt: true, lastAccessedAt: true },
    });
    expect(result).toBe(rows);
  });
});
