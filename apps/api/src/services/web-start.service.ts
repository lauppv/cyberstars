import { WEB_COURSE_KEYS } from '@cyberstars/shared/constants';
import { parseWebFiles, startWebSite } from '@cyberstars/shared/webFiles';
import type { WebLessonStart } from '@cyberstars/shared/lesson';
import { carriedFrom, lessons } from '@cyberstars/content/curriculum';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { contentDir, readLocalized } from './paths.js';
import { findNewestPassedCode } from '../repositories/submissions.repository.js';

// What a lesson of a web course starts from (CYB-119): the site of the lesson
// it carries on from with the files it adds. `course` takes that lesson's
// reference site, the course's version, which anyone who opens the lesson
// can read; `passed` the student's newest passing site there, which only the
// server's own verdicts make. A lesson that starts from its own files, or the
// course's first, starts from those alone, unchanged.
export async function webLessonStart(
  userId: number | null,
  courseKey: string,
  lessonSlug: string,
  lang: 'en' | 'ro',
): Promise<WebLessonStart> {
  if (!WEB_COURSE_KEYS.includes(courseKey)) throw new AppError(400, 'Invalid course');
  if (!lessons.some((l) => l.courseKey === courseKey && l.slug === lessonSlug)) {
    throw new AppError(404, 'Lesson not found');
  }
  const dir = contentDir(courseKey);
  const own = readLocalized(dir, `${lessonSlug}-code.md`, lang);
  const from = carriedFrom(courseKey, lessonSlug);
  if (!from) return { course: own, passed: null };

  const added = parseWebFiles(own);
  const reference = parseWebFiles(readLocalized(dir, `${from}-solution.md`, lang));
  // The course's own files fit the limits (curriculum.test.ts); the files
  // alone are the last way out
  const course = startWebSite(reference, added) ?? own;
  const passedSite = userId ? await findNewestPassedCode(userId, courseKey, from) : null;
  // A passing site the new files would push past the limits isn't carried
  const passed = passedSite === null ? null : startWebSite(parseWebFiles(passedSite), added);
  return { course, passed };
}
