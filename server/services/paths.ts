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

export function contentDir(courseKey: string): string {
  if (!VALID_COURSE_KEYS.has(courseKey)) {
    throw new AppError(400, 'Invalid course');
  }
  const algoSubdir = ALGO_MAP[courseKey];
  return algoSubdir ? path.join(ALGO_DIR, algoSubdir) : path.join(LESSONS_DIR, courseKey);
}
