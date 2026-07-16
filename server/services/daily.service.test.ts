import { describe, it, expect, vi, beforeEach } from 'vitest';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockDailyRepo = {
  getPick: vi.fn(),
  createPick: vi.fn(),
  awardBonusIfPicked: vi.fn(),
  getAwardedSlugs: vi.fn(),
};

const mockCurriculumRepo = {
  getLessonsByCourse: vi.fn(),
};

const hasTestsFileMock = vi.fn();

vi.mock('../repositories/daily.repository.js', () => mockDailyRepo);
vi.mock('../repositories/curriculum.repository.js', () => mockCurriculumRepo);
vi.mock('./paths.js', () => ({
  hasTestsFile: (...args: unknown[]) => hasTestsFileMock(...args),
}));

const { getDaily, awardBonusForCompletion, todayKey, clearDailyPoolCache } =
  await import('./daily.service.js');

beforeEach(() => {
  vi.clearAllMocks();
  clearDailyPoolCache(); // pool is memoized per process/day — reset for isolation
  mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([]);
  // Default: every lesson is judge-completable unless a test says otherwise.
  hasTestsFileMock.mockReturnValue(true);
});

describe('getDaily', () => {
  it('reuses an existing persisted pick without re-drawing', async () => {
    mockDailyRepo.getPick.mockImplementation(async (_u: number, _d: string, kind: string) =>
      kind === 'lesson'
        ? { courseKey: 'python', lessonSlug: 'booleans', title: 'Booleans' }
        : { courseKey: 'algo-python', lessonSlug: 'two-sum', title: 'Two Sum' },
    );

    const res = await getDaily(1);

    expect(res.lesson).toEqual({
      kind: 'lesson',
      courseKey: 'python',
      slug: 'booleans',
      title: 'Booleans',
    });
    expect(res.algo).toEqual({
      kind: 'algo',
      courseKey: 'algo-python',
      slug: 'two-sum',
      title: 'Two Sum',
    });
    expect(res.bonusRatio).toBeGreaterThan(0);
    expect(mockCurriculumRepo.getLessonsByCourse).not.toHaveBeenCalled();
    expect(mockDailyRepo.createPick).not.toHaveBeenCalled();
  });

  it('draws the same deterministic pick for different users on the same day', async () => {
    mockDailyRepo.getPick.mockResolvedValue(null);
    mockCurriculumRepo.getLessonsByCourse.mockImplementation(async (courseKey: string) =>
      courseKey === 'python'
        ? [
            { slug: 'a', title: 'A', sortOrder: 1 },
            { slug: 'b', title: 'B', sortOrder: 2 },
          ]
        : [],
    );

    const userOne = await getDaily(1);
    const userTwo = await getDaily(2);

    // Global pick: the choice no longer depends on the user id.
    expect(userOne.lesson).toEqual(userTwo.lesson);
    expect(userOne.lesson?.courseKey).toBe('python');
    expect(mockDailyRepo.createPick).toHaveBeenCalled();
  });

  it('memoizes the candidate pool so a second user does not re-query the DB', async () => {
    mockDailyRepo.getPick.mockResolvedValue(null);
    mockCurriculumRepo.getLessonsByCourse.mockImplementation(async (courseKey: string) =>
      courseKey === 'python' ? [{ slug: 'a', title: 'A', sortOrder: 1 }] : [],
    );

    await getDaily(1);
    const callsAfterFirstUser = mockCurriculumRepo.getLessonsByCourse.mock.calls.length;
    expect(callsAfterFirstUser).toBeGreaterThan(0);

    await getDaily(2);
    // The pool is cached for the day — the second user triggers no new queries.
    expect(mockCurriculumRepo.getLessonsByCourse.mock.calls.length).toBe(callsAfterFirstUser);
  });

  it('returns a null pick when the pool has no lessons', async () => {
    mockDailyRepo.getPick.mockResolvedValue(null);
    mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([]);

    const res = await getDaily(1);
    expect(res.lesson).toBeNull();
    expect(mockDailyRepo.createPick).not.toHaveBeenCalled();
  });

  it('excludes lessons without a tests file so every pick is claimable', async () => {
    mockDailyRepo.getPick.mockResolvedValue(null);
    mockCurriculumRepo.getLessonsByCourse.mockImplementation(async (courseKey: string) =>
      courseKey === 'python'
        ? [
            { slug: 'tested', title: 'Tested', sortOrder: 1 },
            { slug: 'untested', title: 'Untested', sortOrder: 2 },
          ]
        : [],
    );
    hasTestsFileMock.mockImplementation((_course: string, slug: string) => slug === 'tested');

    const res = await getDaily(1);

    // Only the tested lesson can be picked, regardless of the hash landing.
    expect(res.lesson?.slug).toBe('tested');
    expect(mockDailyRepo.createPick).toHaveBeenCalledWith(
      1,
      expect.any(String),
      'lesson',
      'python',
      'tested',
      'Tested',
    );
  });

  it('reuses the raced-in pick when createPick loses a concurrent race', async () => {
    let created = false;
    mockDailyRepo.getPick.mockImplementation(async () =>
      created ? { courseKey: 'python', lessonSlug: 'a', title: 'A' } : null,
    );
    mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([
      { slug: 'a', title: 'A', sortOrder: 1 },
    ]);
    mockDailyRepo.createPick.mockImplementation(async () => {
      created = true;
      throw new Error('unique violation');
    });

    const res = await getDaily(1);
    expect(res.lesson).toEqual({ kind: 'lesson', courseKey: 'python', slug: 'a', title: 'A' });
  });
});

describe('awardBonusForCompletion', () => {
  it('delegates to the repo with today’s date key', async () => {
    mockDailyRepo.awardBonusIfPicked.mockResolvedValue(true);
    await awardBonusForCompletion(7, 'python', 'booleans');
    expect(mockDailyRepo.awardBonusIfPicked).toHaveBeenCalledWith(
      7,
      todayKey(),
      'python',
      'booleans',
    );
  });
});
