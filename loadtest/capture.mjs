// Opens, in a real browser, the pages the Locust test replays, and writes
// down every request each one makes, so the test asks for what a browser asks
// for and not a list kept by hand. The built file names change with every
// build, so box.sh runs this again each time it starts the app.
//
//   node loadtest/capture.mjs [base url]   (default http://localhost:8080)
//
// Writes loadtest/results/pages.json:
//   { visitorLanding, visitorLesson, studentApp, studentLesson: [{ method, path, body? }] }
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const BASE = process.argv[2] ?? 'http://localhost:8080';
// The page a visitor lands on from a search, and the one a student opens next
const LESSON = '/lesson/python/print';
const STUDENT_LESSON = '/lesson/python/variables-str';
const OUT = new URL('results/', import.meta.url);

const QUIET_MS = 1500;

// Every request the page makes until the network has been quiet for a while,
// in the order the browser sent them. Requests to other sites (fonts are
// bundled, but a video or an analytics script may not be) are left out: the
// test measures this server only. The page's own "network idle" can't be used:
// after a page change inside the app it was reached long before.
async function record(page, open) {
  const seen = [];
  let inFlight = 0;
  let lastActivity = Date.now();
  const onRequest = (req) => {
    inFlight++;
    lastActivity = Date.now();
    const url = new URL(req.url());
    if (url.origin !== BASE) return;
    const body = req.postData();
    seen.push({ method: req.method(), path: url.pathname + url.search, ...(body && { body }) });
  };
  const onDone = () => {
    inFlight--;
    lastActivity = Date.now();
  };
  page.on('request', onRequest);
  page.on('requestfinished', onDone);
  page.on('requestfailed', onDone);
  await open();
  const deadline = Date.now() + 30_000;
  while (inFlight > 0 || Date.now() - lastActivity < QUIET_MS) {
    if (Date.now() > deadline) throw new Error(`${page.url()}: still loading after 30 s`);
    await page.waitForTimeout(100);
  }
  page.off('request', onRequest);
  page.off('requestfinished', onDone);
  page.off('requestfailed', onDone);
  return seen;
}

const browser = await chromium.launch();

// A first visit: nothing cached, no cookies
async function visitor(path) {
  const context = await browser.newContext({ bypassCSP: true });
  const page = await context.newPage();
  const seen = await record(page, () => page.goto(BASE + path));
  await context.close();
  return seen;
}

// A student who already uses the app opens a lesson from inside it, the way
// they reach most lessons: the app is loaded, the lesson is a page change.
// A new account is held on the first lesson's tour until its tests pass, so
// this one passes them first, as every real student past the tour has.
async function student() {
  const context = await browser.newContext({ bypassCSP: true });
  const headers = { 'x-forwarded-for': '10.255.255.253' };
  const email = `capture-${Date.now()}@loadtest.cyberstars.app`;
  const signup = await context.request.post(`${BASE}/auth/signup`, {
    data: { name: 'Capture Student', email, password: 'loadtest-capture' },
    headers,
  });
  if (!signup.ok()) throw new Error(`signup: ${signup.status()} ${await signup.text()}`);
  const tour = await context.request.post(`${BASE}/api/tests/python/print/run`, {
    data: { code: 'print("Hello, Stars!")\n', lang: 'en' },
    headers,
  });
  if ((await tour.json()).status !== 'passed') throw new Error(`tour: ${await tour.text()}`);
  // and answers what they want to learn, which the app asks right after
  const interests = await context.request.put(`${BASE}/api/profile/interests`, {
    data: { interests: ['python'] },
    headers,
  });
  if (!interests.ok()) throw new Error(`interests: ${interests.status()}`);
  const page = await context.newPage();
  const app = await record(page, () => page.goto(`${BASE}/progress`));
  // What the router does on a link to the lesson
  const seen = await record(page, () =>
    page.evaluate((path) => {
      history.pushState(null, '', path);
      dispatchEvent(new PopStateEvent('popstate'));
    }, STUDENT_LESSON),
  );
  if (new URL(page.url()).pathname !== STUDENT_LESSON) throw new Error(`landed on ${page.url()}`);
  await context.close();
  return { app, lesson: seen };
}

const signedIn = await student();
const pages = {
  visitorLanding: await visitor('/'),
  visitorLesson: await visitor(LESSON),
  studentApp: signedIn.app,
  studentLesson: signedIn.lesson,
};
await browser.close();

mkdirSync(OUT, { recursive: true });
writeFileSync(new URL('pages.json', OUT), JSON.stringify(pages, null, 2) + '\n');
for (const [name, requests] of Object.entries(pages)) {
  console.log(`${name}: ${requests.length} requests`);
}
