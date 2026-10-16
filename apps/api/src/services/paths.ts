import fs from 'fs';
import path from 'path';
import { ALL_COURSE_KEYS, TERMINAL_COURSE_KEYS } from '@cyberstars/shared/constants';
import { courseDir } from '@cyberstars/content/paths';
import { AppError } from '../middleware/errorHandler.js';

const VALID_COURSE_KEYS = new Set<string>([...ALL_COURSE_KEYS, ...TERMINAL_COURSE_KEYS]);

// Single source of truth for "is this a real course key", used by content path
// resolution and by progress writes/reads to reject garbage course keys.
export function assertValidCourse(courseKey: string): void {
  if (!VALID_COURSE_KEYS.has(courseKey)) {
    throw new AppError(400, 'Invalid course');
  }
}

export function contentDir(courseKey: string): string {
  assertValidCourse(courseKey);
  return courseDir(courseKey);
}

// A lesson is judge-completable iff it ships an EN <slug>-tests.json, the same
// definition the static-content generator uses to emit `hasTests` into
// curriculum.json. Untested lessons are false.
export function hasTestsFile(courseKey: string, slug: string): boolean {
  return fs.existsSync(path.join(contentDir(courseKey), `${slug}-tests.json`));
}

// Read a lesson file with Romanian fallback: prefer ro/<name> when lang=ro and it
// exists, else the English source. Returns '' when the file is absent.
export function readLocalized(dir: string, name: string, lang: 'en' | 'ro'): string {
  if (lang === 'ro') {
    const roPath = path.join(dir, 'ro', name);
    if (fs.existsSync(roPath)) return fs.readFileSync(roPath, 'utf8');
  }
  const enPath = path.join(dir, name);
  return fs.existsSync(enPath) ? fs.readFileSync(enPath, 'utf8') : '';
}
