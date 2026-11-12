import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { previewPrelude, PREVIEW_SOURCE } from './previewPrelude';

// The prelude takes over this test window as it would the preview's: its
// console, storage, fetch, links and forms.
const sent: Record<string, unknown>[] = [];
let atStart: Record<string, unknown>[] = [];
const realFetch = vi.fn(async () => new Response('real'));
const realOpen = vi.fn();

beforeAll(() => {
  vi.spyOn(window, 'postMessage').mockImplementation((message: unknown, origin: unknown) => {
    expect(origin).toBe('http://localhost:5173');
    sent.push(message as Record<string, unknown>);
  });
  window.fetch = realFetch as unknown as typeof fetch;
  XMLHttpRequest.prototype.open = realOpen;
  URL.createObjectURL = vi.fn(() => 'blob:null/file');
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  previewPrelude({
    parentOrigin: 'http://localhost:5173',
    page: 'pages/crew.html',
    files: { 'data/crew.json': '["Ana"]', 'pages/crew.html': '<p></p>', 'index.html': '' },
    scripts: { 'blob:null/123': 'js/app.js' },
    storage: { theme: 'dark' },
    loopMessage: 'Stopped the loop on line {line} of {file}',
    loopLimitMs: 2000,
    evalMessage: 'No code in strings',
  });
  atStart = [...sent];
});

beforeEach(() => {
  sent.length = 0;
  document.body.innerHTML = '';
});

const last = () => sent[sent.length - 1];
const guard = () =>
  (window as unknown as { __cyberstars: Record<string, CallableFunction> }).__cyberstars;

describe('previewPrelude', () => {
  it('says it is ready, to the lesson only', () => {
    expect(atStart).toEqual([{ source: PREVIEW_SOURCE, type: 'ready' }]);
  });

  it("sends the page's title once it is read", () => {
    document.title = 'Station Log';
    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(last()).toEqual({ source: PREVIEW_SOURCE, type: 'title', text: 'Station Log' });
  });

  it("sends the page's height once it is read, for a lesson's preview cell", () => {
    const box = vi
      .spyOn(document.documentElement, 'getBoundingClientRect')
      .mockReturnValue({ height: 120.4 } as DOMRect);
    document.dispatchEvent(new Event('DOMContentLoaded'));
    box.mockRestore();
    expect(sent).toContainEqual({ source: PREVIEW_SOURCE, type: 'height', height: 121 });
  });

  it('sends the title again when a script changes it', async () => {
    document.title = 'Launch in 3';
    await Promise.resolve();
    expect(last()).toEqual({ source: PREVIEW_SOURCE, type: 'title', text: 'Launch in 3' });
  });

  it("sends what the page logs, values shown as a browser's console would", () => {
    const loop: Record<string, unknown> = { name: 'Ana' };
    loop.self = loop;
    console.log('crew', 3, null, undefined, [1, 'two'], { a: { b: { c: { d: { e: 1 } } } } });
    expect(last()).toEqual({
      source: 'cyberstars-preview',
      type: 'console',
      level: 'log',
      text: 'crew 3 null undefined [1, "two"] {a: {b: {c: {d: {…}}}}}',
    });
    console.error(new TypeError('bad'), document.createElement('div'), () => 1);
    expect(last()).toMatchObject({ level: 'error', text: 'TypeError: bad <div> function ()' });
    console.log(loop);
    expect(String(last().text).length).toBeLessThanOrEqual(2001);
    console.log('x'.repeat(5000));
    expect(String(last().text)).toHaveLength(2001);
  });

  it('sends an error the page throws, naming the file', () => {
    window.dispatchEvent(
      new ErrorEvent('error', {
        message: 'boom',
        error: new ReferenceError('x is not defined'),
        filename: 'blob:null/123',
        lineno: 4,
      }),
    );
    expect(last()).toEqual({
      source: 'cyberstars-preview',
      type: 'console',
      level: 'error',
      text: 'ReferenceError: x is not defined',
      file: 'js/app.js',
      line: 4,
    });
  });

  it('names only the page for an error in a script inside it', () => {
    window.dispatchEvent(
      new ErrorEvent('error', {
        message: 'oops',
        filename: window.location.href,
        lineno: 30,
      }),
    );
    expect(last()).toMatchObject({ text: 'oops', file: 'pages/crew.html', line: undefined });
    window.dispatchEvent(new ErrorEvent('error', { message: 'far', filename: 'https://x/y.js' }));
    expect(last()).toMatchObject({ text: 'far', file: undefined });
  });

  it('keeps localStorage in a stand-in the lesson saves', () => {
    expect(localStorage.getItem('theme')).toBe('dark');
    localStorage.setItem('crew', '3');
    expect(last()).toMatchObject({ type: 'storage', data: { theme: 'dark', crew: '3' } });
    expect(localStorage.length).toBe(2);
    expect(localStorage.key(1)).toBe('crew');
    expect(localStorage.getItem('nope')).toBeNull();
    localStorage.removeItem('crew');
    expect(last()).toMatchObject({ data: { theme: 'dark' } });
    expect(() => localStorage.setItem('big', 'x'.repeat(100_001))).toThrow(DOMException);
    expect(localStorage.getItem('big')).toBeNull();
    localStorage.clear();
    expect(localStorage.length).toBe(0);
    expect(last()).toMatchObject({ data: {} });
  });

  it('keeps sessionStorage to the page alone', () => {
    sessionStorage.setItem('step', '1');
    expect(sessionStorage.getItem('step')).toBe('1');
    expect(sent).toEqual([]);
  });

  it("answers fetch() of the site's files from them, and the rest from the network", async () => {
    const own = await fetch('../data/crew.json');
    expect(await own.json()).toEqual(['Ana']);
    expect(own.headers.get('Content-Type')).toBe('application/json');
    expect((await fetch('/data/none.json')).status).toBe(404);
    await fetch('https://api.example/ships');
    expect(realFetch).toHaveBeenCalledWith('https://api.example/ships', undefined);
  });

  it('answers a URL or a Request for a file of the site the same way', async () => {
    const here = window.location.href;
    // Made against the preview's address: the page's folder first, then the site's
    expect(await (await fetch(new URL('crew.html', here))).text()).toBe('<p></p>');
    expect(await (await fetch(new URL('../data/crew.json', here))).json()).toEqual(['Ana']);
    expect(await (await fetch(new Request(new URL('/data/crew.json', here)))).json()).toEqual([
      'Ana',
    ]);
    expect((await fetch(new URL('nope.json', here))).status).toBe(404);
    realFetch.mockClear();
    const far = new URL('https://api.example/ships');
    await fetch(far);
    expect(realFetch).toHaveBeenCalledWith(far, undefined);
  });

  it("reads an XMLHttpRequest of the site's files from them, a missing one a 404", () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../data/crew.json');
    expect(realOpen).toHaveBeenLastCalledWith('GET', 'blob:null/file');
    const blob = vi.mocked(URL.createObjectURL).mock.calls.at(-1)![0] as Blob;
    expect(blob.type).toBe('application/json');
    xhr.open('GET', 'https://api.example/ships', true);
    expect(realOpen).toHaveBeenLastCalledWith('GET', 'https://api.example/ships', true);
    const missing = new XMLHttpRequest();
    missing.open('GET', 'none.json');
    Object.defineProperty(missing, 'readyState', { get: () => 4 });
    expect(missing.status).toBe(404);
    expect(missing.statusText).toBe('Not Found');
  });

  it('says so when the page runs code in a string, which the preview refuses', () => {
    const refused = (blockedURI: string) =>
      window.dispatchEvent(Object.assign(new Event('securitypolicyviolation'), { blockedURI }));
    refused('eval');
    expect(last()).toMatchObject({ type: 'console', level: 'error', text: 'No code in strings' });
    sent.length = 0;
    refused('https://far.example/x.js');
    expect(sent).toEqual([]);
  });

  it('turns links into the page to show, or a note for another site', () => {
    document.body.innerHTML =
      '<a id="home" href="../index.html">home</a><a id="out" href="https://example.com">out</a><a id="top" href="#top">top</a><a id="own" href="x.html">own</a>';
    document.getElementById('own')!.addEventListener('click', (e) => e.preventDefault());
    const click = (id: string) => {
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      document.getElementById(id)!.dispatchEvent(event);
      return event.defaultPrevented;
    };
    expect(click('home')).toBe(true);
    expect(last()).toMatchObject({ type: 'navigate', path: 'index.html' });
    expect(click('out')).toBe(true);
    expect(last()).toMatchObject({ type: 'outsideLink', href: 'https://example.com' });
    sent.length = 0;
    expect(click('top')).toBe(false);
    click('own');
    expect(sent).toEqual([]);
  });

  it('keeps a form from leaving, saying what it sent', () => {
    document.body.innerHTML =
      '<form><input name="name" value="Ana"><input name="seat" value="4"></form>';
    const event = new Event('submit', { bubbles: true, cancelable: true });
    document.querySelector('form')!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(last()).toMatchObject({ type: 'formSent', fields: 'name=Ana&seat=4' });
  });

  it('stops a loop that runs too long, and tells the lesson', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(0);
    guard().s(7);
    let stopped = false;
    for (let turn = 1; turn <= 1000 && !stopped; turn++) {
      if (turn === 300) now.mockReturnValue(2001);
      stopped = guard().t(7);
    }
    expect(stopped).toBe(true);
    const error = guard().e(12, 'js/app.js') as Error;
    expect(error.message).toBe('Stopped the loop on line 12 of js/app.js');
    expect(last()).toMatchObject({ type: 'loop', file: 'js/app.js', line: 12 });
    // Until the page gets its turn back every loop stops, a loop around the
    // stopped one too
    guard().s(8);
    expect(guard().t(8)).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    // A loop that starts again starts its clock again
    guard().s(7);
    now.mockReturnValue(2500);
    expect(guard().t(7)).toBe(false);
    now.mockRestore();
  });

  it('catches a loop whose turns are slow within a few turns', () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(0);
    guard().s(9);
    expect(guard().t(9)).toBe(false);
    now.mockReturnValue(2500);
    expect(guard().t(9)).toBe(true);
    now.mockRestore();
  });

  it('lets a loop that waits run as long as it likes', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(0);
    guard().s(10);
    for (let turn = 1; turn <= 512; turn++) {
      if (turn % 128 === 0) {
        // The loop awaits a timer: the page runs its own in between
        await new Promise((resolve) => setTimeout(resolve, 120));
        now.mockReturnValue(turn * 1000);
      }
      expect(guard().t(10)).toBe(false);
    }
    // One that keeps the page busy, awaiting nothing that lets it go, is not
    now.mockReturnValue(1_000_000);
    let stopped = false;
    for (let turn = 0; turn < 128 && !stopped; turn++) {
      await Promise.resolve();
      stopped = guard().t(10);
    }
    expect(stopped).toBe(true);
    now.mockRestore();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});
