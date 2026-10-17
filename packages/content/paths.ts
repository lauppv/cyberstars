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
  'algo-trees-graphs': 'trees-graphs',
};

// The folder holding a course's files: algorithms/<set> for an algorithm
// course, lessons/<courseKey> for the rest. A multi-language course, or
// challenge set, has one folder per language inside it (Python when no
// language is given). Doesn't check the key.
export function courseDir(courseKey: string, language?: string): string {
  const algoSubdir = ALGO_MAP[courseKey];
  const dir = algoSubdir ? path.join(ALGO_DIR, algoSubdir) : path.join(LESSONS_DIR, courseKey);
  return isMultiLanguage(courseKey) ? path.join(dir, codeLanguageOf(courseKey, language)) : dir;
}
