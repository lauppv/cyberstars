import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  lesson: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./curriculum.repository.js');

beforeEach(() => vi.clearAllMocks());

describe('getLessonsByCourse', () => {
  it('returns lessons ordered by sortOrder', async () => {
    const lessons = [{ id: 1 }];
    mockPrisma.lesson.findMany.mockResolvedValue(lessons);
    const result = await repo.getLessonsByCourse('python');
    expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({
      where: { courseKey: 'python' },
      orderBy: { sortOrder: 'asc' },
    });
    expect(result).toBe(lessons);
  });
});

describe('lessonExists', () => {
  it('returns true when the lesson is found', async () => {
    mockPrisma.lesson.findUnique.mockResolvedValue({ id: 1 });
    expect(await repo.lessonExists('python', 'intro')).toBe(true);
  });

  it('returns false when the lesson is missing', async () => {
    mockPrisma.lesson.findUnique.mockResolvedValue(null);
    expect(await repo.lessonExists('python', 'nope')).toBe(false);
  });
});
