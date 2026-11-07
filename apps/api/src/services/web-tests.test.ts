import fs from 'fs';
import path from 'path';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { courseDir } from '@cyberstars/content/paths';
import type { WebStep, WebTestCase } from '@cyberstars/shared/webTests';

const { mockDockerExec, mockConverse, mockKillLeftovers } = vi.hoisted(() => ({
  mockDockerExec: vi.fn(),
  mockConverse: vi.fn(),
  mockKillLeftovers: vi.fn(),
}));
vi.mock('@cyberstars-framework/sandbox/docker', () => ({
  dockerExec: (...args: unknown[]) => mockDockerExec(...args),
  dockerConverse: (...args: unknown[]) => mockConverse(...args),
  killLeftovers: (...args: unknown[]) => mockKillLeftovers(...args),
}));

const { mockAcquire, mockRelease, mockDestroy, mockIsRunning, mockAcquireSlot } = vi.hoisted(
  () => ({
    mockAcquire: vi.fn(),
    mockRelease: vi.fn(),
    mockDestroy: vi.fn(),
    mockIsRunning: vi.fn(),
    mockAcquireSlot: vi.fn(),
  }),
);
vi.mock('./sandbox.js', () => ({
  sandbox: {
    acquireForRun: (...args: unknown[]) => mockAcquire(...args),
    releaseAfterRun: (...args: unknown[]) => mockRelease(...args),
    destroyOwner: (...args: unknown[]) => mockDestroy(...args),
    isRunning: (...args: unknown[]) => mockIsRunning(...args),
    acquireSlot: (...args: unknown[]) => mockAcquireSlot(...args),
  },
}));

const { judgeStep, judgeWebCase, runWebLessonTests, loadWebTestsSpec } =
  await import('./web-tests.js');
const { runLessonTests } = await import('./lesson-tests.service.js');

const SOLUTION = fs.readFileSync(path.join(courseDir('web-dev'), 'first-page-solution.md'), 'utf8');

beforeEach(() => {
  vi.clearAllMocks();
  mockIsRunning.mockReturnValue(false);
  mockAcquire.mockResolvedValue('container-1');
  mockAcquireSlot.mockResolvedValue(() => {});
  mockDockerExec.mockResolvedValue('');
  mockKillLeftovers.mockResolvedValue(undefined);
});

describe('judgeStep', () => {
  const judge = (step: WebStep, seen: object, width = 1280) => judgeStep(step, seen, width);

  it('passes an action that found its element and names one that did not', () => {
    expect(judge({ click: '#add', label: 'the Add button' }, { ok: true })).toBeNull();
    expect(judge({ click: '#add', label: 'the Add button' }, { ok: false })).toEqual({
      kind: 'missing',
      label: 'the Add button',
    });
    expect(judge({ open: 'crew.html' }, { ok: true })).toBeNull();
    expect(judge({ wait: 100 }, { ok: true })).toBeNull();
  });

  it('says an element the check needs is missing', () => {
    for (const step of [
      { exists: 'h1', label: 'a heading' },
      { text: 'h1', equals: 'Hi', label: 'a heading' },
      { attr: 'h1', name: 'id', label: 'a heading' },
      { layout: 'h1', arrange: 'row', label: 'a heading' },
    ] as WebStep[]) {
      expect(judge(step, { count: 0 })).toEqual({ kind: 'missing', label: 'a heading' });
    }
    expect(judge({ exists: 'h1', label: 'a heading' }, { count: 2 })).toBeNull();
  });

  it('counts exactly or at least', () => {
    const exactly = { count: 'li', equals: 3, label: 'crew members' } as const;
    expect(judge(exactly, { count: 3 })).toBeNull();
    expect(judge(exactly, { count: 2 })).toEqual({
      kind: 'count',
      label: 'crew members',
      detail: 'equals',
      expected: '3',
      found: '2',
    });
    const atLeast = { count: 'li', atLeast: 2, label: 'crew members' } as const;
    expect(judge(atLeast, { count: 5 })).toBeNull();
    expect(judge(atLeast, { count: 1 })).toMatchObject({ detail: 'atLeast', found: '1' });
  });

  it('matches a text on any element, with spaces collapsed', () => {
    const step = { text: 'li', equals: 'Ada  Lovelace', label: 'a crew member' } as const;
    expect(judge(step, { count: 2, values: ['Linus', ' Ada Lovelace '] })).toBeNull();
    expect(judge(step, { count: 1, values: ['Linus'] })).toEqual({
      kind: 'text',
      label: 'a crew member',
      detail: 'equals',
      expected: 'Ada Lovelace',
      found: 'Linus',
    });
    const contains = { text: 'p', contains: 'orbit', label: 'the paragraph' } as const;
    expect(judge(contains, { count: 1, values: ['We orbit Earth'] })).toBeNull();
    expect(judge(contains, { count: 1, values: ['We land'] })).toMatchObject({
      detail: 'contains',
    });
    const any = { text: 'p', nonEmpty: true, label: 'the paragraph' } as const;
    expect(judge(any, { count: 1, values: ['  '] })).toMatchObject({ detail: 'nonEmpty' });
    expect(judge(any, { count: 1, values: ['x'] })).toBeNull();
  });

  it('reads an attribute, its case only when asked', () => {
    const lang = { attr: 'html', name: 'lang', equals: 'en', label: 'the page' } as const;
    expect(judge(lang, { count: 1, values: ['en'] })).toBeNull();
    expect(judge(lang, { count: 1, values: ['EN'] })).toMatchObject({ found: 'EN' });
    expect(judge(lang, { count: 1, values: [null] })).toEqual({
      kind: 'attr',
      label: 'the page',
      detail: 'lang',
      expected: 'en',
      found: null,
    });
    const charset = { ...lang, name: 'charset', equals: 'UTF-8', ignoreCase: true } as const;
    expect(judge(charset, { count: 1, values: ['utf-8'] })).toBeNull();
    const present = { attr: 'img', name: 'alt', label: 'the picture' } as const;
    expect(judge(present, { count: 1, values: [''] })).toBeNull();
    expect(judge(present, { count: 1, values: [null] })).toMatchObject({ expected: '' });
  });

  it('compares a computed style', () => {
    const step = { style: 'h1', prop: 'display', equals: 'flex', label: 'the bar' } as const;
    expect(judge(step, { count: 1, values: ['flex'] })).toBeNull();
    expect(judge(step, { count: 1, values: ['block'] })).toMatchObject({
      kind: 'style',
      detail: 'display',
      found: 'block',
    });
  });

  it('tells a row from a column, and either from neither', () => {
    const row = { layout: '.card', arrange: 'row', label: 'the cards' } as const;
    const side = [
      { x: 0, y: 0, width: 100, height: 50 },
      { x: 116, y: 0, width: 100, height: 50 },
    ];
    const stacked = [
      { x: 0, y: 0, width: 100, height: 50 },
      { x: 0, y: 66, width: 100, height: 50 },
    ];
    const diagonal = [
      { x: 0, y: 0, width: 100, height: 50 },
      { x: 200, y: 200, width: 100, height: 50 },
    ];
    expect(judge(row, { count: 2, boxes: side })).toBeNull();
    expect(judge(row, { count: 2, boxes: stacked }, 375)).toEqual({
      kind: 'layout',
      label: 'the cards',
      expected: 'row',
      found: 'column',
      width: 375,
    });
    expect(judge({ ...row, arrange: 'column' }, { count: 2, boxes: stacked })).toBeNull();
    expect(judge(row, { count: 2, boxes: diagonal })).toMatchObject({ found: 'mixed' });
    expect(judge(row, { count: 1, boxes: side.slice(0, 1) })).toMatchObject({ found: 'one' });
  });

  it('checks a size against each bound, and that the page fits', () => {
    const step = { size: '.card', minWidth: 100, maxWidth: 300, label: 'a card' } as const;
    const box = (width: number) => ({ count: 1, boxes: [{ x: 0, y: 0, width, height: 10 }] });
    expect(judge(step, box(200))).toBeNull();
    expect(judge(step, box(420))).toEqual({
      kind: 'size',
      label: 'a card',
      detail: 'maxWidth',
      expected: '300',
      found: '420',
      width: 1280,
    });
    expect(judge(step, box(50))).toMatchObject({ detail: 'minWidth' });
    expect(judge({ fits: true }, { scrollWidth: 375 }, 375)).toBeNull();
    expect(judge({ fits: true }, { scrollWidth: 900 }, 375)).toEqual({
      kind: 'fits',
      found: '900',
      width: 375,
    });
  });

  it('reads the console and the page shown', () => {
    expect(judge({ logged: 'ready' }, { logs: ['start', ' ready '] })).toBeNull();
    expect(judge({ logged: 'ready' }, { logs: ['start'] })).toEqual({
      kind: 'logged',
      expected: 'ready',
      found: 'start',
    });
    expect(judge({ logged: 'ready' }, { logs: [] })).toMatchObject({ found: null });
    expect(judge({ noErrors: true }, { errors: [] })).toBeNull();
    expect(judge({ noErrors: true }, { errors: ['x is not defined'] })).toEqual({
      kind: 'errors',
      found: 'x is not defined',
    });
    expect(judge({ at: 'crew.html' }, { page: 'crew.html' })).toBeNull();
    expect(judge({ at: 'crew.html' }, { page: 'index.html' })).toMatchObject({ kind: 'at' });
  });
});

describe('judgeWebCase', () => {
  const pages = new Set(['index.html']);
  const testCase = (extra: Partial<WebTestCase> = {}): WebTestCase => ({
    name: 'The heading',
    visible: true,
    steps: [
      { exists: 'h1', label: 'a heading' },
      { text: 'h1', equals: 'Hi', label: 'the heading' },
    ],
    ...extra,
  });

  it('passes a case whose every step is as asked', () => {
    const ran = { steps: [{ count: 1 }, { count: 1, values: ['Hi'] }] };
    expect(judgeWebCase(testCase(), 0, ran, pages)).toEqual({
      index: 0,
      name: 'The heading',
      visible: true,
      passed: true,
    });
  });

  it('stops at the first step that fails, and a hidden case keeps its expected value', () => {
    const ran = { steps: [{ count: 1 }, { count: 1, values: ['Hello'] }] };
    expect(judgeWebCase(testCase(), 0, ran, pages).web).toMatchObject({ expected: 'Hi' });
    const hidden = judgeWebCase(testCase({ visible: false }), 1, ran, pages);
    expect(hidden).toMatchObject({ passed: false, visible: false });
    expect(hidden.web).toEqual({
      kind: 'text',
      label: 'the heading',
      detail: 'equals',
      found: 'Hello',
      hidden: true,
    });
  });

  it('marks a failure from a Romanian spec, whose labels are Romanian', () => {
    const ran = { steps: [{ count: 0 }] };
    expect(judgeWebCase(testCase(), 0, ran, pages, 'ro').web).toEqual({
      kind: 'missing',
      label: 'a heading',
      lang: 'ro',
    });
  });

  it('says a page the site lacks is missing', () => {
    expect(judgeWebCase(testCase({ page: 'crew.html' }), 0, { steps: [] }, pages).web).toEqual({
      kind: 'missing',
      label: 'crew.html',
    });
  });

  it('reports a stuck page as a timeout and a crashed one as using too much memory', () => {
    expect(
      judgeWebCase(testCase(), 0, { steps: [{ count: 1 }], timedOut: true }, pages),
    ).toMatchObject({ passed: false, error: 'timeout' });
    expect(judgeWebCase(testCase(), 0, { steps: [], crashed: true }, pages).web).toEqual({
      kind: 'memory',
    });
    // A failed step before the stall is what the student needs to hear
    const early = { steps: [{ count: 0 }], timedOut: true };
    expect(judgeWebCase(testCase(), 0, early, pages).web).toMatchObject({ kind: 'missing' });
  });

  it('refuses a runner that stopped short for no reason', () => {
    expect(() => judgeWebCase(testCase(), 0, { steps: [{ count: 1 }] }, pages)).toThrow(
      'Test run failed',
    );
  });
});

// Plays the runner: a header, then a line per case while the server says next
function stubRunner(header: object, lines: object[]) {
  const replies: (string | null)[] = [];
  mockConverse.mockImplementationOnce(
    async (_args: string[], _timeout: number, onLine: (line: string) => string | null) => {
      onLine(JSON.stringify(header));
      for (const line of lines) {
        const reply = onLine(JSON.stringify(line));
        replies.push(reply);
        if (reply !== 'next') return;
      }
    },
  );
  return replies;
}

// What the first lesson's runner reports for its reference site
const PASSING = [
  {
    steps: [
      { count: 1, values: ['en'] },
      { count: 1, values: ['UTF-8'] },
    ],
  },
  { steps: [{ count: 1, values: ['Station Log'] }] },
  { steps: [{ count: 1, values: ['Welcome aboard'] }] },
  { steps: [{ count: 1, values: ['The station orbits the Earth every 92 minutes.'] }] },
];

describe('runWebLessonTests', () => {
  it('loads the spec of a web lesson, with no Romanian one yet', () => {
    expect(loadWebTestsSpec('web-dev', 'first-page')?.cases.length).toBe(4);
    expect(loadWebTestsSpec('web-dev', 'first-page', 'ro')?.cases.length).toBe(4);
    expect(loadWebTestsSpec('web-dev', 'nope')).toBeNull();
  });

  it("runs the site in the owner's web sandbox and passes it", async () => {
    const replies = stubRunner({ ready: true }, PASSING);
    const result = await runWebLessonTests('user:1', 'web-dev', 'first-page', SOLUTION);
    expect(result).toMatchObject({ status: 'passed', passedCount: 4, total: 4 });
    expect(result.cases.map((c) => c.name)).toEqual([
      'The page is in English and can show any letter',
      'The tab is named Station Log',
      'The biggest heading says Welcome aboard',
      'A paragraph of your own follows the heading',
    ]);
    expect(replies).toEqual(['next', 'next', 'next', 'next']);
    expect(mockAcquire).toHaveBeenCalledWith('user:1', 'web', undefined);
    // The runner, then the payload: the site and the steps, no expected value
    const payload = JSON.parse(mockDockerExec.mock.calls[1][2]);
    expect(payload.files['index.html']).toContain('<title>Station Log</title>');
    expect(payload.cases[0]).toMatchObject({ page: 'index.html', width: 1280 });
    expect(mockConverse.mock.calls[0][0]).toEqual([
      'exec',
      '-i',
      'container-1',
      'node',
      '/work/_runner.cjs',
      '/work/_payload.json',
    ]);
    expect(mockKillLeftovers).toHaveBeenCalledWith('container-1');
    expect(mockRelease).toHaveBeenCalledWith('user:1');
  });

  it('stops at the first failing case and says why', async () => {
    const replies = stubRunner({ ready: true }, [
      PASSING[0],
      { steps: [{ count: 1, values: ['Cargo Bay'] }] },
    ]);
    const result = await runWebLessonTests('user:1', 'web-dev', 'first-page', SOLUTION);
    expect(result).toMatchObject({ status: 'failed', passedCount: 1, total: 4 });
    expect(result.cases[1].web).toMatchObject({ kind: 'text', found: 'Cargo Bay' });
    expect(replies).toEqual(['next', 'stop']);
  });

  it('serves a lesson image from the course assets and leaves out a path it may not have', async () => {
    stubRunner({ ready: true }, PASSING);
    const site = `${SOLUTION}\`\`\`image img/none.png\n\`\`\`\n\`\`\`html ../evil.html\nx\n\`\`\`\n`;
    await runWebLessonTests('user:1', 'web-dev', 'first-page', site);
    const payload = JSON.parse(mockDockerExec.mock.calls[1][2]);
    expect(Object.keys(payload.files)).toEqual(['index.html']);
  });

  it('drops the sandbox when the browser does not start', async () => {
    stubRunner({ launchError: 'no browser' }, []);
    await expect(runWebLessonTests('user:1', 'web-dev', 'first-page', SOLUTION)).rejects.toThrow(
      'Test run failed',
    );
    expect(mockDestroy).toHaveBeenCalledWith('user:1');
    expect(mockRelease).not.toHaveBeenCalled();
  });

  it('refuses a second run of the same owner and a lesson without tests', async () => {
    mockIsRunning.mockReturnValue(true);
    await expect(runWebLessonTests('user:1', 'web-dev', 'first-page', SOLUTION)).rejects.toThrow(
      'A run is already in progress',
    );
    await expect(runWebLessonTests('user:1', 'web-dev', 'nope', SOLUTION)).rejects.toThrow(
      'This lesson has no tests',
    );
  });

  it('is what Run Tests runs on a web course', async () => {
    stubRunner({ ready: true }, PASSING);
    const result = await runLessonTests('guest:g', 'web-dev', 'first-page', SOLUTION, 'en');
    expect(result.status).toBe('passed');
    expect(mockAcquire).toHaveBeenCalledWith('guest:g', 'web', undefined);
  });
});
