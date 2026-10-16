import { INTEREST_COURSES, type Interest } from '@cyberstars/shared/interests';
import type { PlacementLevel } from '@cyberstars/shared/placement';
import type { CourseProgress } from '@cyberstars/shared/progress';

// A question the student can ask with one click on an empty conversation: its
// i18n key and what fills it in.
export interface TutorStarter {
  key: string;
  values?: Record<string, string | number>;
}

// What a general conversation can start with when nothing is known about the
// student: three of them at random, one that fits the page first.
const GENERAL_STARTERS = [
  'course',
  'idea',
  'help',
  'loop',
  'function',
  'error',
  'languages',
  'challenge',
  'recursion',
  'list',
  'linux',
  'stuck',
  'debug',
  'better',
];
// From the placement test: the same kind of questions, fitted to how far the
// student is, so an advanced one is never offered what a variable is.
const LEVEL_STARTERS: Record<PlacementLevel, string[]> = {
  beginner: [
    'course',
    'idea',
    'help',
    'loop',
    'function',
    'error',
    'languages',
    'list',
    'linux',
    'stuck',
  ],
  intermediate: [
    'function',
    'error',
    'languages',
    'challenge',
    'recursion',
    'list',
    'linux',
    'stuck',
    'debug',
    'better',
  ],
  advanced: ['challenge', 'recursion', 'debug', 'better', 'pointers', 'complexity', 'threads'],
};
// The questions that belong to one thing to learn: offered first to a student
// who picked it, never to one who picked other things.
const STARTER_INTEREST: Record<string, Interest> = {
  list: 'python',
  pointers: 'c',
  threads: 'c',
  linux: 'linux',
  challenge: 'algorithms',
};
const PAGE_STARTERS: [path: string, starter: string][] = [
  ['/algorithms', 'challenge'],
  ['/courses', 'course'],
];

// A finished lesson comes back as a quiz once this much time has passed.
const QUIZ_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

export interface StudentState {
  level: PlacementLevel | null;
  // null until asked, or for an account from before the question
  interests: Interest[] | null;
  progress: Record<string, CourseProgress>;
  now: number;
}

// What the student's own progress suggests (CYB-69): the lesson they left
// unfinished, the next lesson in a course they want, and a lesson finished a
// week ago or more to be quizzed on.
function fromProgress({ interests, progress, now }: StudentState): TutorStarter[] {
  const opened = Object.values(progress).flatMap((course) =>
    course.lessons.map((lesson) => ({ ...lesson, courseKey: course.courseKey })),
  );
  const latest = (at: (l: (typeof opened)[number]) => string | null) =>
    opened.filter((l) => at(l)).sort((a, b) => at(b)!.localeCompare(at(a)!))[0];

  const unfinished = latest((l) => (l.completed ? null : l.lastAccessedAt));
  // The courses they want, the one they were in last first; without an answer,
  // the ones they have been in.
  const lastIn = (key: string) =>
    progress[key]?.lessons.reduce(
      (last, l) => (l.lastAccessedAt && l.lastAccessedAt > last ? l.lastAccessedAt : last),
      '',
    ) ?? '';
  const wanted = (
    interests?.length
      ? interests.flatMap((i) => INTEREST_COURSES[i])
      : Object.keys(progress).filter((key) => lastIn(key))
  ).sort((a, b) => lastIn(b).localeCompare(lastIn(a)));
  const next = wanted
    .map((key) =>
      progress[key]?.lessons.find(
        (l) => !l.completed && !(key === unfinished?.courseKey && l.slug === unfinished.slug),
      ),
    )
    .find(Boolean);
  const quiz = latest((l) =>
    l.completedAt && now - Date.parse(l.completedAt) >= QUIZ_AFTER_MS ? l.completedAt : null,
  );

  return [
    ...(unfinished ? [{ key: 'tutor.start.finish', values: { lesson: unfinished.title } }] : []),
    ...(next ? [{ key: 'tutor.start.next', values: { lesson: next.title } }] : []),
    ...(quiz ? [{ key: 'tutor.start.quiz', values: { lesson: quiz.title } }] : []),
  ];
}

// The three questions a new general conversation offers, the one fitting the
// page first. A student the app knows something about gets them from that,
// the same ones for the same state; anyone else gets them at random.
export function pickStarters(pathname: string, student: StudentState): TutorStarter[] {
  const fits = PAGE_STARTERS.find(([path]) => pathname.startsWith(path))?.[1];
  const personal = fromProgress(student);
  const pool = (student.level ? LEVEL_STARTERS[student.level] : GENERAL_STARTERS).filter(
    (starter) => starter !== fits,
  );
  const picked = fits ? [fits] : [];

  if (!personal.length && !student.interests?.length) {
    while (picked.length < 3) {
      picked.push(...pool.splice(Math.floor(Math.random() * pool.length), 1));
    }
    return picked.map((starter) => ({ key: `tutor.start.${starter}` }));
  }

  const interests = student.interests ?? [];
  const tied = (starter: string) => STARTER_INTEREST[starter];
  const fill = interests.length
    ? [
        ...pool.filter((s) => tied(s) && interests.includes(tied(s))),
        ...pool.filter((s) => !tied(s)),
      ]
    : pool;
  return [
    ...picked.map((starter) => ({ key: `tutor.start.${starter}` })),
    ...personal,
    ...fill.map((starter) => ({ key: `tutor.start.${starter}` })),
  ].slice(0, 3);
}
