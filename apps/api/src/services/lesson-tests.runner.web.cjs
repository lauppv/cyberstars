// The web judge's runner (CYB-110), run in the web sandbox (cyberstars-web-sandbox:
// Node, playwright-core and a headless Chromium) as `node /work/_runner.cjs
// /work/_payload.json`. It serves the student's site from memory on its own
// origin, opens each case's page in a fresh browser context at the case's
// width, walks its steps and prints what the page had at each one. It never
// decides a verdict: the server compares what it prints with what the mission
// asks, so no expected value enters the sandbox.
//
// Protocol, as the other runners: a header line ({ ready: true }, or
// { launchError } when the browser didn't start), then one JSON line per case,
// { steps: [observation...], timedOut?, crashed? }, after which it waits for
// "next" or "stop" on stdin.
'use strict';

const fs = require('fs');
const readline = require('readline');
const { chromium } = require('playwright-core');

const ORIGIN = 'http://site.test';

const TYPES = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8',
  txt: 'text/plain; charset=utf-8',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
};

function typeOf(path) {
  const dot = path.lastIndexOf('.');
  return TYPES[dot < 0 ? '' : path.slice(dot + 1).toLowerCase()] || 'application/octet-stream';
}

function print(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

// The server's replies, one line each
const replies = [];
const waiting = [];
readline.createInterface({ input: process.stdin }).on('line', (line) => {
  const next = waiting.shift();
  if (next) next(line.trim());
  else replies.push(line.trim());
});
function reply() {
  if (replies.length) return Promise.resolve(replies.shift());
  return new Promise((resolve) => waiting.push(resolve));
}

class StepTimeout extends Error {}
class PageCrash extends Error {}

// Chromium says a page ran out of its JavaScript heap on its stderr
// ("V8 javascript OOM"). Its renderer is meant to die then, which Playwright
// reports as a crash, but on some hosts (GitHub's runners) it stays up at full
// CPU and no crash ever comes, so the case would read as a timeout. The line is
// taken as the crash. Cases run one at a time, so it is the open case's page.
const outOfMemory = { listener: null };

function within(promise, ms) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new StepTimeout()), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

// The path of a site address: `/` and a folder open their index.html. An
// address the page made up (`%E0`) is no file of the site, not a crash
function sitePath(url) {
  let path;
  try {
    path = decodeURIComponent(url.pathname.slice(1));
  } catch {
    return url.pathname.slice(1);
  }
  if (path === '' || path.endsWith('/')) path += 'index.html';
  return path;
}

function body(file) {
  return typeof file === 'string' ? file : Buffer.from(file.base64, 'base64');
}

async function serve(context, files, answers) {
  // A page closed while a request was still being answered (the next case,
  // a stuck page) must not take the run down with it
  await context.route('**/*', (route) => answer(route, files, answers).catch(() => {}));
}

// Every request of the page: a file of the site, a fixed answer, or nothing
// (async, so a throw comes back as a rejection the route catches)
async function answer(route, files, answers) {
  const request = route.request();
  let url;
  try {
    url = new URL(request.url());
  } catch {
    return route.abort('blockedbyclient');
  }
  if (url.origin === ORIGIN) {
    const path = sitePath(url);
    const file = Object.hasOwn(files, path) ? files[path] : undefined;
    if (file === undefined) {
      return route.fulfill({ status: 404, contentType: 'text/plain', body: 'Not found' });
    }
    return route.fulfill({ status: 200, contentType: typeOf(path), body: body(file) });
  }
  const fixed = Object.hasOwn(answers, url.href) ? answers[url.href] : undefined;
  if (fixed) {
    return route.fulfill({
      status: fixed.status ?? 200,
      contentType: fixed.type ?? 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: fixed.body,
    });
  }
  // Nothing leaves the sandbox; an address the case didn't answer fails
  return route.abort('internetdisconnected');
}

const MAX_ELEMENTS = 50;

async function observe(page, step, seen) {
  if ('fits' in step) {
    return { scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth) };
  }
  if ('logged' in step) return { logs: [...seen.logs] };
  if ('noErrors' in step) return { errors: [...seen.errors] };
  if ('at' in step) return { page: sitePath(new URL(page.url())) };

  const selector =
    step.exists ?? step.count ?? step.text ?? step.attr ?? step.style ?? step.layout ?? step.size;
  const elements = page.locator(`css=${selector}`);
  const count = await elements.count();
  if ('exists' in step || 'count' in step || count === 0) return { count };
  // What the page shows as an element's text: spaces collapsed, as it reads
  if ('text' in step) {
    const values = await elements.evaluateAll(
      (els, max) =>
        els
          .slice(0, max)
          .map((el) => (el.innerText ?? el.textContent ?? '').replace(/\s+/g, ' ').trim()),
      MAX_ELEMENTS,
    );
    return { count, values };
  }
  if ('attr' in step) {
    return { count, values: [await elements.first().getAttribute(step.name)] };
  }
  if ('style' in step) {
    const value = await elements
      .first()
      .evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop), step.prop);
    return { count, values: [value] };
  }
  const boxes = await elements.evaluateAll(
    (els, max) =>
      els.slice(0, max).map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height };
      }),
    'size' in step ? 1 : MAX_ELEMENTS,
  );
  return { count, boxes };
}

// An action, and the page it may lead to: a link, a form or a script that
// moves to another page is followed to that page's load
async function act(page, step, nav, stepMs) {
  if ('open' in step) {
    await page.goto(`${ORIGIN}/${step.open}`, { waitUntil: 'load', timeout: stepMs });
    await settle(page, nav, stepMs);
    return { ok: true };
  }
  if ('wait' in step) {
    await page.waitForTimeout(step.wait);
    await settle(page, nav, stepMs);
    return { ok: true };
  }
  const selector = step.click ?? step.fill ?? step.submit ?? step.on;
  if (selector !== undefined) {
    const element = page.locator(`css=${selector}`);
    if ((await element.count()) === 0) return { ok: false };
    const first = element.first();
    if ('click' in step) await first.click({ timeout: stepMs });
    else if ('fill' in step) await first.fill(step.text, { timeout: stepMs });
    else if ('submit' in step) {
      await first.evaluate((form) => {
        if (form instanceof HTMLFormElement) form.requestSubmit();
        else form.closest('form')?.requestSubmit();
      });
    } else await first.press(step.press, { timeout: stepMs });
  } else {
    await page.keyboard.press(step.press);
  }
  await settle(page, nav, stepMs);
  return { ok: true };
}

// Waits until the page has nothing left to load: a navigation the action
// started (it shows up as a request first) and every file or fetch answer its
// scripts asked for, then a moment for what they do with them. All of it is
// served from memory, so it takes milliseconds
async function settle(page, nav, stepMs) {
  const until = Date.now() + stepMs;
  await page.waitForTimeout(30);
  while (Date.now() < until) {
    if (nav.pending) await page.waitForEvent('load', { timeout: stepMs });
    else if (nav.inflight > 0) await page.waitForTimeout(20);
    else break;
  }
  await page.waitForTimeout(30);
}

const ACTIONS = ['click', 'fill', 'press', 'submit', 'open', 'wait'];

async function runCase(browser, files, testCase, limits) {
  const steps = [];
  const seen = { logs: [], errors: [] };
  const nav = { pending: false, inflight: 0 };
  let crashed = false;
  let onCrash;
  const crash = new Promise((_, reject) => {
    onCrash = () => {
      crashed = true;
      reject(new PageCrash());
    };
  });
  crash.catch(() => {});
  // A step ends at once when its page runs out of memory
  const guarded = (work) => within(Promise.race([work, crash]), limits.stepMs);
  const context = await browser.newContext({
    viewport: { width: testCase.width, height: limits.height },
    serviceWorkers: 'block',
  });
  try {
    await serve(context, files, testCase.fetch ?? {});
    const page = await context.newPage();
    page.on('console', (message) => {
      const text = message.text();
      if (message.type() === 'error') seen.errors.push(text);
      else seen.logs.push(text);
    });
    page.on('pageerror', (error) => seen.errors.push(error.message));
    page.on('crash', onCrash);
    outOfMemory.listener = onCrash;
    page.on('request', (request) => {
      nav.inflight += 1;
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) nav.pending = true;
    });
    const done = () => {
      nav.inflight = Math.max(0, nav.inflight - 1);
    };
    page.on('requestfinished', done);
    page.on('requestfailed', done);
    page.on('load', () => {
      nav.pending = false;
    });
    try {
      await guarded(
        page
          .goto(`${ORIGIN}/${testCase.page}`, { waitUntil: 'load', timeout: limits.stepMs })
          .then(() => settle(page, nav, limits.stepMs)),
      );
      for (const step of testCase.steps) {
        const isAction = ACTIONS.some((key) => key in step);
        steps.push(
          await guarded(isAction ? act(page, step, nav, limits.stepMs) : observe(page, step, seen)),
        );
      }
    } catch (err) {
      if (crashed || /crash/i.test(String(err && err.message))) return { steps, crashed: true };
      if (err instanceof StepTimeout || (err && err.name === 'TimeoutError')) {
        return { steps, timedOut: true };
      }
      throw err;
    }
    return crashed ? { steps, crashed: true } : { steps };
  } finally {
    outOfMemory.listener = null;
    // A page stuck in a loop may never close; the run ends after it anyway
    await within(context.close(), 2000).catch(() => {});
  }
}

// The browser is started as a server, so its stderr is ours to read, and
// driven over a connection to it
async function launch(args) {
  try {
    // The headless shell (the image's) or, where an OS has none, the full
    // browser in its headless mode
    return await chromium.launchServer({ args });
  } catch {
    return await chromium.launchServer({ args, channel: 'chromium' });
  }
}

async function main() {
  const payload = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  // The container is the sandbox: Chromium's own needs privileges it hasn't
  const args = ['--no-sandbox', `--js-flags=--max-old-space-size=${payload.heapMb}`];
  let server;
  let browser;
  try {
    server = await launch(args);
    readline.createInterface({ input: server.process().stderr }).on('line', (line) => {
      if (outOfMemory.listener && line.includes('V8 javascript OOM')) outOfMemory.listener();
    });
    browser = await chromium.connect(server.wsEndpoint());
  } catch (err) {
    if (server) await within(server.close(), 2000).catch(() => {});
    print({ launchError: String(err && err.message) });
    return;
  }
  print({ ready: true });
  for (const testCase of payload.cases) {
    const files = { ...payload.files, ...(testCase.files ?? {}) };
    print(await runCase(browser, files, testCase, payload));
    if ((await reply()) !== 'next') break;
  }
  await within(browser.close(), 2000).catch(() => {});
  await within(server.close(), 2000).catch(() => {});
}

main().then(
  () => process.exit(0),
  (err) => {
    process.stderr.write(`${err && err.stack ? err.stack : err}\n`);
    process.exit(1);
  },
);
