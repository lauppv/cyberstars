import { describe, it, expect, vi } from 'vitest';

const mockUserRepo = { getTutorProfile: vi.fn() };
vi.mock('../repositories/user.repository.js', () => mockUserRepo);
const mockProgressRepo = { getByUser: vi.fn() };
vi.mock('../repositories/progress.repository.js', () => mockProgressRepo);

const { describeStudent, readStudent } = await import('./tutor-student.service.js');

const day = (d: number) => new Date(2026, 9, d);
const row = (courseKey: string, lessonSlug: string, completed: boolean, d = 1) => ({
  courseKey,
  lessonSlug,
  completed,
  lastAccessedAt: day(d),
});

describe('describeStudent', () => {
  it('counts the finished lessons per course, in the curriculum order', () => {
    const about = describeStudent({ placementScore: 10, interests: ['c'] }, [
      row('c', 'print', true),
      row('python', 'print', true),
      row('python', 'variables-str', true),
    ]);
    expect(about.level).toBe('advanced');
    expect(about.interests).toEqual(['c']);
    expect(about.courses.map((c) => [c.title, c.done])).toEqual([
      ['Python', 2],
      ['C', 1],
    ]);
    expect(about.courses[0].total).toBeGreaterThan(2);
  });

  it('names the unfinished lesson opened last, and leaves out lessons since removed', () => {
    const about = describeStudent({ placementScore: null, interests: [] }, [
      row('python', 'print', false, 3),
      row('python', 'variables-str', false, 5),
      row('python', 'no-such-lesson', false, 9),
    ]);
    expect(about.level).toBeNull();
    expect(about.courses).toEqual([]);
    expect(about.unfinished).toEqual({
      title: expect.any(String),
      course: 'Python',
      link: '/lesson/python/variables-str',
    });
  });
});

describe('readStudent', () => {
  it("reads the student's profile and progress", async () => {
    mockUserRepo.getTutorProfile.mockResolvedValue({ placementScore: null, interests: [] });
    mockProgressRepo.getByUser.mockResolvedValue([]);
    expect(await readStudent(7)).toEqual({
      level: null,
      interests: [],
      courses: [],
      unfinished: null,
    });
    expect(mockProgressRepo.getByUser).toHaveBeenCalledWith(7);
  });
});
