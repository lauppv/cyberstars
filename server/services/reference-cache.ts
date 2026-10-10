import { createHash } from 'crypto';
import type { LessonTestsSpec, TestComparator } from '../../shared/tests.js';

// Reference outputs of judge cases, kept in server memory so a later run skips
// our solution on them: the student's program is checked against the stored
// output, the way an online judge checks against precomputed answers. Only
// cases whose time nobody reads and whose output can't change go in: never the
// load test (its runtime needs our solution timed live, next to the
// student's), never a masked/unordered lesson. A case is concrete data from
// the tests file, so the same solution on the same case always prints the
// same thing; the key covers everything that decides that output, so editing
// the solution or the case simply misses. Bounded LRU: by entry count and by
// total characters, so a few large outputs can't grow the heap on a small VPS.
const MAX_ENTRIES = 4096;
const MAX_TOTAL_CHARS = 4 * 1024 * 1024;

const entries = new Map<string, string>();
let totalChars = 0;

interface ReferenceKeyParts {
  courseKey: string;
  lang: string;
  slug: string;
  solutionCode: string;
  testCase: LessonTestsSpec['cases'][number];
  comparator: TestComparator;
}

export function referenceKey(parts: ReferenceKeyParts): string {
  return createHash('sha256')
    .update(
      JSON.stringify([
        parts.courseKey,
        parts.lang,
        parts.slug,
        parts.solutionCode,
        parts.testCase,
        parts.comparator,
      ]),
    )
    .digest('hex');
}

export function getReference(key: string): string | undefined {
  const stdout = entries.get(key);
  if (stdout === undefined) return undefined;
  // Map iteration follows insertion order: re-inserting marks it most recent.
  entries.delete(key);
  entries.set(key, stdout);
  return stdout;
}

export function putReference(key: string, stdout: string): void {
  if (stdout.length > MAX_TOTAL_CHARS) return;
  const previous = entries.get(key);
  if (previous !== undefined) {
    entries.delete(key);
    totalChars -= previous.length;
  }
  entries.set(key, stdout);
  totalChars += stdout.length;
  for (const [oldest, value] of entries) {
    if (entries.size <= MAX_ENTRIES && totalChars <= MAX_TOTAL_CHARS) break;
    entries.delete(oldest);
    totalChars -= value.length;
  }
}

// Forgets every stored output, so each judge test starts from a cold cache.
export function clearReferences(): void {
  entries.clear();
  totalChars = 0;
}
