import path from 'path';

const LESSONS_DIR = path.join(process.cwd(), 'server', 'lessons');
const ALGO_DIR = path.join(process.cwd(), 'server', 'algorithms');

const ALGO_MAP: Record<string, string> = {
  'algo-python': 'python',
  'algo-java': 'java',
  'algo-c': 'c',
};

export function contentDir(courseKey: string): string {
  const algoSubdir = ALGO_MAP[courseKey];
  return algoSubdir ? path.join(ALGO_DIR, algoSubdir) : path.join(LESSONS_DIR, courseKey);
}
