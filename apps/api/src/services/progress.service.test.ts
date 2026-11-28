import { describe, it, expect, vi, beforeEach } from 'vitest';

process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockProgressRepo = {
  getByCourse: vi.fn(),
  upsertProgress: vi.fn(),
  upsertCode: vi.fn(),
  getSavedCode: vi.fn(),
  touchAccess: vi.fn(),
};

const mockCurriculumRepo = {
  getLessonsByCourse: vi.fn(),
  getLessonCount: vi.fn(),
  lessonExists: vi.fn(),
  courseLessonCount: vi.fn(),
};

const mockDailyRepo = {
  getAwardedSlugs: vi.fn(),
};

const mockDailyService = {
  awardBonusForCompletion: vi.fn(),
};

const mockUserRepo = {
  markOnboarded: vi.fn(),
};

vi.mock('../repositories/progress.repository.js', () => mockProgressRepo);
vi.mock('../repositories/curriculum.repository.js', () => mockCurriculumRepo);
vi.mock('../repositories/daily.repository.js', () => mockDailyRepo);
vi.mock('./daily.service.js', () => mockDailyService);
vi.mock('../repositories/user.repository.js', () => mockUserRepo);

const { getCourseProgress, markComplete, saveCode, getSavedCode, trackAccess } =
  await import('./progress.service.js');

beforeEach(() => {
  vi.clearAllMocks();
  mockCurriculumRepo.lessonExists.mockResolvedValue(true);
  mockDailyRepo.getAwardedSlugs.mockResolvedValue([]);
});

describe('getCourseProgress', () => {
  it('aggregates lessons and progress correctly', async () => {
    mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([
      { slug: 'a', title: 'Lesson A', sortOrder: 1 },
      { slug: 'b', title: 'Lesson B', sortOrder: 2 },
      { slug: 'c', title: 'Lesson C', sortOrder: 3 },
    ]);
    mockCurriculumRepo.courseLessonCount.mockReturnValue(3);
    mockProgressRepo.getByCourse.mockResolvedValue([
      {
        lessonSlug: 'a',
        completed: true,
        completedAt: new Date('2025-01-01'),
        lastAccessedAt: new Date('2025-01-02'),
      },
    ]);

    const result = await getCourseProgress(1, 'python');

    expect(result.completed).toBe(1);
    expect(result.total).toBe(3);
    expect(result.lessons).toHaveLength(3);
    expect(result.lessons[0].completed).toBe(true);
    expect(result.lessons[1].completed).toBe(false);
    // A lesson gives 10 XP first and 30 last: a=10, b=20, c=30.
    expect(result.earnedXp).toBe(10);
    expect(result.totalXp).toBe(60);
  });

  it('adds the daily bonus XP for a completed lesson that won the daily pick', async () => {
    mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([
      { slug: 'a', title: 'Lesson A', sortOrder: 1 },
      { slug: 'b', title: 'Lesson B', sortOrder: 2 },
    ]);
    mockCurriculumRepo.courseLessonCount.mockReturnValue(2);
    mockProgressRepo.getByCourse.mockResolvedValue([
      {
        lessonSlug: 'a',
        completed: true,
        completedAt: new Date('2025-01-01'),
        lastAccessedAt: null,
      },
      {
        lessonSlug: 'b',
        completed: true,
        completedAt: new Date('2025-01-01'),
        lastAccessedAt: null,
      },
    ]);
    // 'a' won the daily bonus; base XP a=10, b=30. Bonus = round(10*0.2)=2.
    mockDailyRepo.getAwardedSlugs.mockResolvedValue(['a']);

    const result = await getCourseProgress(1, 'python');
    expect(result.earnedXp).toBe(10 + 30 + 2);
    // Bonus never inflates the course baseline total.
    expect(result.totalXp).toBe(40);
  });

  it('pays a challenge by the difficulty in its title, bonus included', async () => {
    mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([
      { slug: 'a', title: 'Hard · A', sortOrder: 1 },
      { slug: 'b', title: 'Easy · B', sortOrder: 2 },
    ]);
    mockCurriculumRepo.courseLessonCount.mockReturnValue(2);
    mockProgressRepo.getByCourse.mockResolvedValue([
      {
        lessonSlug: 'a',
        completed: true,
        completedAt: new Date('2025-01-01'),
        lastAccessedAt: null,
      },
    ]);
    mockDailyRepo.getAwardedSlugs.mockResolvedValue(['a']);

    const result = await getCourseProgress(1, 'algo-python');
    expect(result.earnedXp).toBe(100 + 20);
    expect(result.totalXp).toBe(140);
  });

  it('spreads XP over the curriculum, not a lesson row left over in the table', async () => {
    mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([
      { slug: 'a', title: 'Lesson A', sortOrder: 1 },
      { slug: 'b', title: 'Lesson B', sortOrder: 2 },
      { slug: 'gone', title: 'Taken out', sortOrder: 3 },
    ]);
    mockCurriculumRepo.courseLessonCount.mockReturnValue(2);
    mockProgressRepo.getByCourse.mockResolvedValue([
      {
        lessonSlug: 'b',
        completed: true,
        completedAt: new Date('2025-01-01'),
        lastAccessedAt: null,
      },
    ]);

    const result = await getCourseProgress(1, 'python');
    // b is still the last of 2 lessons, so it pays 30
    expect(result.earnedXp).toBe(30);
  });

  it('returns zero progress when no lessons completed', async () => {
    mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([
      { slug: 'a', title: 'A', sortOrder: 1 },
    ]);
    mockCurriculumRepo.courseLessonCount.mockReturnValue(1);
    mockProgressRepo.getByCourse.mockResolvedValue([]);

    const result = await getCourseProgress(1, 'python');
    expect(result.completed).toBe(0);
    expect(result.earnedXp).toBe(0);
    expect(result.totalXp).toBe(10);
  });
});

describe('markComplete', () => {
  it('delegates to repo and attempts the daily bonus award', async () => {
    await markComplete(1, 'python', 'booleans');
    expect(mockProgressRepo.upsertProgress).toHaveBeenCalledWith(1, 'python', 'booleans', true);
    expect(mockDailyService.awardBonusForCompletion).toHaveBeenCalledWith(1, 'python', 'booleans');
    expect(mockUserRepo.markOnboarded).not.toHaveBeenCalled();
  });

  it('ends the tour when the tour lesson is completed', async () => {
    await markComplete(1, 'python', 'print');
    expect(mockUserRepo.markOnboarded).toHaveBeenCalledWith(1);
  });
});

describe('saveCode / getSavedCode', () => {
  it('saves and retrieves code', async () => {
    mockProgressRepo.getSavedCode.mockResolvedValue("print('hi')");
    await saveCode(1, 'python', 'booleans', "print('hi')");
    expect(mockProgressRepo.upsertCode).toHaveBeenCalledWith(
      1,
      'python',
      'booleans',
      '',
      "print('hi')",
    );
    const code = await getSavedCode(1, 'python', 'booleans');
    expect(code).toBe("print('hi')");
    expect(mockProgressRepo.getSavedCode).toHaveBeenCalledWith(1, 'python', 'booleans', '');
  });

  it('keeps one code per lesson on a course with one language, whatever is named', async () => {
    await saveCode(1, 'python', 'booleans', 'x = 1', 'java');
    expect(mockProgressRepo.upsertCode).toHaveBeenCalledWith(1, 'python', 'booleans', '', 'x = 1');
  });

  it("keeps a multi-language lesson's code per language, Python when none is named", async () => {
    await saveCode(1, 'trees-graphs', 'trees', 'int x;', 'c');
    expect(mockProgressRepo.upsertCode).toHaveBeenCalledWith(
      1,
      'trees-graphs',
      'trees',
      'c',
      'int x;',
    );
    await getSavedCode(1, 'trees-graphs', 'trees');
    expect(mockProgressRepo.getSavedCode).toHaveBeenCalledWith(
      1,
      'trees-graphs',
      'trees',
      'python',
    );
  });

  it('rejects a language that is not one of the code languages', async () => {
    await expect(getSavedCode(1, 'trees-graphs', 'trees', 'ruby')).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(mockProgressRepo.getSavedCode).not.toHaveBeenCalled();
  });
});

describe('trackAccess', () => {
  it('delegates to repo', async () => {
    await trackAccess(1, 'python', 'booleans');
    expect(mockProgressRepo.touchAccess).toHaveBeenCalledWith(1, 'python', 'booleans');
  });
});

describe('URL param validation (H11)', () => {
  it('getCourseProgress rejects an unknown course with 400', async () => {
    await expect(getCourseProgress(1, 'garbage')).rejects.toMatchObject({ statusCode: 400 });
  });

  it('markComplete rejects an unknown course with 400 (no write)', async () => {
    await expect(markComplete(1, 'garbage', 'whatever')).rejects.toMatchObject({ statusCode: 400 });
    expect(mockProgressRepo.upsertProgress).not.toHaveBeenCalled();
  });

  it('saveCode rejects a nonexistent lesson with 404 (no write)', async () => {
    mockCurriculumRepo.lessonExists.mockResolvedValue(false);
    await expect(saveCode(1, 'python', 'nope', 'x')).rejects.toMatchObject({ statusCode: 404 });
    expect(mockProgressRepo.upsertCode).not.toHaveBeenCalled();
  });

  it('trackAccess rejects a nonexistent lesson with 404 (no write)', async () => {
    mockCurriculumRepo.lessonExists.mockResolvedValue(false);
    await expect(trackAccess(1, 'python', 'nope')).rejects.toMatchObject({ statusCode: 404 });
    expect(mockProgressRepo.touchAccess).not.toHaveBeenCalled();
  });
});
