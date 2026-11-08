import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, X } from 'lucide-react';
import {
  WEB_MAX_FILES,
  WEB_MAX_LENGTH,
  WEB_PREVIEW_PATH,
  extensionOf,
  parseWebFiles,
  serializeWebFiles,
  type WebFile,
} from '@cyberstars/shared/webFiles';
import { CodeEditor } from '../code/CodeEditor';
import { RunButton } from '../code/RunButton';
import { PanelTabs } from '../judge/PanelTabs';
import { ResizeHandle } from '../ui/ResizeHandle';
import { Segmented } from '../ui/Segmented';
import { useResizeSplit } from '../../hooks/useResizeSplit';
import { FileTree } from './FileTree';
import { addFile, addFolder, removePath, renamePath, type Site, type SiteError } from './siteFiles';
import { RunNotice } from './RunNotice';
import { assetUrl, useWebPreview, type ConsoleEntry } from './useWebPreview';

// A web lesson's workspace (CYB-109), a small IDE in the spirit of VS Code.
// The left side shows the lesson or the code (the site's files, the open ones
// in tabs beside them, an editor), the right side the site, with its console
// under it. The site follows the files as they change and shows the page
// last opened from them, or the one a link led to. On a phone the lesson,
// the code and the site are each a panel. The files travel as one text
// (packages/shared/webFiles.ts), which the lesson saves, resets and shares
// like any lesson's code.

interface WebWorkspaceProps {
  value: string;
  onChange: (value: string) => void;
  courseKey: string;
  lessonSlug: string;
  // What the console holds, for the tutor
  onConsole?: (text: string) => void;
  // The lesson's text and its results, which the left side shows by the code
  lesson: ReactNode;
  // The lesson's actions (save, solution, forum, reset, the tutor, dev mode)
  actions: ReactNode;
  // Dev mode is on: the IDE keeps splits of its own, saved on the device
  devMode?: boolean;
  // A note over the whole workspace (the saved code couldn't be loaded)
  banner?: ReactNode;
  // Run Tests, on a lesson with tests, beside Run over the site
  runTests?: ReactNode;
  // Why the last Run Tests got no verdict
  testsError?: string | null;
  // Goes up with each verdict, which the lesson side shows
  verdictShown?: number;
}

// Whether this device was told what Run is for (RunNotice)
const SEEN_KEY = 'cyberstars.webRunNotice.seen';

function runNoticeSeen(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markRunNoticeSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // ignore (private mode / storage disabled)
  }
}

type View = 'lesson' | 'code' | 'site';
// What the left side switches between
const SIDES = ['lesson', 'code'] as const;

const LEVEL_COLOR: Record<ConsoleEntry['level'], string> = {
  log: 'text-[var(--text)]',
  info: 'text-[var(--text2)]',
  warn: 'text-[var(--warning)]',
  error: 'text-[var(--error)]',
};

function firstToOpen(files: WebFile[]): string | null {
  const text = files.filter((f) => !f.image);
  return (text.find((f) => f.path === 'index.html') ?? text[0])?.path ?? null;
}

export default function WebWorkspace({
  value,
  onChange,
  courseKey,
  lessonSlug,
  onConsole,
  lesson,
  actions,
  devMode = false,
  banner,
  runTests,
  testsError,
  verdictShown = 0,
}: WebWorkspaceProps) {
  const { t } = useTranslation();
  const files = useMemo(() => parseWebFiles(value), [value]);
  const [folders, setFolders] = useState<string[]>([]);
  // The open tabs, null until the student opens or closes one: the site's
  // first page is open then, whenever its files arrive
  const [tabs, setTabs] = useState<string[] | null>(null);
  const [active, setActive] = useState<string | null>(null);
  // On a phone the panel shown; from @2xl the left side shows the lesson
  // unless it is the code, and the site is always on the right
  const [view, setView] = useState<View>('lesson');
  const [notice, setNotice] = useState<string | null>(null);
  // A verdict shows on the lesson side, in its Result tab
  const [verdictSeen, setVerdictSeen] = useState(verdictShown);
  if (verdictShown !== verdictSeen) {
    setVerdictSeen(verdictShown);
    setView('lesson');
  }
  // A change refused at a limit puts the editor back as it was
  const [editorKey, setEditorKey] = useState(0);
  // Taken apart, so the frame's ref is only ever handed to the frame
  const { page, choosePage, frame, frameRef, entries, clear, paused, run } = useWebPreview({
    files,
    courseKey,
    lessonSlug,
  });
  // Run draws the page again, for when it didn't follow the files by itself;
  // the first press on a device says so first
  const [runNotice, setRunNotice] = useState(false);
  const pressRun = () => {
    if (runNoticeSeen()) {
      run();
      return;
    }
    markRunNoticeSeen();
    setRunNotice(true);
  };
  const bandRef = useRef<HTMLDivElement>(null);
  const siteRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  // Dev mode keeps its own splits on the device, as on any lesson
  const plainSides = useResizeSplit({
    axis: 'x',
    initial: 50,
    min: 28,
    max: 68,
    containerRef: bandRef,
  });
  const plainSite = useResizeSplit({
    axis: 'y',
    initial: 70,
    min: 30,
    max: 90,
    containerRef: siteRef,
  });
  const devSides = useResizeSplit({
    axis: 'x',
    initial: 50,
    min: 28,
    max: 68,
    containerRef: bandRef,
    storageKey: 'cyberstars.devMode.webSides',
  });
  const devSite = useResizeSplit({
    axis: 'y',
    initial: 70,
    min: 30,
    max: 90,
    containerRef: siteRef,
    storageKey: 'cyberstars.devMode.webSite',
  });
  // The files beside the editor start at 10rem, the floor the layout keeps
  // so a file's name stays readable, and a drag only widens them
  const plainFiles = useResizeSplit({
    axis: 'x',
    initial: 15,
    min: 15,
    max: 60,
    containerRef: codeRef,
  });
  const devFiles = useResizeSplit({
    axis: 'x',
    initial: 15,
    min: 15,
    max: 60,
    containerRef: codeRef,
    storageKey: 'cyberstars.devMode.webFiles',
  });
  const sides = devMode ? devSides : plainSides;
  const siteSplit = devMode ? devSite : plainSite;
  const filesSplit = devMode ? devFiles : plainFiles;
  // Whether the sides stand next to each other (the band is @2xl wide): the
  // actions sit at the far right then, over the site, and on a phone over
  // the lesson and the code, so one of them is always at hand
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const band = bandRef.current;
    if (!band || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setWide(entry.contentRect.width >= 672));
    observer.observe(band);
    return () => observer.disconnect();
  }, []);

  // Tabs whose file went away (a reset, a rename, a delete) close
  const first = firstToOpen(files);
  const shownTabs = (tabs ?? (first ? [first] : [])).filter((path) =>
    files.some((f) => f.path === path),
  );
  const shownActive = active && shownTabs.includes(active) ? active : (shownTabs[0] ?? null);
  const activeFile = files.find((f) => f.path === shownActive) ?? null;

  const consoleText = entries
    .map((e) => (e.where ? `${e.level}: ${e.text} (${e.where})` : `${e.level}: ${e.text}`))
    .join('\n');
  useEffect(() => {
    onConsole?.(consoleText);
  }, [consoleText, onConsole]);

  const errorText = (error: SiteError) => t(`web.errors.${error}`);
  // The site as the student changed it, unless it went past a limit
  const commit = (next: WebFile[]): string | null => {
    if (next.length > WEB_MAX_FILES) return t('web.errors.fileLimit', { max: WEB_MAX_FILES });
    const text = serializeWebFiles(next);
    if (text.length > WEB_MAX_LENGTH) return t('web.errors.sizeLimit');
    setNotice(null);
    onChange(text);
    return null;
  };
  const apply = (outcome: { site: Site } | { error: SiteError }): string | null => {
    if ('error' in outcome) return errorText(outcome.error);
    const failed = commit(outcome.site.files);
    if (!failed) setFolders(outcome.site.folders);
    return failed;
  };
  const site: Site = { files, folders };

  // A page opened in the editor is the one the site shows
  const show = (path: string) => {
    setActive(path);
    if (extensionOf(path) === 'html') choosePage(path);
  };
  const open = (path: string) => {
    setTabs(shownTabs.includes(path) ? shownTabs : [...shownTabs, path]);
    show(path);
    setView('code');
  };
  const close = (path: string) => {
    const left = shownTabs.filter((p) => p !== path);
    setTabs(left);
    if (shownActive === path) setActive(left[left.length - 1] ?? null);
  };
  const edit = (content: string) => {
    if (!activeFile || activeFile.image) return;
    const failed = commit(files.map((f) => (f.path === activeFile.path ? { ...f, content } : f)));
    if (failed) {
      setNotice(failed);
      setEditorKey((k) => k + 1);
    }
  };

  const tree = (
    <FileTree
      files={files}
      folders={folders}
      active={shownActive}
      onOpen={open}
      onCreate={(path, folder) => {
        const failed = apply(folder ? addFolder(site, path) : addFile(site, path));
        if (!failed && !folder) open(path);
        return failed;
      }}
      onRename={(from, to) => {
        const failed = apply(renamePath(site, from, to));
        if (!failed) {
          const moved = (p: string) =>
            p === from || p.startsWith(`${from}/`) ? to + p.slice(from.length) : p;
          setTabs(shownTabs.map(moved));
          setActive((a) => (a ? moved(a) : a));
        }
        return failed;
      }}
      onDelete={(path) => {
        const failed = apply(removePath(site, path));
        if (failed) setNotice(failed);
      }}
    />
  );

  const editor = (
    <div className="flex flex-col min-h-0 h-full">
      {shownTabs.length > 0 && (
        <div
          role="tablist"
          aria-label={t('web.code')}
          className="flex shrink-0 overflow-x-auto border-b border-[var(--border)]"
        >
          {shownTabs.map((path) => {
            const selected = path === shownActive;
            const name = path.slice(path.lastIndexOf('/') + 1);
            return (
              <div
                key={path}
                className={`flex items-center border-r border-[var(--border)] ${selected ? 'bg-[var(--surface)]' : ''}`}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  title={path}
                  onClick={() => show(path)}
                  className={`pl-3 pr-1 py-1.5 text-[12px] font-mono bg-transparent border-none cursor-pointer whitespace-nowrap ${selected ? 'text-[var(--text)]' : 'text-[var(--text3)] hover:text-[var(--text2)]'}`}
                >
                  {name}
                </button>
                <button
                  type="button"
                  aria-label={t('web.closeTab', { name: path })}
                  onClick={() => close(path)}
                  className="w-6 h-6 mr-1 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text3)] hover:text-[var(--text)] bg-transparent border-none cursor-pointer"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {notice && (
        <p
          role="alert"
          className="shrink-0 m-0 px-3 py-1.5 border-b border-[var(--border)] text-[12px] text-[var(--error)] bg-[var(--glass)]"
        >
          {notice}
        </p>
      )}
      <div className="flex-1 min-h-0 overflow-auto bg-[rgba(13,17,23,0.3)]">
        {!activeFile ? (
          <p className="px-4 py-3 text-[13px] text-[var(--text3)]">{t('web.noFileOpen')}</p>
        ) : activeFile.image ? (
          <figure className="m-0 p-4 flex flex-col items-center gap-3">
            <img
              src={assetUrl(courseKey, activeFile.path)}
              alt={activeFile.path}
              className="max-w-full max-h-[50vh] object-contain"
            />
            <figcaption className="text-[12px] text-[var(--text3)]">
              {t('web.imageReadOnly')}
            </figcaption>
          </figure>
        ) : (
          <CodeEditor
            key={`${activeFile.path}:${editorKey}`}
            value={activeFile.content}
            onChange={edit}
            language={extensionOf(activeFile.path)}
            fontSize="14px"
            onRun={run}
          />
        )}
      </div>
    </div>
  );

  const previewPane = (
    <div className="flex flex-col min-h-0 h-full">
      {paused && (
        <div
          role="status"
          className="shrink-0 flex items-center gap-3 px-3 py-1.5 text-[12px] text-[var(--warning)] border-b border-[var(--border)]"
        >
          <span className="flex-1 min-w-0">{t('web.paused')}</span>
          <button type="button" onClick={run} className="btn btn-secondary btn-sm shrink-0 py-0.5">
            {t('web.showAgain')}
          </button>
        </div>
      )}
      <div className="flex-1 min-h-0 bg-white">
        {frame && page ? (
          <iframe
            key={frame.id}
            ref={frameRef}
            src={WEB_PREVIEW_PATH}
            // No allow-same-origin: the page gets an origin of its own and
            // can't reach the lesson, its cookies or the API
            sandbox="allow-scripts allow-forms allow-modals"
            title={t('web.previewTitle', { page: page })}
            // While a divider is dragged the frame lets the pointer through:
            // over it, the moves would go to the page and the drag would stop
            className={`w-full h-full border-none block ${sides.dragging || siteSplit.dragging || filesSplit.dragging ? 'pointer-events-none' : ''}`}
          />
        ) : (
          !page && <p className="m-0 px-4 py-3 text-[13px] text-[#444]">{t('web.noPage')}</p>
        )}
      </div>
    </div>
  );

  const consolePane = (
    <div className="flex flex-col min-h-0 h-full">
      <div className="flex items-center justify-between pl-3 pr-2 py-1 border-b border-[var(--border)]">
        <span className="section-label">{t('web.console.title')}</span>
        <button
          type="button"
          onClick={clear}
          disabled={entries.length === 0}
          className="btn btn-secondary btn-sm py-0.5"
        >
          {t('web.console.clear')}
        </button>
      </div>
      <div
        role="log"
        aria-label={t('web.console.title')}
        className="flex-1 min-h-0 overflow-y-auto font-mono text-[12px] px-3 py-1.5"
      >
        {entries.length === 0 ? (
          <p className="m-0 text-[var(--text3)] font-sans">{t('web.console.empty')}</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex gap-3 py-0.5 border-b border-[var(--border)]/50 whitespace-pre-wrap break-words ${LEVEL_COLOR[entry.level]}`}
            >
              <span className="flex-1 min-w-0">{entry.text}</span>
              {entry.where && <span className="shrink-0 text-[var(--text3)]">{entry.where}</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const panelTabs = [
    { key: 'lesson' as const, label: t('lesson.tabLesson') },
    { key: 'code' as const, label: t('web.code') },
    { key: 'site' as const, label: t('web.site') },
  ];
  // The left side's own choice: the code, else the lesson
  const side = view === 'code' ? 'code' : 'lesson';

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <PanelTabs
        className="@2xl:hidden shrink-0 bg-[var(--glass)]"
        fill
        tabs={panelTabs}
        active={view}
        onSelect={setView}
      />
      {banner}
      <div ref={bandRef} className="flex-1 min-h-0 flex">
        <div
          style={{ '--split': `${sides.size}%` } as CSSProperties}
          className={`${view === 'site' ? 'hidden' : 'flex'} @2xl:flex w-full @2xl:w-[var(--split)] @2xl:flex-none min-w-0 flex-col bg-[var(--panel-bg)]`}
        >
          <div className="shrink-0 h-12 flex items-center justify-between gap-2 px-3 border-b border-[var(--border)]">
            <div className="hidden @2xl:block">
              <Segmented
                value={side}
                options={SIDES}
                onChange={setView}
                optionLabel={(key) => (key === 'lesson' ? t('lesson.tabLesson') : t('web.code'))}
                ariaLabel={t('web.side')}
              />
            </div>
            {!wide && <div className="ml-auto">{actions}</div>}
          </div>
          <div className={`${side === 'lesson' ? 'flex' : 'hidden'} flex-1 min-h-0 flex-col`}>
            {lesson}
          </div>
          <div
            ref={codeRef}
            className={`${side === 'code' ? 'flex' : 'hidden'} flex-1 min-h-0 flex-col @2xl:flex-row`}
          >
            <div
              style={{ '--files': `${filesSplit.size}%` } as CSSProperties}
              className="shrink-0 max-h-[35%] @2xl:max-h-none w-full @2xl:w-[var(--files)] @2xl:min-w-40 border-b @2xl:border-b-0 border-[var(--border)] flex flex-col min-h-0"
            >
              {tree}
            </div>
            <ResizeHandle
              axis="x"
              className="hidden @2xl:block"
              onPointerDown={filesSplit.onPointerDown}
              dragging={filesSplit.dragging}
            />
            <div className="flex-1 min-w-0 min-h-0 flex flex-col">{editor}</div>
          </div>
        </div>
        <ResizeHandle
          axis="x"
          className="hidden @2xl:block"
          onPointerDown={sides.onPointerDown}
          dragging={sides.dragging}
        />
        <div
          ref={siteRef}
          className={`${view === 'site' ? 'flex' : 'hidden'} @2xl:flex flex-1 min-w-0 min-h-0 flex-col bg-[var(--panel-bg)]`}
        >
          <div className="shrink-0 h-12 flex items-center gap-2 px-3 border-b border-[var(--border)] bg-[var(--glass)]">
            <span className="flex-1 min-w-0 truncate text-[12px] font-mono text-[var(--text2)]">
              {page}
            </span>
            {testsError && (
              <span
                role="alert"
                title={testsError}
                className="min-w-0 max-w-[40%] truncate text-[12px] font-semibold text-[var(--error)]"
              >
                {testsError}
              </span>
            )}
            <RunButton
              onClick={pressRun}
              isRunning={false}
              title={t('web.runTitle')}
              className="shrink-0"
            />
            {runTests && <div className="shrink-0">{runTests}</div>}
            {wide && devMode && (
              <button
                type="button"
                data-track="dev-mode-reset"
                onClick={() => {
                  devSides.reset();
                  devSite.reset();
                  devFiles.reset();
                }}
                aria-label={t('lesson.devModeReset')}
                title={t('lesson.devModeReset')}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border border-[var(--border)]"
              >
                <RotateCcw size={14} aria-hidden="true" />
              </button>
            )}
            {wide && <div className="shrink-0">{actions}</div>}
          </div>
          <div
            style={{ '--site-split': `${siteSplit.size}%` } as CSSProperties}
            className="flex-1 @2xl:flex-none @2xl:h-[var(--site-split)] min-h-0 flex flex-col"
          >
            {previewPane}
          </div>
          <ResizeHandle
            axis="y"
            className="hidden @2xl:block"
            onPointerDown={siteSplit.onPointerDown}
            dragging={siteSplit.dragging}
          />
          <div className="h-[30%] @2xl:h-auto @2xl:flex-1 min-h-0 flex flex-col border-t border-[var(--border)]">
            {consolePane}
          </div>
        </div>
      </div>
      {runNotice && (
        <RunNotice
          onClose={() => {
            setRunNotice(false);
            run();
          }}
        />
      )}
    </div>
  );
}
