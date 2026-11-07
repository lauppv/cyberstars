// What runs first in every page the preview shows (CYB-109), before any of
// the student's scripts. The preview is a sandboxed frame with an origin of
// its own, where the browser refuses localStorage and where the student's
// links and fetches would lead nowhere, so the prelude:
//
// * keeps localStorage (and sessionStorage) in a stand-in with the same
//   methods, whose data the IDE saves;
// * answers fetch() of the site's own files from the files themselves;
// * turns a link to another page of the site into a message, so the IDE
//   shows that page, and keeps the page from leaving for another site or
//   sending a form somewhere;
// * sends what the page logs, and the errors it throws, to the IDE's console,
//   and says so when it runs code in a string, which the preview refuses;
// * holds the clock behind the loop guards (scriptGuard.ts).
//
// `previewPrelude` is written into the page as its source text, so it may use
// nothing from outside itself: no imports, no helpers of this file.

export const PREVIEW_SOURCE = 'cyberstars-preview';

export interface PreludeConfig {
  // Where the IDE is: the only window the prelude talks to
  parentOrigin: string;
  // The page shown, a path of the site
  page: string;
  // The site's text files, which fetch() answers with
  files: Record<string, string>;
  // The run name of each of the site's scripts (a blob: URL once the preview
  // made them) to its path, so an error names the file
  scripts: Record<string, string>;
  // What localStorage held when the page was last shown
  storage: Record<string, string>;
  // The message of the error that stops a loop, with {line} and {file}
  loopMessage: string;
  // How long a loop may run, in ms
  loopLimitMs: number;
  // What the console says when the page runs code in a string (eval)
  evalMessage: string;
}

// What the page tells the IDE
export type PreviewMessage =
  | { type: 'ready' }
  | {
      type: 'console';
      level: 'log' | 'info' | 'warn' | 'error';
      text: string;
      file?: string;
      line?: number;
    }
  | { type: 'loop'; file: string; line: number }
  | { type: 'navigate'; path: string }
  | { type: 'outsideLink'; href: string }
  | { type: 'formSent'; fields: string }
  | { type: 'storage'; data: Record<string, string> };

// The most a page keeps in localStorage, in characters of keys and values
export const PREVIEW_STORAGE_LIMIT = 100_000;
// The most one console line carries
export const PREVIEW_TEXT_LIMIT = 2_000;

export function previewPrelude(config: PreludeConfig): void {
  const STORAGE_LIMIT = 100_000;
  const TEXT_LIMIT = 2_000;
  const SOURCE = 'cyberstars-preview';
  const post = (message: Record<string, unknown>) =>
    window.parent.postMessage({ source: SOURCE, ...message }, config.parentOrigin);

  // ── Loop guards ──────────────────────────────────────────────────────────
  // A loop is stopped once it has kept the page busy for too long. A loop
  // that waits (await, yield) lets the page run its timers in between, which
  // `beat` counts: one that has seen a beat since its clock started is not
  // holding the page, so its clock starts over. A loop can't see a beat
  // while it holds the page, since no timer runs then.
  const started: Record<number, number> = {};
  const turns: Record<number, number> = {};
  const beats: Record<number, number> = {};
  let beat = 0;
  setInterval(() => {
    beat += 1;
  }, 100);
  // Once a loop is stopped, every loop is until the page gets its turn
  // back: a try/catch around the stopped loop can't keep a loop around it
  // going
  let stopping = false;
  const start = (id: number) => {
    started[id] = Date.now();
    beats[id] = beat;
  };
  (window as unknown as Record<string, unknown>).__cyberstars = {
    s(id: number) {
      start(id);
      turns[id] = 0;
    },
    t(id: number) {
      if (stopping) return true;
      const turn = (turns[id] = (turns[id] ?? 0) + 1);
      // Reading the clock every turn would slow every loop down, so it is
      // read on turns 1, 2, 4 … 64 (a loop whose turns are slow is caught
      // early), then every 128th
      if (turn & 127 && turn & (turn - 1)) return false;
      if (beats[id] !== beat) {
        start(id);
        return false;
      }
      return Date.now() - (started[id] ?? Date.now()) > config.loopLimitMs;
    },
    e(line: number, file: string) {
      if (!stopping) {
        stopping = true;
        setTimeout(() => {
          stopping = false;
        }, 0);
      }
      post({ type: 'loop', file, line });
      return new Error(config.loopMessage.replace('{line}', String(line)).replace('{file}', file));
    },
  };

  // ── Console ──────────────────────────────────────────────────────────────
  const show = (value: unknown, depth: number): string => {
    if (typeof value === 'string') return depth === 0 ? value : JSON.stringify(value);
    if (value === undefined) return 'undefined';
    if (typeof value === 'function') return `function ${value.name || ''}()`;
    if (typeof value === 'symbol' || typeof value === 'bigint') return String(value);
    if (value === null || typeof value !== 'object') return String(value);
    if (value instanceof Error) return `${value.name}: ${value.message}`;
    if (value instanceof Element) return `<${value.tagName.toLowerCase()}>`;
    if (depth > 3) return Array.isArray(value) ? '[…]' : '{…}';
    if (Array.isArray(value)) return `[${value.map((v) => show(v, depth + 1)).join(', ')}]`;
    const entries = Object.keys(value).map(
      (key) => `${key}: ${show((value as Record<string, unknown>)[key], depth + 1)}`,
    );
    return `{${entries.join(', ')}}`;
  };
  const line = (args: unknown[]) => {
    const text = args.map((a) => show(a, 0)).join(' ');
    return text.length > TEXT_LIMIT ? `${text.slice(0, TEXT_LIMIT)}…` : text;
  };
  for (const level of ['log', 'info', 'warn', 'error', 'debug'] as const) {
    const own = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
      post({ type: 'console', level: level === 'debug' ? 'log' : level, text: line(args) });
      own(...args);
    };
  }
  // A script of the site names its line; one inside the page names only the
  // page, since the page the preview writes isn't laid out line for line as
  // the student's
  window.addEventListener('error', (event) => {
    const file = config.scripts[event.filename];
    post({
      type: 'console',
      level: 'error',
      text: line([event.error ?? event.message]),
      file: file ?? (event.filename === window.location.href ? config.page : undefined),
      line: file ? event.lineno || undefined : undefined,
    });
  });
  // The preview's policy refuses code in a string; setTimeout("…") would
  // otherwise just not run
  window.addEventListener('securitypolicyviolation', (event) => {
    if (event.blockedURI === 'eval')
      post({ type: 'console', level: 'error', text: config.evalMessage });
  });
  window.addEventListener('unhandledrejection', (event) => {
    post({ type: 'console', level: 'error', text: line([event.reason]) });
  });

  // ── Storage ──────────────────────────────────────────────────────────────
  const makeStorage = (start: Record<string, string>, save: boolean) => {
    const data: Record<string, string> = { ...start };
    const size = () =>
      Object.keys(data).reduce((sum, key) => sum + key.length + data[key].length, 0);
    const changed = () => {
      if (save) post({ type: 'storage', data: { ...data } });
    };
    return {
      get length() {
        return Object.keys(data).length;
      },
      key: (index: number) => Object.keys(data)[index] ?? null,
      getItem: (key: string) =>
        Object.prototype.hasOwnProperty.call(data, String(key)) ? data[String(key)] : null,
      setItem(key: string, value: string) {
        const k = String(key);
        const before = data[k];
        data[k] = String(value);
        if (size() > STORAGE_LIMIT) {
          if (before === undefined) delete data[k];
          else data[k] = before;
          throw new DOMException('The site has used all of its storage', 'QuotaExceededError');
        }
        changed();
      },
      removeItem(key: string) {
        delete data[String(key)];
        changed();
      },
      clear() {
        for (const key of Object.keys(data)) delete data[key];
        changed();
      },
    };
  };
  const local = makeStorage(config.storage, true);
  const session = makeStorage({}, false);
  Object.defineProperty(window, 'localStorage', { configurable: true, get: () => local });
  Object.defineProperty(window, 'sessionStorage', { configurable: true, get: () => session });

  // ── The site's own files ─────────────────────────────────────────────────
  // A path of the site a reference in the shown page leads to, or null for
  // another site (as resolveWebPath in packages/shared/webFiles.ts)
  const resolve = (ref: string): string | null => {
    const bare = ref.trim().split(/[?#]/)[0];
    if (!bare || /^[a-z][a-z0-9+.-]*:/i.test(bare) || bare.startsWith('//')) return null;
    const parts = bare.startsWith('/') ? [] : config.page.split('/').slice(0, -1);
    for (const part of bare.split('/')) {
      if (part === '' || part === '.') continue;
      if (part === '..') {
        if (parts.length === 0) return null;
        parts.pop();
      } else {
        let name = part;
        try {
          name = decodeURIComponent(part);
        } catch {
          // kept as written
        }
        parts.push(name);
      }
    }
    return parts.length ? parts.join('/') : null;
  };
  const TYPES: Record<string, string> = {
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    txt: 'text/plain',
  };
  const realFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string') {
      const path = resolve(input);
      if (path !== null) {
        const content = config.files[path];
        if (content === undefined) {
          return Promise.resolve(new Response('Not found', { status: 404 }));
        }
        const ext = path.slice(path.lastIndexOf('.') + 1).toLowerCase();
        return Promise.resolve(
          new Response(content, { headers: { 'Content-Type': TYPES[ext] ?? 'text/plain' } }),
        );
      }
    }
    return realFetch(input, init);
  };

  // ── Links and forms ──────────────────────────────────────────────────────
  // Last in line, so a page that handles the click or the submit itself
  // (preventDefault) keeps it.
  window.addEventListener('click', (event) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) return;
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    if (href.startsWith('#')) return;
    event.preventDefault();
    const path = resolve(href);
    post(path === null ? { type: 'outsideLink', href } : { type: 'navigate', path });
  });
  window.addEventListener('submit', (event) => {
    if (event.defaultPrevented || !(event.target instanceof HTMLFormElement)) return;
    event.preventDefault();
    const fields: string[] = [];
    new FormData(event.target).forEach((value, key) => {
      fields.push(`${key}=${typeof value === 'string' ? value : value.name}`);
    });
    post({ type: 'formSent', fields: line([fields.join('&')]) });
  });

  post({ type: 'ready' });
}
