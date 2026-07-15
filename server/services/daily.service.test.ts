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

vi.mock('../repositories/daily.repository.js', () => mockDailyRepo);
vi.mock('../repositories/curriculum.repository.js', () => mockCurriculumRepo);

const { getDaily, awardBonusForCompletion, todayKey } = await import('./daily.service.js');

beforeEach(() => {
  vi.clearAllMocks();
  mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([]);
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

  it('returns a null pick when the pool has no lessons', async () => {
    mockDailyRepo.getPick.mockResolvedValue(null);
    mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([]);

    const res = await getDaily(1);
    expect(res.lesson).toBeNull();
    expect(mockDailyRepo.createPick).not.toHaveBeenCalled();
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
