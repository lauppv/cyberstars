import path from 'path';
import { codeLanguageOf, isMultiLanguage } from '@cyberstars/shared/constants';

// Found from this file, not from the folder a process starts in.
const LESSONS_DIR = path.join(import.meta.dirname, 'lessons');
const ALGO_DIR = path.join(import.meta.dirname, 'algorithms');

// Accepted and rejected solutions per lesson: variants/<course>/<slug>/, and
// variants/<course>/<language>/<slug>/ on a multi-language course.
export const VARIANTS_DIR = path.join(import.meta.dirname, 'variants');

const ALGO_MAP: Record<string, string> = {
  'algo-python': 'python',
  'algo-java': 'java',
  'algo-c': 'c',
};

// The folder holding a course's files: algorithms/<lang> for an algorithm
// course, lessons/<courseKey>/<language> for a multi-language course (Python
// when no language is given), lessons/<courseKey> for the rest. Doesn't check
// the key.
export function courseDir(courseKey: string, language?: string): string {
  const algoSubdir = ALGO_MAP[courseKey];
  if (algoSubdir) return path.join(ALGO_DIR, algoSubdir);
  if (isMultiLanguage(courseKey)) {
    return path.join(LESSONS_DIR, courseKey, codeLanguageOf(courseKey, language));
  }
  return path.join(LESSONS_DIR, courseKey);
}
