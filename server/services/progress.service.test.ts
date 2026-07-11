import { describe, it, expect, vi, beforeEach } from 'vitest';

process.env.JWT_SECRET = 'test-secret';
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
};

vi.mock('../repositories/progress.repository.js', () => mockProgressRepo);
vi.mock('../repositories/curriculum.repository.js', () => mockCurriculumRepo);

const { getCourseProgress, markComplete, saveCode, getSavedCode, trackAccess } =
  await import('./progress.service.js');

beforeEach(() => {
  vi.clearAllMocks();
  mockCurriculumRepo.lessonExists.mockResolvedValue(true);
});

describe('getCourseProgress', () => {
  it('aggregates lessons and progress correctly', async () => {
    mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([
      { slug: 'a', title: 'Lesson A', sortOrder: 1 },
      { slug: 'b', title: 'Lesson B', sortOrder: 2 },
      { slug: 'c', title: 'Lesson C', sortOrder: 3 },
    ]);
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
    // XP derived from 1-based sortOrder: lesson 'a' (sortOrder 1) worth 10; total 10+11+12.
    expect(result.earnedXp).toBe(10);
    expect(result.totalXp).toBe(33);
  });

  it('returns zero progress when no lessons completed', async () => {
    mockCurriculumRepo.getLessonsByCourse.mockResolvedValue([
      { slug: 'a', title: 'A', sortOrder: 1 },
    ]);
    mockProgressRepo.getByCourse.mockResolvedValue([]);

    const result = await getCourseProgress(1, 'python');
    expect(result.completed).toBe(0);
    expect(result.earnedXp).toBe(0);
    expect(result.totalXp).toBe(10);
  });
});

describe('markComplete', () => {
  it('delegates to repo', async () => {
    await markComplete(1, 'python', 'booleans');
    expect(mockProgressRepo.upsertProgress).toHaveBeenCalledWith(1, 'python', 'booleans', true);
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
      "print('hi')",
    );
    const code = await getSavedCode(1, 'python', 'booleans');
    expect(code).toBe("print('hi')");
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
