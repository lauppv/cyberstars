import path from 'path';
import { ALL_COURSE_KEYS, TERMINAL_COURSE_KEYS } from '../../shared/constants.js';
import { AppError } from '../middleware/errorHandler.js';

const LESSONS_DIR = path.join(process.cwd(), 'server', 'lessons');
const ALGO_DIR = path.join(process.cwd(), 'server', 'algorithms');

const ALGO_MAP: Record<string, string> = {
  'algo-python': 'python',
  'algo-java': 'java',
  'algo-c': 'c',
};

const VALID_COURSE_KEYS = new Set<string>([...ALL_COURSE_KEYS, ...TERMINAL_COURSE_KEYS]);

// Single source of truth for "is this a real course key" — used by content path
// resolution and by progress writes/reads to reject garbage course keys.
export function assertValidCourse(courseKey: string): void {
  if (!VALID_COURSE_KEYS.has(courseKey)) {
    throw new AppError(400, 'Invalid course');
  }
}

export function contentDir(courseKey: string): string {
  assertValidCourse(courseKey);
  const algoSubdir = ALGO_MAP[courseKey];
  return algoSubdir ? path.join(ALGO_DIR, algoSubdir) : path.join(LESSONS_DIR, courseKey);
}
