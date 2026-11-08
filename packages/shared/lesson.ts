export interface LessonContent {
  title: string;
  content: string;
}

export interface LessonMeta {
  slug: string;
  title: string;
  /** The title in Romanian, when it has one (packages/content/curriculum-ro.ts). */
  titleRo?: string;
  sortOrder: number;
  /** Present when the lesson ships a <slug>-tests.json validated by the server judge. */
  hasTests?: boolean;
  /** Present when the lesson ships a <slug>-solution.md, revealed via the usage API. */
  hasSolution?: boolean;
}

// A named stretch of a long course, such as a page of the Web Development
// course's site (packages/content/curriculum.ts `courseParts`)
interface CoursePart {
  key: string;
  title: string;
  /** The name in Romanian, when it has one (packages/content/curriculum-ro.ts). */
  titleRo?: string;
  /** The slugs of its lessons, in the course's order. */
  lessons: string[];
}

export interface Course {
  key: string;
  title: string;
  description: string;
  lessons: LessonMeta[];
  /** Present when the course is split into parts; together they hold every lesson. */
  parts?: CoursePart[];
}

// What a web lesson starts from (CYB-119, GET /api/lessons/:course/:slug/start):
// `course` the course's version of the site so far with the lesson's new
// files, `passed` the student's own newest passing site with them, or null
// with none (a guest, a skipped lesson, the course's first lesson).
export interface WebLessonStart {
  course: string;
  passed: string | null;
}

// The lesson an editor Run belongs to, sent with the code so that a challenge
// with a hidden part (<slug>-harness.md) runs the student's function inside it.
export interface RunLesson {
  courseKey: string;
  lessonSlug: string;
  lang: 'en' | 'ro';
}
