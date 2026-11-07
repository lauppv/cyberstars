import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = { listChecks: vi.fn(), check: vi.fn(), uncheck: vi.fn() };
vi.mock('../repositories/projects.repository.js', () => mockRepo);

const { listChecks, setCheck } = await import('./projects.service.js');

beforeEach(() => vi.clearAllMocks());

describe('projects.service listChecks', () => {
  it('returns the ticks of steps still in the catalog', async () => {
    mockRepo.listChecks.mockResolvedValue([
      { language: 'python', projectSlug: 'library-desk', stepId: 'catalog' },
      // A step taken out of the project, and a project gone from the catalog
      { language: 'python', projectSlug: 'library-desk', stepId: 'gone' },
      { language: 'c', projectSlug: 'nothing', stepId: 'catalog' },
    ]);
    expect(await listChecks(7)).toEqual([
      { language: 'python', slug: 'library-desk', stepId: 'catalog' },
    ]);
    expect(mockRepo.listChecks).toHaveBeenCalledWith(7);
  });
});

describe('projects.service setCheck', () => {
  it('ticks a step of a project', async () => {
    await setCheck(7, 'python', 'library-desk', 'borrow', true);
    expect(mockRepo.check).toHaveBeenCalledWith(7, 'python', 'library-desk', 'borrow');
    expect(mockRepo.uncheck).not.toHaveBeenCalled();
  });

  it('unticks it', async () => {
    await setCheck(7, 'python', 'library-desk', 'borrow', false);
    expect(mockRepo.uncheck).toHaveBeenCalledWith(7, 'python', 'library-desk', 'borrow');
    expect(mockRepo.check).not.toHaveBeenCalled();
  });

  it.each([
    ['java', 'library-desk', 'borrow', 'Project not found'],
    ['python', 'nope', 'borrow', 'Project not found'],
    ['python', 'library-desk', 'nope', 'Step not found'],
  ])('refuses %s/%s step %s with a 404', async (language, slug, stepId, message) => {
    await expect(setCheck(7, language, slug, stepId, true)).rejects.toMatchObject({
      statusCode: 404,
      message,
    });
    expect(mockRepo.check).not.toHaveBeenCalled();
  });
});
