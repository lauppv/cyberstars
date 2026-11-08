import { describe, it, expect, vi, beforeEach } from 'vitest';
import { serializeWebFiles, WEB_MAX_LENGTH } from '@cyberstars/shared/webFiles';

// A course of its own: one, two, a project that starts from an empty folder,
// then three, which carries on from two
vi.mock('@cyberstars/content/curriculum', async () => {
  const real = await vi.importActual<typeof import('@cyberstars/content/curriculum')>(
    '@cyberstars/content/curriculum',
  );
  const list = [
    { courseKey: 'web-dev', slug: 'one', sortOrder: 1 },
    { courseKey: 'web-dev', slug: 'two', sortOrder: 2 },
    { courseKey: 'web-dev', slug: 'project', sortOrder: 3 },
    { courseKey: 'web-dev', slug: 'three', sortOrder: 4 },
  ];
  const fresh = { 'web-dev': ['project'] };
  return {
    lessons: list,
    carriedFrom: (courseKey: string, slug: string) =>
      real.carriedFrom(courseKey, slug, list, fresh),
  };
});

const files: Record<string, string> = {};
vi.mock('./paths.js', () => ({
  contentDir: (courseKey: string) => `/content/${courseKey}`,
  readLocalized: (_dir: string, name: string, lang: string) =>
    files[`${lang}/${name}`] ?? files[`en/${name}`] ?? '',
}));

vi.mock('../repositories/submissions.repository.js', () => ({
  findNewestPassedCode: vi.fn(),
}));

import { webLessonStart } from './web-start.service.js';
import * as repo from '../repositories/submissions.repository.js';

const mockPassed = vi.mocked(repo.findNewestPassedCode);

const site = (...list: [string, string][]) =>
  serializeWebFiles(list.map(([path, content]) => ({ path, content })));

beforeEach(() => {
  vi.clearAllMocks();
  mockPassed.mockResolvedValue(null);
  for (const key of Object.keys(files)) delete files[key];
  files['en/one-code.md'] = '```html index.html\n\n```\n';
  files['en/one-solution.md'] = site(['index.html', '<h1>Course</h1>']);
  files['en/two-code.md'] = site(['crew.html', '']);
  files['en/two-solution.md'] = site(['index.html', '<h1>Course</h1>'], ['crew.html', '<ul></ul>']);
  files['en/project-code.md'] = site(['ledger.html', '']);
  files['en/project-solution.md'] = site(['ledger.html', '<table></table>']);
  files['en/three-code.md'] = site(['style.css', '']);
});

describe('webLessonStart', () => {
  it("starts the course's first lesson from its own files, as written", async () => {
    expect(await webLessonStart(7, 'web-dev', 'one', 'en')).toEqual({
      course: '```html index.html\n\n```\n',
      passed: null,
    });
    expect(mockPassed).not.toHaveBeenCalled();
  });

  it("carries the student's newest passing site on, with the lesson's new files", async () => {
    mockPassed.mockResolvedValue(site(['index.html', '<h1>Mine</h1>']));

    expect(await webLessonStart(7, 'web-dev', 'two', 'en')).toEqual({
      course: site(['index.html', '<h1>Course</h1>'], ['crew.html', '']),
      passed: site(['index.html', '<h1>Mine</h1>'], ['crew.html', '']),
    });
    expect(mockPassed).toHaveBeenCalledWith(7, 'web-dev', 'one');
  });

  it("never replaces the student's file with a new one by the same name", async () => {
    mockPassed.mockResolvedValue(site(['index.html', '<h1>Mine</h1>'], ['crew.html', '<p>me</p>']));

    const start = await webLessonStart(7, 'web-dev', 'two', 'en');
    expect(start.passed).toBe(site(['index.html', '<h1>Mine</h1>'], ['crew.html', '<p>me</p>']));
  });

  it("gives a guest the course's version only", async () => {
    expect(await webLessonStart(null, 'web-dev', 'two', 'en')).toEqual({
      course: site(['index.html', '<h1>Course</h1>'], ['crew.html', '']),
      passed: null,
    });
    expect(mockPassed).not.toHaveBeenCalled();
  });

  it('starts a project from its own files alone', async () => {
    mockPassed.mockResolvedValue(site(['index.html', '<h1>Mine</h1>']));

    expect(await webLessonStart(7, 'web-dev', 'project', 'en')).toEqual({
      course: site(['ledger.html', '']),
      passed: null,
    });
    expect(mockPassed).not.toHaveBeenCalled();
  });

  it('carries on from the lesson before the project, skipping it', async () => {
    mockPassed.mockResolvedValue(site(['index.html', '<h1>Mine</h1>'], ['crew.html', '<ol></ol>']));

    const start = await webLessonStart(7, 'web-dev', 'three', 'en');
    expect(mockPassed).toHaveBeenCalledWith(7, 'web-dev', 'two');
    expect(start).toEqual({
      course: site(
        ['index.html', '<h1>Course</h1>'],
        ['crew.html', '<ul></ul>'],
        ['style.css', ''],
      ),
      passed: site(['index.html', '<h1>Mine</h1>'], ['crew.html', '<ol></ol>'], ['style.css', '']),
    });
  });

  it('carries no passing site the new files would push past the limits', async () => {
    mockPassed.mockResolvedValue(site(['index.html', 'x'.repeat(WEB_MAX_LENGTH - 30)]));

    const start = await webLessonStart(7, 'web-dev', 'two', 'en');
    expect(start.passed).toBeNull();
    expect(start.course).toBe(site(['index.html', '<h1>Course</h1>'], ['crew.html', '']));
  });

  it("reads the lesson's files in the student's language", async () => {
    files['ro/one-solution.md'] = site(['index.html', '<h1>Curs</h1>']);

    const start = await webLessonStart(null, 'web-dev', 'two', 'ro');
    expect(start.course).toBe(site(['index.html', '<h1>Curs</h1>'], ['crew.html', '']));
  });

  it('refuses a course that is not a web course and a lesson the course has not', async () => {
    await expect(webLessonStart(7, 'python', 'print', 'en')).rejects.toMatchObject({
      statusCode: 400,
    });
    await expect(webLessonStart(7, 'web-dev', '../secret', 'en')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
