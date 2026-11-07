import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { extensionOf, type WebFile } from '@cyberstars/shared/webFiles';
import { buildPreviewPage, type PreviewPage } from './previewDocument';
import {
  PREVIEW_SOURCE,
  PREVIEW_STORAGE_LIMIT,
  PREVIEW_TEXT_LIMIT,
  type PreviewMessage,
} from './previewPrelude';

// The preview of a web lesson's site (CYB-109): the page shown, the frame that
// shows it and the console under it. The frame is drawn again from scratch a
// moment after the files stop changing, and at once on `run` (Ctrl+Enter in
// the editor, Show the page again) or when the page moves to another one of
// the site. A loop stopped for running too long pauses that until the next
// `run`, so a page that loops on load can't be started over and over while
// the student types.

export interface ConsoleEntry {
  id: number;
  level: 'log' | 'info' | 'warn' | 'error';
  text: string;
  // The file and line it came from, when known
  where?: string;
}

// How long the files stay still before the preview follows them, in ms
const SETTLE_MS = 600;
// How long a loop may run before it is stopped, in ms
const LOOP_LIMIT_MS = 2000;
const MAX_ENTRIES = 500;
const LEVELS = new Set(['log', 'info', 'warn', 'error']);

// The site's images, as data: URLs the preview's own origin can show. Kept for
// the visit; one that fails to load is asked for again next time.
const imageCache = new Map<string, Promise<string | null>>();
function loadImage(url: string): Promise<string | null> {
  let pending = imageCache.get(url);
  if (!pending) {
    pending = fetch(url)
      .then((res) => (res.ok ? res.blob() : null))
      .then(
        (blob) =>
          blob &&
          new Promise<string | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          }),
      )
      .catch(() => null)
      .then((data) => {
        if (data === null) imageCache.delete(url);
        return data;
      });
    imageCache.set(url, pending);
  }
  return pending;
}

export function assetUrl(courseKey: string, path: string): string {
  return `/lessons/${courseKey}/assets/${path}`;
}

function storageKey(courseKey: string, lessonSlug: string): string {
  return `cyberstars.webStorage.${courseKey}/${lessonSlug}`;
}

function readStorage(key: string): Record<string, string> {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) ?? '{}');
    return isStorage(data) ? data : {};
  } catch {
    return {};
  }
}

function isStorage(data: unknown): data is Record<string, string> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  let size = 0;
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== 'string') return false;
    size += key.length + value.length;
  }
  return size <= PREVIEW_STORAGE_LIMIT;
}

const clip = (text: string) =>
  text.length > PREVIEW_TEXT_LIMIT ? `${text.slice(0, PREVIEW_TEXT_LIMIT)}…` : text;

interface Options {
  files: WebFile[];
  courseKey: string;
  lessonSlug: string;
}

export function useWebPreview({ files, courseKey, lessonSlug }: Options) {
  const { t } = useTranslation();
  const pages = useMemo(
    () =>
      files
        .filter((f) => extensionOf(f.path) === 'html')
        .map((f) => f.path)
        .sort(
          (a, b) => Number(b === 'index.html') - Number(a === 'index.html') || a.localeCompare(b),
        ),
    [files],
  );
  const [chosenPage, setChosenPage] = useState('index.html');
  // A page that went away (renamed, deleted) gives way to the first one left
  const page = pages.includes(chosenPage) ? chosenPage : (pages[0] ?? null);
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);
  const [paused, setPaused] = useState(false);
  // The page in the frame, and the frame's number: a new number is a new frame
  const [frame, setFrame] = useState<{ id: number; page: PreviewPage } | null>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const nextId = useRef(0);
  const nextEntry = useRef(0);
  const built = useRef<PreviewPage | null>(null);
  // The files the frame was last drawn from
  const drawn = useRef('');

  const add = useCallback((level: ConsoleEntry['level'], text: string, where?: string) => {
    setEntries((list) =>
      [...list, { id: nextEntry.current++, level, text: clip(text), where }].slice(-MAX_ENTRIES),
    );
  }, []);
  const clear = useCallback(() => setEntries([]), []);

  // The latest of each, for a render that started before they changed
  const latest = useRef({ files, page, t, courseKey, lessonSlug });
  useEffect(() => {
    latest.current = { files, page, t, courseKey, lessonSlug };
  });

  const render = useCallback(async () => {
    const { files: now, page: shown, t: tr, courseKey: course, lessonSlug: slug } = latest.current;
    drawn.current = JSON.stringify(now);
    if (!shown) {
      built.current = null;
      setFrame(null);
      return;
    }
    const images: Record<string, string> = {};
    await Promise.all(
      now
        .filter((f) => f.image)
        .map(async (f) => {
          const data = await loadImage(assetUrl(course, f.path));
          if (data) images[f.path] = data;
        }),
    );
    const out = buildPreviewPage({
      files: now,
      page: shown,
      images,
      prelude: {
        parentOrigin: window.location.origin,
        storage: readStorage(storageKey(course, slug)),
        loopMessage: tr('web.console.loopStopped', { line: '{line}', file: '{file}' }),
        loopLimitMs: LOOP_LIMIT_MS,
        evalMessage: tr('web.console.evalBlocked'),
      },
    });
    built.current = out;
    // A reload starts its console over, as a browser's does
    setEntries(
      out.missing.map(({ file, from }) => ({
        id: nextEntry.current++,
        level: 'warn' as const,
        text: tr('web.console.missingFile', { file, from }),
      })),
    );
    setFrame({ id: nextId.current++, page: out });
  }, []);

  const run = useCallback(() => {
    setPaused(false);
    void render();
  }, [render]);

  // The files as text: a change of any of them, and only that, counts
  const filesKey = useMemo(() => JSON.stringify(files), [files]);
  useEffect(() => {
    if (paused || filesKey === drawn.current) return;
    // `run` may have drawn these files already while the timer waited
    const timer = setTimeout(() => {
      if (JSON.stringify(latest.current.files) !== drawn.current) void render();
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [filesKey, paused, render]);
  // Another page shows at once
  useEffect(() => {
    void render();
  }, [page, render]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const win = frameRef.current?.contentWindow;
      if (!win || event.source !== win) return;
      const data = event.data as { source?: unknown; type?: unknown } | null;
      if (!data || data.source !== PREVIEW_SOURCE) return;
      if (data.type === 'runtime') {
        const out = built.current;
        if (out)
          win.postMessage({ type: 'cyberstars-render', html: out.html, scripts: out.scripts }, '*');
        return;
      }
      const message = data as PreviewMessage;
      switch (message.type) {
        case 'console':
          if (LEVELS.has(message.level) && typeof message.text === 'string') {
            const where =
              typeof message.file === 'string'
                ? typeof message.line === 'number'
                  ? `${message.file}:${message.line}`
                  : message.file
                : undefined;
            add(message.level, message.text, where);
          }
          break;
        case 'loop':
          setPaused(true);
          break;
        case 'navigate':
          if (typeof message.path !== 'string') break;
          if (
            latest.current.files.some(
              (f) => f.path === message.path && extensionOf(f.path) === 'html',
            )
          ) {
            setChosenPage(message.path);
          } else {
            add('error', latest.current.t('web.console.noPage', { page: message.path }));
          }
          break;
        case 'outsideLink':
          if (typeof message.href === 'string') {
            add('info', latest.current.t('web.console.outsideLink', { href: message.href }));
          }
          break;
        case 'formSent':
          if (typeof message.fields === 'string') {
            add('info', latest.current.t('web.console.formSent', { fields: message.fields }));
          }
          break;
        case 'storage':
          if (isStorage(message.data)) {
            try {
              localStorage.setItem(
                storageKey(latest.current.courseKey, latest.current.lessonSlug),
                JSON.stringify(message.data),
              );
            } catch {
              // the page keeps its data until the next reload
            }
          }
          break;
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [add]);

  return {
    page,
    choosePage: setChosenPage,
    frame,
    frameRef,
    entries,
    clear,
    paused,
    run,
  };
}
