import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  projectStepCheck: { findMany: vi.fn(), upsert: vi.fn(), deleteMany: vi.fn() },
};
vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./projects.repository.js');

beforeEach(() => vi.clearAllMocks());

describe('projects.repository', () => {
  it('lists the student’s ticks, oldest first', async () => {
    mockPrisma.projectStepCheck.findMany.mockResolvedValue([
      { language: 'python', projectSlug: 'library-desk', stepId: 'catalog' },
    ]);
    expect(await repo.listChecks(7)).toEqual([
      { language: 'python', projectSlug: 'library-desk', stepId: 'catalog' },
    ]);
    expect(mockPrisma.projectStepCheck.findMany).toHaveBeenCalledWith({
      where: { userId: 7 },
      select: { language: true, projectSlug: true, stepId: true },
      orderBy: { checkedAt: 'asc' },
    });
  });

  it('ticks a step once, keeping the first tick', async () => {
    await repo.check(7, 'python', 'library-desk', 'list');
    expect(mockPrisma.projectStepCheck.upsert).toHaveBeenCalledWith({
      where: {
        userId_language_projectSlug_stepId: {
          userId: 7,
          language: 'python',
          projectSlug: 'library-desk',
          stepId: 'list',
        },
      },
      create: { userId: 7, language: 'python', projectSlug: 'library-desk', stepId: 'list' },
      update: {},
    });
  });

  it('unticks a step, ticked or not', async () => {
    await repo.uncheck(7, 'python', 'library-desk', 'list');
    expect(mockPrisma.projectStepCheck.deleteMany).toHaveBeenCalledWith({
      where: { userId: 7, language: 'python', projectSlug: 'library-desk', stepId: 'list' },
    });
  });
});
