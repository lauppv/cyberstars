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
type SiteFile = string | { base64: string };

function run(files: Record<string, SiteFile>, cases: WebTestCase[], stepMs = 3000): Ran[] {
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
function verdicts(files: Record<string, SiteFile>, cases: WebTestCase[], stepMs?: number) {
  const pages = new Set(Object.keys(files));
  return run(files, cases, stepMs).map((ran, i) => judgeWebCase(cases[i], i, ran as never, pages));
}

const CARDS = `<!DOCTYPE html><html><head><style>
  .cards { display: flex; gap: 16px; }
  .card { width: 200px; height: 80px; }
  @media (max-width: 600px) { .cards { flex-direction: column; } }
</style></head><body><div class="cards"><div class="card">A</div><div class="card">B</div></div></body></html>`;

const STACKED = `<!DOCTYPE html><html><body><div class="card">A</div><div class="card">B</div></body></html>`;

// Every test drives a real Chromium, a case at a time: past vitest's 5s on a busy CI runner
describe.skipIf(!hasBrowser())('web runner', { timeout: 30_000 }, () => {
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

  it('tells a picture whose file loaded from one whose file is missing, whatever its size', () => {
    const svg = encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>',
    );
    const files = {
      'index.html': `<!DOCTYPE html><html><body>
        <img class="ok" src="data:image/svg+xml,${svg}" alt="A dot">
        <img class="lost" src="img/gone.svg" alt="A dot" width="240" height="150"></body></html>`,
    };
    const [ok, lost] = verdicts(files, [
      { name: 'Found', visible: true, steps: [{ loaded: '.ok', label: 'the dot' }] },
      { name: 'Lost', visible: true, steps: [{ loaded: '.lost', label: 'the dot' }] },
    ]);
    expect(ok.passed).toBe(true);
    expect(lost.web).toMatchObject({ kind: 'loaded' });
  });

  it('tells a video or a sound that loaded, plays or is muted, and reads its words', () => {
    const assets = path.join(
      import.meta.dirname,
      '../../../../packages/content/lessons/web-dev/assets',
    );
    const asset = (file: string) => ({
      base64: fs.readFileSync(path.join(assets, file)).toString('base64'),
    });
    const files = {
      'index.html': `<!DOCTYPE html><html><body>
        <video class="shown" src="video/launch.webm" controls>
          <track src="words.vtt" kind="captions" srclang="en" label="English">
        </video>
        <video class="own" src="video/launch.webm" autoplay muted loop></video>
        <video class="loud" src="video/launch.webm" autoplay></video>
        <audio src="audio/countdown.mp3" controls></audio>
        <audio class="later" src="audio/countdown.mp3" preload="none" controls></audio>
        <audio class="later-lost" src="audio/gone.mp3" preload="none" controls></audio>
        <video class="lost" src="video/gone.webm" controls><track src="gone.vtt"></video>
        <button onclick="document.querySelector('.own').muted = false">Sound</button>
      </body></html>`,
      'words.vtt': 'WEBVTT\n\n00:00.000 --> 00:02.000\nLift off',
      'video/launch.webm': asset('video/launch.webm'),
      'audio/countdown.mp3': asset('audio/countdown.mp3'),
    };
    const cases: WebTestCase[] = [
      {
        name: 'Loaded',
        visible: true,
        steps: [
          {
            loaded: '.shown, .shown track, audio:not(.later-lost)',
            label: 'the video, its words and the sounds',
          },
        ],
      },
      {
        name: 'Lost sound read only on play',
        visible: true,
        steps: [{ loaded: '.later-lost', label: 'the lost sound' }],
      },
      {
        name: 'Plays on its own only when muted',
        visible: true,
        steps: [
          { playing: '.own', label: 'the muted video' },
          { muted: '.own', label: 'the muted video' },
          { playing: '.loud', off: true, label: 'the loud video' },
          { playing: '.shown', off: true, label: 'the video with buttons' },
          { click: 'button', label: 'the Sound button' },
          { muted: '.own', off: true, label: 'the muted video' },
        ],
      },
      { name: 'Lost video', visible: true, steps: [{ loaded: '.lost', label: 'the lost video' }] },
      {
        name: 'Lost words',
        visible: true,
        steps: [{ loaded: '.lost track', label: 'the lost words' }],
      },
      { name: 'Loud', visible: true, steps: [{ playing: '.loud', label: 'the loud video' }] },
    ];
    const [loaded, laterLost, playing, lost, lostWords, loud] = verdicts(files, cases);
    expect(loaded.passed).toBe(true);
    expect(laterLost.web).toEqual({ kind: 'loaded', label: 'the lost sound', detail: 'media' });
    expect(playing.passed).toBe(true);
    expect(lost.web).toEqual({ kind: 'loaded', label: 'the lost video', detail: 'media' });
    expect(lostWords.web).toEqual({ kind: 'loaded', label: 'the lost words', detail: 'media' });
    expect(loud.web).toEqual({ kind: 'playing', label: 'the loud video', expected: 'on' });
  });

  it('fixes the clock, moves it on with a wait, and reads what a returning visitor saved', () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><body>
        <p id="day"></p><p id="left">3</p><p id="theme"></p><p id="soon"></p><p id="frame"></p>
        <script>
          setTimeout(() => (document.querySelector('#soon').textContent = 'soon'), 0);
          requestAnimationFrame(() => (document.querySelector('#frame').textContent = 'drawn'));
          const now = new Date();
          document.querySelector('#day').textContent =
            now.toLocaleDateString('en-US', { weekday: 'long' }) + ' ' + now.getHours();
          let left = 3;
          const timer = setInterval(() => {
            left = left - 1;
            document.querySelector('#left').textContent = left;
            if (left === 0) clearInterval(timer);
          }, 1000);
          document.querySelector('#theme').textContent = localStorage.getItem('theme') ?? 'none';
          localStorage.setItem('theme', 'light');
        </script>
      </body></html>`,
    };
    const cases: WebTestCase[] = [
      {
        name: 'A fixed clock',
        visible: true,
        clock: '2031-05-14T09:30:00',
        storage: { theme: 'dark' },
        steps: [
          { text: '#day', equals: 'Wednesday 9', label: 'the day' },
          { text: '#soon', equals: 'soon', label: 'what a timer of 0 ms wrote' },
          { text: '#frame', equals: 'drawn', label: 'what the first frame drew' },
          { text: '#left', equals: '3', label: 'what is left' },
          { wait: 2000 },
          { text: '#left', equals: '1', label: 'what is left' },
          { wait: 3000 },
          { text: '#left', equals: '0', label: 'what is left' },
          { text: '#theme', equals: 'dark', label: 'the theme saved' },
          { open: 'index.html' },
          { text: '#theme', equals: 'light', label: 'the theme saved' },
        ],
      },
      {
        name: 'Nothing saved',
        visible: true,
        steps: [{ text: '#theme', equals: 'none', label: 'the theme saved' }],
      },
    ];
    expect(verdicts(files, cases).map((v) => v.passed)).toEqual([true, true]);
  });

  it('opens a page as the system asks, dark or with less movement, and reads the focus', () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><head><style>
        body { background-color: white; }
        @media (prefers-color-scheme: dark) { body { background-color: black; } }
        .dot, .lost { display: inline-block; }
        .dot { animation: pulse 1s infinite; }
        .lost { animation: nowhere 1s infinite; }
        @media (prefers-reduced-motion: reduce) { .dot { animation: none; } }
        @keyframes pulse { to { opacity: 0.2; } }
      </style></head><body>
        <span class="dot">•</span><span class="lost">•</span><input id="name"><button>Go</button>
        <script>
          document.querySelector('button').addEventListener('click', () =>
            document.querySelector('#name').focus());
        </script>
      </body></html>`,
    };
    const light = {
      style: 'body',
      prop: 'background-color',
      equals: 'rgb(255, 255, 255)',
      label: 'the page',
    };
    const dark = {
      style: 'body',
      prop: 'background-color',
      equals: 'rgb(0, 0, 0)',
      label: 'the page',
    };
    const moving = { animated: '.dot', label: 'the dot' };
    const still = { animated: '.dot', off: true as const, label: 'the dot' };
    const cases: WebTestCase[] = [
      { name: 'Light', visible: true, steps: [light, moving] },
      {
        name: 'No keyframes',
        visible: true,
        steps: [{ animated: '.lost', label: 'the lost dot' }],
      },
      {
        name: 'Dark',
        visible: true,
        colorScheme: 'dark',
        reducedMotion: true,
        steps: [dark, still],
      },
      {
        name: 'Focus',
        visible: true,
        steps: [
          { click: 'button', label: 'the button' },
          { focused: '#name', label: 'the name field' },
        ],
      },
      { name: 'Focus left', visible: true, steps: [{ focused: '#name', label: 'the name field' }] },
      {
        name: 'Focus elsewhere',
        visible: true,
        steps: [
          { click: 'button', label: 'the button' },
          { focused: 'button', label: 'the button' },
        ],
      },
    ];
    const [lit, lost, darkened, focus, nowhere, elsewhere] = verdicts(files, cases);
    expect(lit.passed).toBe(true);
    expect(lost.web).toEqual({ kind: 'animated', label: 'the lost dot', expected: 'on' });
    expect(darkened.passed).toBe(true);
    expect(focus.passed).toBe(true);
    expect(nowhere.web).toEqual({ kind: 'focused', label: 'the name field', found: null });
    expect(elsewhere.web).toEqual({
      kind: 'focused',
      label: 'the button',
      found: '<input id="name">',
    });
  });

  it('says which file a responsive picture shows at each width', () => {
    const assets = path.join(
      import.meta.dirname,
      '../../../../packages/content/lessons/web-dev/assets',
    );
    const asset = (file: string) => ({
      base64: fs.readFileSync(path.join(assets, file)).toString('base64'),
    });
    const files = {
      'index.html': `<!DOCTYPE html><html><body>
        <img class="sized" src="img/earth-small.jpg" alt=""
          srcset="img/earth-small.jpg 640w, img/earth-large.jpg 1280w" sizes="100vw">
        <picture>
          <source media="(max-width: 600px)" srcset="img/earth-square.jpg">
          <img class="framed" src="img/earth-large.jpg" alt="">
        </picture>
      </body></html>`,
      'img/earth-small.jpg': asset('img/earth-small.jpg'),
      'img/earth-large.jpg': asset('img/earth-large.jpg'),
      'img/earth-square.jpg': asset('img/earth-square.jpg'),
    };
    const at = (width: number, sized: string, framed: string): WebTestCase => ({
      name: `At ${width}`,
      visible: true,
      width,
      steps: [
        { shows: '.sized', file: sized, label: 'the sized picture' },
        { shows: '.framed', file: framed, label: 'the framed picture' },
      ],
    });
    const cases = [
      at(375, 'img/earth-small.jpg', 'img/earth-square.jpg'),
      at(1280, 'img/earth-large.jpg', 'img/earth-large.jpg'),
      at(375, 'img/earth-large.jpg', 'img/earth-square.jpg'),
    ];
    const [phone, computer, wrong] = verdicts(files, cases);
    expect(phone.passed).toBe(true);
    expect(computer.passed).toBe(true);
    expect(wrong.web).toEqual({
      kind: 'shows',
      label: 'the sized picture',
      expected: 'img/earth-large.jpg',
      found: 'img/earth-small.jpg',
    });
  });

  it('writes console values as the preview does: an element, a list, an object', () => {
    const files = {
      'index.html':
        '<!DOCTYPE html><html><body><h1>Crew</h1><script>console.log(document.querySelector("h1")); console.log("crew", [1, "two"], { name: "Ana" }); console.log(4);</script></body></html>',
    };
    const [run] = verdicts(files, [
      {
        name: 'Console',
        visible: true,
        steps: [{ logged: '<h1>' }, { logged: 'crew [1, "two"] {name: "Ana"}' }, { logged: '4' }],
      },
    ]);
    expect(run.passed).toBe(true);
  });

  it('keeps up with a busy console, a page that moves on and a too long line', () => {
    const files = {
      'index.html':
        '<!DOCTYPE html><html><body><h1 id="go">Go</h1><script>for (let i = 0; i < 5000; i++) console.log("Line", i); console.log("x".repeat(2100)); document.querySelector("#go").onclick = () => { console.log(document.querySelector("h1")); location.href = "next.html"; };</script></body></html>',
      'next.html': '<!DOCTYPE html><html><body><p>Next</p></body></html>',
    };
    const [run] = verdicts(files, [
      {
        name: 'Console',
        visible: true,
        steps: [
          { logged: 'Line 4999' },
          { logged: `${'x'.repeat(2000)}…` },
          { click: '#go', label: 'the heading' },
          { at: 'next.html' },
          { logged: '<h1>' },
        ],
      },
    ]);
    expect(run.passed).toBe(true);
  });

  it("reads a first letter's and a list marker's style", () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><head><style>
        p::first-letter { font-size: 40px; } li::marker { color: rgb(255, 209, 102); }
      </style></head><body><p>Hello</p><ul><li>One</li></ul></body></html>`,
    };
    const [run] = verdicts(files, [
      {
        name: 'Pseudo',
        visible: true,
        steps: [
          {
            style: 'p',
            prop: 'font-size',
            pseudo: '::first-letter',
            atLeast: 40,
            label: 'the first letter',
          },
          {
            style: 'li',
            prop: 'color',
            pseudo: '::marker',
            equals: 'rgb(255, 209, 102)',
            label: 'the bullet',
          },
          { style: 'p', prop: 'font-size', atMost: 20, label: 'the paragraph' },
        ],
      },
    ]);
    expect(run.passed).toBe(true);
  });

  it('notes a message box and closes it, so the page goes on', () => {
    const files = {
      'index.html':
        '<!DOCTYPE html><html><body><p id="after"></p><script>alert("Hi crew"); document.querySelector("#after").textContent = "on";</script></body></html>',
    };
    const [run] = verdicts(files, [
      {
        name: 'Box',
        visible: true,
        steps: [{ alerted: 'Hi crew' }, { text: '#after', equals: 'on', label: 'the line' }],
      },
    ]);
    expect(run.passed).toBe(true);
  });

  it('tells a page that starts with <!DOCTYPE html> from one without', () => {
    const files = {
      'index.html': '<!DOCTYPE html><html><body><h1>Station Log</h1></body></html>',
      'old.html': '<html><body><h1>Station Log</h1></body></html>',
    };
    const [modern, old] = verdicts(files, [
      { name: 'Modern', visible: true, steps: [{ doctype: true }] },
      { name: 'Old', visible: true, page: 'old.html', steps: [{ doctype: true }] },
    ]);
    expect(modern.passed).toBe(true);
    expect(old.web).toMatchObject({ kind: 'doctype' });
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
        <nav style="text-align: center"><a href="#">Home</a> <a href="#">Crew</a></nav>
        <nav class="left"><a href="#">Home</a> <a href="#">Crew</a></nav>
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
      links,
      leftLinks,
      fullTitle,
      narrowBox,
    ] = verdicts(files, [
      one([{ style: '.card', prop: 'padding-left', atLeast: 12, every: true, ...card }]),
      one([{ style: '.card', prop: 'padding-left', atMost: 8, ...card }]),
      one([{ style: '.card', prop: 'border-top-style', not: 'none', ...card }]),
      one([
        {
          contrast: 'main > h1, .warning',
          atLeast: 4.5,
          on: 'dark',
          every: true,
          label: 'the text',
        },
      ]),
      one([{ contrast: '.grey', atLeast: 4.5, label: 'the faint line' }]),
      one([{ contrast: '.black', atLeast: 21, on: 'light', label: 'the ink' }]),
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
      one([{ centered: 'nav:not(.left) a', label: 'the links' }]),
      one([{ centered: 'nav.left a', label: 'the links' }]),
      one([{ fills: 'main > h1', label: 'the title' }]),
      one([{ fills: '.off', label: 'the box' }]),
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
    // Links taken together: in the middle of their bar, or at its start
    expect(links.passed).toBe(true);
    expect(leftLinks.web).toMatchObject({ kind: 'centered', found: expect.stringMatching(/^0 /) });
    expect(fullTitle.passed).toBe(true);
    expect(narrowBox.web).toMatchObject({ kind: 'fills', found: '200' });
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

  it("reads a corner's radius as a length: a percentage of the box, an ellipse's smaller radius", () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><head><style>
        .round { width: 100px; height: 100px; border-radius: 50%; }
        .oval { width: 200px; height: 100px; border-radius: 12px / 8px; }
        .hair { width: 100px; height: 100px; border-radius: 2%; }
      </style></head><body>
        <div class="round"></div><div class="oval"></div><div class="hair"></div>
      </body></html>`,
    };
    const corner = (style: string, atLeast: number): WebTestCase => ({
      name: 'x',
      visible: true,
      steps: [{ style, prop: 'border-top-left-radius', atLeast, label: 'a box' }],
    });
    const [round, oval, hair] = verdicts(files, [
      corner('.round', 50),
      corner('.oval', 8),
      corner('.hair', 4),
    ]);
    // Half of 100px across and down
    expect(round.passed).toBe(true);
    // As round as its smaller radius, 8px
    expect(oval.passed).toBe(true);
    expect(hair.web).toMatchObject({ kind: 'style', found: '2px' });
  });

  it('reads a transparent background color under a gradient as the gradient', () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><head><style>
        .faded { background: linear-gradient(#13294f, #2c4a7a); }
      </style></head><body><div class="faded">Panel</div><p>Plain</p></body></html>`,
    };
    const filled = (style: string): WebTestCase => ({
      name: 'x',
      visible: true,
      steps: [{ style, prop: 'background-color', not: 'rgba(0, 0, 0, 0)', label: 'a box' }],
    });
    const [panel, plain] = verdicts(files, [filled('.faded'), filled('p')]);
    expect(panel.passed).toBe(true);
    expect(plain.web).toMatchObject({ kind: 'style', found: 'rgba(0, 0, 0, 0)' });
  });

  it("compares the background that shows behind each element, its own or a parent's", () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><head><style>
        html { background: #0b1d3a; }
        nav { background: #0b1d3a; }
        tbody tr:nth-child(even) td { background: #13294f; }
        thead tr { background: #2c4a7a; }
      </style></head><body>
        <nav>Bar</nav>
        <table><thead><tr><th>A</th></tr></thead>
        <tbody><tr><td>1</td></tr><tr><td>2</td></tr><tr><td>3</td></tr></tbody></table>
      </body></html>`,
    };
    const unlike = (differs: string, from: string): WebTestCase => ({
      name: 'x',
      visible: true,
      steps: [
        { differs, from, props: ['background-color'], fromLabel: 'the others', label: 'these' },
      ],
    });
    const [bar, stripes, head] = verdicts(files, [
      unlike('nav', 'body'),
      unlike('tbody tr:nth-child(even) td', 'tbody tr:nth-child(odd) td'),
      unlike('th', 'td'),
    ]);
    // The page's color sits on <html>, the bar's is the same
    expect(bar.web).toMatchObject({ kind: 'differs' });
    // Colored on the cells, or on the header's row
    expect(stripes.passed).toBe(true);
    expect(head.passed).toBe(true);
  });

  it('centers the elements that take room, a hidden one left out', () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><body style="margin: 0">
        <nav style="text-align: center"><a href="#main" style="display: none">Skip</a><a href="#">Home</a> <a href="#">Crew</a></nav>
      </body></html>`,
    };
    const [links] = verdicts(files, [
      { name: 'x', visible: true, steps: [{ centered: 'nav a', label: 'the links' }] },
    ]);
    expect(links.passed).toBe(true);
  });

  it('keeps a sent form on its page and reads what it sent, as the preview does', () => {
    const page = (script: string) => `<!DOCTYPE html><html><body>
      <form action="thanks.html">
        <label>Name <input id="name" name="name" required></label>
        <select id="seat" name="seat"><option value="aisle">Aisle</option><option value="window">Window</option></select>
        <label><input type="checkbox" id="meal" name="extras" value="meal"> Meal</label>
        <label><input type="checkbox" id="wifi" name="extras" value="wifi"> Wi-Fi</label>
        <button>Board</button>
      </form>
      <p id="out"></p>
      <script>${script}</script>
    </body></html>`;
    const cases: WebTestCase[] = [
      {
        name: 'An empty name keeps the form from being sent',
        visible: true,
        steps: [{ submit: 'form', label: 'the form' }, { notSent: true }],
      },
      {
        name: 'The form sends the name, the seat and the extras',
        visible: true,
        steps: [
          { fill: '#name', text: 'Ida', label: 'the name field' },
          { select: '#seat', option: 'Window', label: 'the seat list' },
          { click: '#meal', label: 'the meal box' },
          { click: '#wifi', label: 'the Wi-Fi box' },
          { value: '#seat', equals: 'window', label: 'the seat list' },
          { checked: '#meal', label: 'the meal box' },
          { value: '#name', equals: 'Ida', label: 'the name field' },
          { click: 'button', label: 'the Board button' },
          { sent: { name: 'Ida', seat: 'window', extras: 'wifi' } },
          { at: 'index.html' },
        ],
      },
    ];
    expect(verdicts({ 'index.html': page('') }, cases).map((c) => c.passed)).toEqual([true, true]);
    // A page that sends nothing itself still reads as not sent
    const handled = page(
      "document.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); document.getElementById('out').textContent = 'Saved'; });",
    );
    const [, own] = verdicts({ 'index.html': handled }, cases);
    expect(own.web).toEqual({ kind: 'sent', detail: 'none' });
    const [noOption] = verdicts({ 'index.html': page('') }, [
      {
        name: 'x',
        visible: true,
        steps: [{ select: '#seat', option: 'Roof', label: 'the seat list' }],
      },
    ]);
    expect(noOption.web).toEqual({ kind: 'missing', label: 'the seat list' });
    const [unticked] = verdicts({ 'index.html': page('') }, [
      { name: 'x', visible: true, steps: [{ checked: '#meal', label: 'the meal box' }] },
    ]);
    expect(unticked.web).toEqual({ kind: 'checked', label: 'the meal box', expected: 'on' });
  });

  it('keeps a refused form refused, its field marked, case after case', () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><head><style>
        input:user-invalid { outline: 3px solid red; }
      </style></head><body><form>
        <input id="name" name="name" required minlength="2"><button>Send</button>
      </form></body></html>`,
    };
    const refused: WebTestCase = {
      name: 'A short name is refused',
      visible: true,
      steps: [
        { fill: '#name', text: 'I', label: 'the name box' },
        { click: 'button', label: 'the Send button' },
        { notSent: true },
        { style: '#name', prop: 'outline-style', equals: 'solid', label: 'the name box' },
      ],
    };
    const sent: WebTestCase = {
      name: 'A whole name is sent',
      visible: true,
      steps: [
        { fill: '#name', text: 'Ida', label: 'the name box' },
        { click: 'button', label: 'the Send button' },
        { sent: { name: 'Ida' } },
      ],
    };
    expect(verdicts(files, [refused, sent, refused, sent]).map((c) => c.passed)).toEqual([
      true,
      true,
      true,
      true,
    ]);
  });

  it('scrolls, and tells a sticky header from one that scrolled away', () => {
    const page = (position: string) => `<!DOCTYPE html><html><body style="margin: 0">
      <header style="position: ${position}; top: 0; height: 60px; background: #123; color: white; z-index: 1">Station</header>
      <main style="height: 3000px">Long page</main>
      <footer id="end">The end</footer>
    </body></html>`;
    const cases: WebTestCase[] = [
      {
        name: 'The header stays on screen',
        visible: true,
        steps: [
          { inView: '#end', out: true, label: 'the end' },
          { scroll: 800 },
          { inView: 'header', label: 'the header' },
          { onTop: 'header', label: 'the header' },
          { scroll: 'end' },
          { inView: '#end', label: 'the end' },
        ],
      },
    ];
    expect(verdicts({ 'index.html': page('sticky') }, cases)[0].passed).toBe(true);
    const [scrolledAway] = verdicts({ 'index.html': page('static') }, cases);
    expect(scrolledAway.web).toMatchObject({ kind: 'inView', label: 'the header', expected: 'in' });
  });

  it('says what covers an element, and an element against an edge of its box', () => {
    const files = {
      'index.html': `<!DOCTYPE html><html><body style="margin: 0">
        <div class="card" style="position: relative; width: 300px; height: 200px; padding: 16px">
          <span class="badge" style="position: absolute; top: 8px; right: 8px">New</span>
          <span class="tag">Old</span>
          <button style="position: absolute; bottom: 16px; left: 16px">Open</button>
        </div>
        <p id="hidden-under">Under</p>
        <div style="position: absolute; top: 230px; left: 0; width: 100%; height: 40px; background: red" class="banner"></div>
      </body></html>`,
    };
    const [ok] = verdicts(files, [
      {
        name: 'x',
        visible: true,
        steps: [
          {
            against: '.badge',
            in: '.card',
            side: 'top right',
            inLabel: 'its card',
            label: 'the badge',
          },
          {
            against: 'button',
            in: '.card',
            side: 'bottom',
            inLabel: 'its card',
            label: 'the button',
          },
          { onTop: '.badge', label: 'the badge' },
        ],
      },
    ]);
    expect(ok.passed).toBe(true);
    const [far, covered] = verdicts(files, [
      {
        name: 'x',
        visible: true,
        steps: [
          {
            against: '.tag',
            in: '.card',
            side: 'top right',
            inLabel: 'its card',
            label: 'the tag',
          },
        ],
      },
      { name: 'y', visible: true, steps: [{ onTop: '#hidden-under', label: 'the note' }] },
    ]);
    expect(far.web).toMatchObject({ kind: 'against', detail: 'top right', expected: '24' });
    expect(covered.web).toEqual({
      kind: 'onTop',
      label: 'the note',
      found: '<div class="banner">',
    });
    const [wave] = verdicts(
      {
        'index.html': `<!DOCTYPE html><html><body style="margin: 0">
          <p id="note">Note</p>
          <svg class="wave" style="position: absolute; top: 0; left: 0; width: 100%; height: 100px"></svg>
        </body></html>`,
      },
      [{ name: 'x', visible: true, steps: [{ onTop: '#note', label: 'the note' }] }],
    );
    expect(wave.web).toEqual({ kind: 'onTop', label: 'the note', found: '<svg class="wave">' });
  });

  it('reads the order things show in, whatever the HTML, and whether they wrap', () => {
    const page = (css: string) => `<!DOCTYPE html><html><head><style>
      .bar { display: flex; ${css} } .bar a { width: 200px; }
    </style></head><body style="margin: 0"><nav class="bar" style="width: 500px">
      <a id="home">Home</a><a id="crew" style="order: -1">Crew</a><a id="wiki">Wiki</a>
    </nav></body></html>`;
    const cases: WebTestCase[] = [
      {
        name: 'Crew first',
        visible: true,
        steps: [{ order: ['#crew', '#home', '#wiki'], label: 'the menu links' }],
      },
      { name: 'Wraps', visible: true, steps: [{ wraps: '.bar a', label: 'the menu links' }] },
    ];
    const [order, wrap] = verdicts({ 'index.html': page('flex-wrap: wrap') }, cases);
    expect(order.passed).toBe(true);
    expect(wrap.passed).toBe(true);
    const [, oneRow] = verdicts({ 'index.html': page('') }, cases);
    // Flex items shrink to stay on one row
    expect(oneRow.web).toMatchObject({ kind: 'wraps', detail: 'one' });
    const [wrongOrder] = verdicts({ 'index.html': page('flex-direction: row-reverse') }, cases);
    expect(wrongOrder.web).toEqual({
      kind: 'order',
      label: 'the menu links',
      expected: 'Crew, Home, Wiki',
      found: 'Wiki, Home, Crew',
    });
    const [, out] = verdicts(
      {
        'index.html': page('flex-shrink: 0').replace(
          '.bar a { width',
          '.bar a { flex-shrink: 0; width',
        ),
      },
      cases,
    );
    expect(out.web).toMatchObject({ kind: 'wraps', detail: 'out' });
    const [, column] = verdicts({ 'index.html': page('flex-direction: column') }, cases);
    expect(column.web).toMatchObject({ kind: 'wraps', detail: 'column' });
  });

  it('tells an element that shows from one hidden any way', () => {
    const hidden = [
      'display: none',
      'visibility: hidden',
      'opacity: 0',
      'height: 0; overflow: hidden',
      'position: absolute; left: -9999px',
      // A menu slid off the right, one slid under the window
      'position: fixed; top: 0; right: 0; transform: translateX(100%)',
      'position: fixed; bottom: 0; margin: 0; transform: translateY(100%)',
    ];
    const files = {
      'index.html': `<!DOCTYPE html><html><body>
        <p id="shown">Here</p>
        ${hidden.map((css) => `<p class="gone" style="${css}">Gone</p>`).join('')}
        <div style="display: none"><p id="inside">Inside</p></div>
        <p id="low" style="margin-top: 1200px">Further down</p>
      </body></html>`,
    };
    const [ok, notShown, shownAsHidden] = verdicts(files, [
      {
        name: 'x',
        visible: true,
        steps: [
          { visible: '#shown', label: 'the note' },
          { visible: '#low', label: 'the note further down' },
          { hidden: '.gone', label: 'the hidden notes' },
          { hidden: '#inside', label: 'the inner note' },
        ],
      },
      { name: 'y', visible: true, steps: [{ visible: '#inside', label: 'the inner note' }] },
      { name: 'z', visible: true, steps: [{ hidden: 'p', label: 'the notes' }] },
    ]);
    expect(ok.passed).toBe(true);
    expect(notShown.web).toEqual({ kind: 'visible', label: 'the inner note', expected: 'visible' });
    expect(shownAsHidden.web).toEqual({ kind: 'visible', label: 'the notes', expected: 'hidden' });
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
