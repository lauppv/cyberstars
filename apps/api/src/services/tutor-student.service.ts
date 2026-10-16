import { courses, lessons } from '@cyberstars/content/curriculum';
import type { Interest } from '@cyberstars/shared/interests';
import { placementLevel, type PlacementLevel } from '@cyberstars/shared/placement';
import * as userRepo from '../repositories/user.repository.js';
import * as progressRepo from '../repositories/progress.repository.js';

// What the tutor knows about the student besides the conversation (CYB-69):
// how far the placement test put them, what they want to learn, how far they
// are in each course and the lesson they left unfinished. Read again for
// every message, so it holds after a later login too.
export interface StudentPicture {
  level: PlacementLevel | null;
  interests: Interest[];
  // Only the courses with a finished lesson, in the curriculum's order.
  courses: { title: string; done: number; total: number }[];
  unfinished: { title: string; course: string; link: string } | null;
}

interface ProgressRow {
  courseKey: string;
  lessonSlug: string;
  completed: boolean;
  lastAccessedAt: Date;
}

export function describeStudent(
  profile: { placementScore: number | null; interests: string[] },
  rows: ProgressRow[],
): StudentPicture {
  const lessonOf = (r: ProgressRow) =>
    lessons.find((l) => l.courseKey === r.courseKey && l.slug === r.lessonSlug);
  // A lesson since removed from the curriculum says nothing anymore.
  const known = rows.filter(lessonOf);
  const done = known.filter((r) => r.completed);
  const last = known
    .filter((r) => !r.completed)
    .sort((a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime())[0];
  return {
    level: profile.placementScore === null ? null : placementLevel(profile.placementScore),
    interests: profile.interests as Interest[],
    courses: courses
      .map((c) => ({
        title: c.title,
        done: done.filter((r) => r.courseKey === c.key).length,
        total: lessons.filter((l) => l.courseKey === c.key).length,
      }))
      .filter((c) => c.done > 0),
    unfinished: last
      ? {
          title: lessonOf(last)!.title,
          course: courses.find((c) => c.key === last.courseKey)!.title,
          link: `/lesson/${last.courseKey}/${last.lessonSlug}`,
        }
      : null,
  };
}

export async function readStudent(userId: number): Promise<StudentPicture> {
  const [profile, rows] = await Promise.all([
    userRepo.getTutorProfile(userId),
    progressRepo.getByUser(userId),
  ]);
  return describeStudent(profile, rows);
}
