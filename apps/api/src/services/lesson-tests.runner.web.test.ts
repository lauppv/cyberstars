// Runs the web judge's runner on the host (Node and Playwright's headless
// Chromium, skipped when the browser isn't installed: `npx playwright install
// --only-shell chromium`) against small sites, and judges what it reports the
// way the server does. The service tests mock the sandbox away; this covers
// what only a real browser shows: layout, clicks, links, data, a stuck page.
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { WebTestCase } from '@cyberstars/shared/webTests';
import { judgeWebCase } from './web-tests.js';

const RUNNER = path.join(import.meta.dirname, 'lesson-tests.runner.web.cjs');

function hasBrowser(): boolean {
  const dir =
    process.env.PLAYWRIGHT_BROWSERS_PATH ?? path.join(os.homedir(), '.cache', 'ms-playwright');
  try {
    return fs.readdirSync(dir).some((name) => name.startsWith('chromium_headless_shell-'));
  } catch {
    return false;
  }
}

let dir: string;
beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'web-runner-'));
});
afterAll(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

interface Ran {
  steps: object[];
  timedOut?: boolean;
  crashed?: boolean;
}

// Runs every case (the server would stop at the first failure) and returns
// the runner's lines after its header
function run(files: Record<string, string>, cases: WebTestCase[], stepMs = 3000): Ran[] {
  const payloadPath = path.join(dir, 'payload.json');
  fs.writeFileSync(
    payloadPath,
    JSON.stringify({
      files,
      stepMs,
      heapMb: 64,
      height: 800,
      cases: cases.map((c) => ({ page: 'index.html', width: 1280, ...c })),
    }),
  );
  const result = spawnSync('node', [RUNNER, payloadPath], {
    input: cases.map(() => 'next\n').join(''),
    encoding: 'utf8',
    timeout: 90_000,
  });
  expect(result.stderr).toBe('');
  expect(result.status).toBe(0);
  const [header, ...lines] = result.stdout
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  expect(header).toEqual({ ready: true });
  return lines;
}

// Judges each case as the server does, every page of the site there
function verdicts(files: Record<string, string>, cases: WebTestCase[], stepMs?: number) {
  const pages = new Set(Object.keys(files));
  return run(files, cases, stepMs).map((ran, i) => judgeWebCase(cases[i], i, ran as never, pages));
}

const CARDS = `<!DOCTYPE html><html><head><style>
  .cards { display: flex; gap: 16px; }
  .card { width: 200px; height: 80px; }
  @media (max-width: 600px) { .cards { flex-direction: column; } }
</style></head><body><div class="cards"><div class="card">A</div><div class="card">B</div></div></body></html>`;

const STACKED = `<!DOCTYPE html><html><body><div class="card">A</div><div class="card">B</div></body></html>`;

describe.skipIf(!hasBrowser())('web runner', () => {
  it('tells cards side by side from cards one under the other, by window width', () => {
    const cases: WebTestCase[] = [
      {
        name: 'Side by side on a desktop',
        visible: true,
        steps: [{ layout: '.card', arrange: 'row', label: 'the cards' }],
      },
      {
        name: 'One under the other on a phone',
        visible: true,
        width: 375,
        steps: [{ layout: '.card', arrange: 'column', label: 'the cards' }],
      },
    ];
    expect(verdicts({ 'index.html': CARDS }, cases).map((c) => c.passed)).toEqual([true, true]);
    const [desktop, phone] = verdicts({ 'index.html': STACKED }, cases);
    expect(desktop.web).toEqual({
      kind: 'layout',
      label: 'the cards',
      expected: 'row',
      found: 'column',
      width: 1280,
    });
    expect(phone.passed).toBe(true);
  });

  it('passes a click test only when the click changes the page as asked', () => {
    const page = (handler: string) => `<!DOCTYPE html><html><body>
      <button id="add">Add</button><ul id="crew"></ul>
      <script>document.getElementById('add').addEventListener('click', () => { ${handler} });</script>
    </body></html>`;
    const cases: WebTestCase[] = [
      {
        name: 'Add puts a crew member on the list',
        visible: true,
        steps: [
          { count: '#crew li', equals: 0, label: 'crew members' },
          { click: '#add', label: 'the Add button' },
          { count: '#crew li', equals: 1, label: 'crew members' },
          { text: '#crew li', equals: 'New crew member', label: 'the crew member' },
        ],
      },
    ];
    const works = page(
      "const li = document.createElement('li'); li.textContent = 'New crew member'; document.getElementById('crew').append(li);",
    );
    expect(verdicts({ 'index.html': works }, cases)[0].passed).toBe(true);
    const [idle] = verdicts({ 'index.html': page('') }, cases);
    expect(idle.web).toMatchObject({ kind: 'count', expected: '1', found: '0' });
    const [noButton] = verdicts({ 'index.html': '<p>No button</p>' }, cases);
    expect(noButton.web).toEqual({ kind: 'missing', label: 'the Add button' });
  });

  it('follows a link to a second page and checks it', () => {
    const files = {
      'index.html': '<a href="crew.html">Crew</a>',
      'crew.html': '<!DOCTYPE html><title>Crew</title><h2>Crew Directory</h2>',
    };
    const cases: WebTestCase[] = [
      {
        name: 'The link leads to the crew',
        visible: true,
        steps: [
          { click: 'a', label: 'the link' },
          { at: 'crew.html' },
          { text: 'h2', equals: 'Crew Directory', label: 'the heading' },
          { text: 'title', equals: 'Crew', label: 'the title' },
        ],
      },
    ];
    expect(verdicts(files, cases)[0].passed).toBe(true);
    const [broken] = verdicts({ ...files, 'index.html': '<a href="#">Crew</a>' }, cases);
    expect(broken.web).toMatchObject({ kind: 'at', expected: 'crew.html', found: 'index.html' });
  });

  it('fails a hardcoded page on a hidden case that swaps the data', () => {
    const fromData = `<ul id="crew"></ul><script>
      fetch('data/crew.json').then((r) => r.json()).then((crew) => {
        for (const name of crew) {
          const li = document.createElement('li'); li.textContent = name;
          document.getElementById('crew').append(li);
        }
        console.log('loaded ' + crew.length);
      });
    </script>`;
    const hardcoded =
      '<ul id="crew"><li>Ada</li><li>Linus</li></ul><script>console.log("loaded 2")</script>';
    const data = { 'data/crew.json': '["Ada", "Linus"]' };
    const cases: WebTestCase[] = [
      {
        name: 'The list shows the crew from the file',
        visible: true,
        steps: [{ logged: 'loaded 2' }, { count: '#crew li', equals: 2, label: 'crew members' }],
      },
      {
        name: 'Another crew',
        files: { 'data/crew.json': '["Grace", "Alan", "Barbara"]' },
        steps: [
          { logged: 'loaded 3' },
          { count: '#crew li', equals: 3, label: 'crew members' },
          { text: '#crew li', equals: 'Barbara', label: 'a crew member' },
        ],
      },
    ];
    expect(verdicts({ 'index.html': fromData, ...data }, cases).every((c) => c.passed)).toBe(true);
    const [shown, hidden] = verdicts({ 'index.html': hardcoded, ...data }, cases);
    expect(shown.passed).toBe(true);
    expect(hidden.web).toEqual({ kind: 'logged', found: 'loaded 2', hidden: true });
  });

  it('answers fetch of an outside address only as the case says', () => {
    const page = `<p id="out"></p><script>
      fetch('https://api.station.test/crew').then((r) => r.json())
        .then((d) => { document.getElementById('out').textContent = d.name; })
        .catch(() => { document.getElementById('out').textContent = 'offline'; });
    </script>`;
    const step = { text: '#out', equals: 'Ada', label: 'the answer' } as const;
    const [answered, unanswered] = verdicts({ 'index.html': page }, [
      {
        name: 'Answered',
        visible: true,
        fetch: { 'https://api.station.test/crew': { body: '{"name":"Ada"}' } },
        steps: [step],
      },
      { name: 'Unanswered', visible: true, steps: [step] },
    ]);
    expect(answered.passed).toBe(true);
    expect(unanswered.web).toMatchObject({ kind: 'text', found: 'offline' });
  });

  it("answers an address the site doesn't have with a 404, a malformed one too", () => {
    const page = `<p id="out"></p><script>
      Promise.all(['missing.json', '%E0'].map((p) => fetch(p).then((r) => r.status)))
        .then((s) => { document.getElementById('out').textContent = s.join(' '); });
    </script>`;
    const [result] = verdicts({ 'index.html': page }, [
      {
        name: 'Missing files',
        visible: true,
        steps: [{ text: '#out', equals: '404 404', label: 'the statuses' }],
      },
    ]);
    expect(result.passed).toBe(true);
  });

  it('reads styles, attributes, sizes and whether the page fits', () => {
    const files = {
      'index.html': `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
        <link rel="stylesheet" href="css/style.css"></head>
        <body><h1>Station Log</h1><div class="wide"></div></body></html>`,
      'css/style.css': 'h1 { color: rgb(255, 0, 0); } .wide { width: 900px; height: 10px; }',
    };
    const cases: WebTestCase[] = [
      {
        name: 'Desktop',
        visible: true,
        steps: [
          { attr: 'html', name: 'lang', equals: 'en', label: 'the page' },
          {
            attr: 'meta[charset]',
            name: 'charset',
            equals: 'utf-8',
            ignoreCase: true,
            label: 'the page',
          },
          { style: 'h1', prop: 'color', equals: 'rgb(255, 0, 0)', label: 'the heading' },
          { size: '.wide', maxWidth: 1000, label: 'the box' },
          { fits: true },
          { noErrors: true },
        ],
      },
      { name: 'Phone', visible: true, width: 375, steps: [{ fits: true }] },
    ];
    const [desktop, phone] = verdicts(files, cases);
    expect(desktop.passed).toBe(true);
    expect(phone.web).toMatchObject({ kind: 'fits', width: 375 });
  });

  it('stops a page stuck in an endless loop, like a timeout', () => {
    const [stuck] = verdicts(
      { 'index.html': '<h1>Hi</h1><script>while (true) {}</script>' },
      [{ name: 'Loads', visible: true, steps: [{ exists: 'h1', label: 'a heading' }] }],
      2000,
    );
    expect(stuck).toMatchObject({ passed: false, error: 'timeout' });
  });

  it('stops a page that grabs all the memory', () => {
    const [greedy] = verdicts(
      {
        'index.html':
          '<h1>Hi</h1><script>const all = []; for (;;) all.push(new Array(1e6).fill(Math.random()));</script>',
      },
      [{ name: 'Loads', visible: true, steps: [{ exists: 'h1', label: 'a heading' }] }],
    );
    expect(greedy.passed).toBe(false);
    expect(greedy.web).toEqual({ kind: 'memory' });
  });
});
