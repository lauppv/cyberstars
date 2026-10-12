import path from 'path';

// Found from this file, not from the folder a process starts in.
const LESSONS_DIR = path.join(import.meta.dirname, 'lessons');
const ALGO_DIR = path.join(import.meta.dirname, 'algorithms');

// Accepted and rejected solutions per lesson: variants/<course>/<slug>/.
export const VARIANTS_DIR = path.join(import.meta.dirname, 'variants');

const ALGO_MAP: Record<string, string> = {
  'algo-python': 'python',
  'algo-java': 'java',
  'algo-c': 'c',
};

// The folder holding a course's files: algorithms/<lang> for an algorithm
// course, lessons/<courseKey> for the rest. Doesn't check the key.
export function courseDir(courseKey: string): string {
  const algoSubdir = ALGO_MAP[courseKey];
  return algoSubdir ? path.join(ALGO_DIR, algoSubdir) : path.join(LESSONS_DIR, courseKey);
}
