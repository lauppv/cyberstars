import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { localizeRunOutput, localizeServerMessage, translatedSentences } from './serverMessages';

// Tests run from the repo's root
const apiSrc = path.join(process.cwd(), 'apps/api/src');

// Every sentence the API writes in its errors and replies, read from its code:
// AppError, { error }, { message } and a zod rule's message
function serverSentences(): string[] {
  const shapes = [
    /new AppError\(\s*\d+\s*,\s*'([^'\n]+)'/g,
    /\b(?:error|message)\s*:\s*'([^'\n]+)'/g,
    /\.(?:min|max|email|regex|length|refine)\([^')]*'([^'\n]+)'/g,
    /throw new Error\('([^'\n]+)'\)/g,
  ];
  const files = readdirSync(apiSrc, { recursive: true, encoding: 'utf8' }).filter(
    (f) => f.endsWith('.ts') && !f.endsWith('.test.ts'),
  );
  const found = new Set<string>();
  for (const file of files) {
    const code = readFileSync(path.join(apiSrc, file), 'utf8');
    for (const shape of shapes) for (const m of code.matchAll(shape)) found.add(m[1]);
  }
  return [...found];
}

it('reads the API it checks', () => {
  expect(serverSentences().length).toBeGreaterThan(100);
});

// Said only to the model or the logs, never shown to a student
const INTERNAL = new Set([
  'timeout',
  'Error:',
  'Eroare:',
  'C parse failed',
  'C injection does not support $list/$dict values',
]);

describe('localizeServerMessage', () => {
  it('knows every sentence the server can send', () => {
    const known = new Set(translatedSentences);
    const missing = serverSentences().filter(
      (s) => !INTERNAL.has(s) && !known.has(s) && /[a-z]/.test(s) && !/^[a-z]+$/.test(s),
    );
    expect(missing).toEqual([]);
  });

  it('shows a Romanian page the server in Romanian', () => {
    expect(localizeServerMessage('Invalid email or password', 'ro')).toBe(
      'Email sau parolă greșită',
    );
    expect(localizeServerMessage('Too many attempts, try again in 12s.', 'ro')).toBe(
      'Prea multe încercări, mai încearcă peste 12 s.',
    );
    expect(localizeServerMessage('Invalid email or password', 'en')).toBe(
      'Invalid email or password',
    );
    expect(localizeServerMessage('Something new', 'ro')).toBe('Something new');
  });

  it('names a refill time as a day and an hour, not a raw date', () => {
    const iso = '2026-10-17T14:00:00.000Z';
    expect(localizeServerMessage(`Limit reached. It refills at ${iso}`, 'ro')).toMatch(
      /^Ai atins limita\. Se reîncarcă sâmbătă/,
    );
    expect(localizeServerMessage(`Limit reached. It refills at ${iso}`, 'en')).toMatch(
      /^Limit reached\. It refills on Saturday/,
    );
  });
});

describe('localizeRunOutput', () => {
  it("translates the server's lines in a run's output and leaves the program's", () => {
    const output = 'Not found\n\nTime limit exceeded (20s), program stopped.\n';
    expect(localizeRunOutput(output, 'ro')).toBe(
      'Not found\n\nTimpul a expirat (20s), programul a fost oprit.\n',
    );
    expect(
      localizeRunOutput(
        'You have used all 10 free runs. Create a free account to keep running code.\n',
        'ro',
      ),
    ).toMatch(/^Ai folosit toate cele 10 rulări gratuite/);
    expect(localizeRunOutput(output, 'en')).toBe(output);
  });
});
