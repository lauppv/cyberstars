import { describe, it, expect, vi } from 'vitest';

// No web course exists yet, so Linux plays a closed course here
vi.mock('@cyberstars/shared/constants', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@cyberstars/shared/constants')>()),
  isClosedCourse: (courseKey: string) => courseKey === 'linux',
}));

const { listCourses, readLesson, searchLessons } = await import('./tutor-tools.service.js');

describe('a closed course', () => {
  it('is not among the courses the tutor knows', () => {
    const titles = listCourses().map((c) => c.title);
    expect(titles).not.toContain('Linux');
    expect(titles).toContain('Python');
  });

  it('has no lesson the tutor can find or read', () => {
    expect(searchLessons('grep').map((h) => h.link)).not.toContainEqual(
      expect.stringMatching(/^\/lesson\/linux\//),
    );
    expect(readLesson('linux', 'grep', 'en')).toBeNull();
    expect(readLesson('python', 'for', 'en')).not.toBeNull();
  });
});
