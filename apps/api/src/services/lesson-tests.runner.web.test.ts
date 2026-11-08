// Runs the web judge's runner on the host (Node and Playwright's Chromium,
// skipped when it isn't installed: `npx playwright install chromium`) against small sites, and judges what it reports the
// way the server does. The service tests mock the sandbox away; this covers
// what only a real browser shows: layout, clicks, links, data, a stuck page.
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WEB_ACTION_KEYS, type WebTestCase } from '@cyberstars/shared/webTests';
import { judgeWebCase } from './web-tests.js';

const RUNNER = path.join(import.meta.dirname, 'lesson-tests.runner.web.cjs');

function hasBrowser(): boolean {
  const dir =
    process.env.PLAYWRIGHT_BROWSERS_PATH ?? path.join(os.homedir(), '.cache', 'ms-playwright');
  try {
    // The headless shell, or the full browser where there is no shell for the OS
    return fs.readdirSync(dir).some((name) => /^chromium(_headless_shell)?-\d+$/.test(name));
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
      actions: WEB_ACTION_KEYS,
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

  it('reads the effect of a style: room, contrast, a look of its own, the middle, the outline', () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><head><style>
        body { margin: 0; background: #0b1d3a; color: #f0f4ff; }
        main { max-width: 600px; margin: 0 auto; padding: 0 16px; }
        .off { width: 200px; margin-left: 10px; }
        .card { padding: 1rem; margin-bottom: 12px; border: 2px dashed oklch(70% 0.1 250); }
        .tight { margin-bottom: 0; }
        .warning { color: hsl(0, 100%, 85%); }
        .paper { background: white; }
        .grey { color: #777; }
        .black { color: black; }
        .veil { background: rgba(255, 255, 255, 0.5); }
      </style></head><body><main>
        <h1>Station</h1><h2>Crew</h2><h4>Night</h4>
        <div class="card">A</div><div class="card">B</div><div class="card tight">C</div><div class="card">D</div>
        <p class="warning">Hatch 3</p><p>Plain</p>
        <div class="paper"><p class="grey">Faint</p><p class="black">Ink</p></div>
        <div class="veil"><p class="on-veil">Veiled</p></div>
        <div class="off">Off</div>
      </main></body></html>`,
    };
    const one = (steps: WebTestCase['steps']): WebTestCase => ({ name: 'x', visible: true, steps });
    const card = { label: 'a card' };
    const [
      room,
      tooMuch,
      border,
      readable,
      faint,
      ink,
      veiled,
      differs,
      alike,
      gapOk,
      gapLow,
      centered,
      off,
      outline,
    ] = verdicts(files, [
      one([{ style: '.card', prop: 'padding-left', atLeast: 12, every: true, ...card }]),
      one([{ style: '.card', prop: 'padding-left', atMost: 8, ...card }]),
      one([{ style: '.card', prop: 'border-top-style', not: 'none', ...card }]),
      one([{ contrast: 'main > h1, .warning', atLeast: 4.5, every: true, label: 'the text' }]),
      one([{ contrast: '.grey', atLeast: 4.5, label: 'the faint line' }]),
      one([{ contrast: '.black', atLeast: 21, label: 'the ink' }]),
      one([{ contrast: '.on-veil', atLeast: 4.5, label: 'the veiled line' }]),
      one([
        {
          differs: '.warning',
          from: 'main > p:not(.warning)',
          props: ['color', 'font-weight'],
          fromLabel: 'the other paragraphs',
          label: 'the warning',
        },
      ]),
      one([
        {
          differs: '.warning',
          from: 'main > p',
          props: ['color'],
          fromLabel: 'every paragraph',
          label: 'the warning',
        },
      ]),
      one([{ layout: 'main > div.card:nth-of-type(-n+2)', arrange: 'column', gap: 12, ...card }]),
      one([{ layout: '.card', arrange: 'column', gap: 12, label: 'the cards' }]),
      one([{ centered: 'main', label: 'the column' }]),
      one([{ centered: '.off', label: 'the box' }]),
      one([{ outline: true }]),
    ]);
    expect(room.passed).toBe(true);
    expect(tooMuch.web).toMatchObject({ kind: 'style', compare: 'atMost', found: '16px' });
    expect(border.passed).toBe(true);
    expect(readable.passed).toBe(true);
    // #777 on white is 4.48:1, just under
    expect(faint.web).toMatchObject({ kind: 'contrast', found: '4.48' });
    expect(ink.passed).toBe(true);
    // White over half-white over the dark page: light on light
    expect(veiled.web).toMatchObject({ kind: 'contrast' });
    expect(differs.passed).toBe(true);
    expect(alike.web).toMatchObject({ kind: 'differs' });
    expect(gapOk.passed).toBe(true);
    expect(gapLow.web).toMatchObject({ kind: 'gap', found: '0' });
    expect(centered.passed).toBe(true);
    expect(off.web).toMatchObject({ kind: 'centered', found: expect.stringMatching(/^10 /) });
    expect(outline.web).toMatchObject({ kind: 'outline', other: 'h4', found: 'Night' });
  });

  it("reads a :hover rule after hover, and a pseudo-element's content and look", () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><head><style>
        a { color: rgb(0, 0, 255); }
        a:hover { color: rgb(255, 0, 0); }
        h1::before { content: "★ "; color: rgb(0, 128, 0); }
      </style></head><body><h1>Station Log</h1><a href="#">Crew</a></body></html>`,
    };
    const cases: WebTestCase[] = [
      {
        name: 'Hover and a mark',
        visible: true,
        steps: [
          { style: 'a', prop: 'color', equals: 'rgb(0, 0, 255)', label: 'the link' },
          { hover: 'a', label: 'the link' },
          { style: 'a', prop: 'color', equals: 'rgb(255, 0, 0)', label: 'the link' },
          {
            style: 'h1',
            pseudo: '::before',
            prop: 'content',
            equals: '"★ "',
            label: 'the mark before the heading',
          },
          {
            style: 'h1',
            pseudo: '::before',
            prop: 'color',
            equals: 'rgb(0, 128, 0)',
            label: 'the mark before the heading',
          },
          {
            style: 'h1',
            pseudo: '::after',
            prop: 'content',
            equals: 'none',
            label: 'nothing after',
          },
        ],
      },
      {
        name: 'Hover over nothing',
        visible: true,
        steps: [{ hover: '.card', label: 'a crew card' }],
      },
    ];
    const [styled, nothing] = verdicts(files, cases);
    expect(styled.passed).toBe(true);
    expect(nothing.web).toEqual({ kind: 'missing', label: 'a crew card' });
  });

  it('reads a style a transition is moving to as where it ends', () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><head><style>
        tr { background-color: rgb(0, 0, 0); transition: background-color 2s; }
        tr:hover { background-color: rgb(200, 100, 50); }
        button { color: rgb(0, 0, 0); transition: color 2s linear; }
        .on { color: rgb(255, 255, 255); }
      </style></head><body><table><tr><td>A</td></tr></table>
      <button onclick="this.classList.add('on')">Go</button></body></html>`,
    };
    const cases: WebTestCase[] = [
      {
        name: 'Transitions',
        visible: true,
        steps: [
          { hover: 'tr', label: 'the row' },
          { style: 'tr', prop: 'background-color', equals: 'rgb(200, 100, 50)', label: 'the row' },
          { click: 'button', label: 'the button' },
          { style: 'button', prop: 'color', equals: 'rgb(255, 255, 255)', label: 'the button' },
        ],
      },
    ];
    expect(verdicts(files, cases)[0].passed).toBe(true);
  });

  it("checks every element's style with every, the first one's without", () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><head><style>
        h2:first-of-type::after { content: "~"; }
      </style></head><body><h2>A</h2><h2>B</h2></body></html>`,
    };
    const after = { style: 'h2', pseudo: '::after', prop: 'content', equals: '"~"' } as const;
    const cases: WebTestCase[] = [
      { name: 'First', visible: true, steps: [{ ...after, label: 'a heading' }] },
      { name: 'Every', visible: true, steps: [{ ...after, every: true, label: 'a heading' }] },
    ];
    const [first, every] = verdicts(files, cases);
    expect(first.passed).toBe(true);
    expect(every.web).toMatchObject({ kind: 'style', detail: '::after content', found: 'none' });
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
