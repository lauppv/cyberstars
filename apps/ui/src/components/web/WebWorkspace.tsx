import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
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
import { useResizeSplit } from '../../hooks/useResizeSplit';
import { FileTree } from './FileTree';
import { addFile, addFolder, removePath, renamePath, type Site, type SiteError } from './siteFiles';
import { assetUrl, useWebPreview, type ConsoleEntry } from './useWebPreview';

// A web lesson's workspace (CYB-109), a small IDE in the spirit of VS Code:
// the site's files on the left, the open ones in tabs beside them, and under
// both the preview of a page with its console. On a phone each is a panel
// of its own. The files travel as one text (packages/shared/webFiles.ts),
// which the lesson saves, resets and shares like any lesson's code.

interface WebWorkspaceProps {
  value: string;
  onChange: (value: string) => void;
  courseKey: string;
  lessonSlug: string;
  // What the console holds, for the tutor
  onConsole?: (text: string) => void;
}

type Panel = 'files' | 'code' | 'preview' | 'console';

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
}: WebWorkspaceProps) {
  const { t } = useTranslation();
  const files = useMemo(() => parseWebFiles(value), [value]);
  const [folders, setFolders] = useState<string[]>([]);
  // The open tabs, null until the student opens or closes one: the site's
  // first page is open then, whenever its files arrive
  const [tabs, setTabs] = useState<string[] | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>('code');
  const [notice, setNotice] = useState<string | null>(null);
  // A change refused at a limit puts the editor back as it was
  const [editorKey, setEditorKey] = useState(0);
  // Taken apart, so the frame's ref is only ever handed to the frame
  const { pages, page, choosePage, frame, frameRef, entries, clear, paused, run } = useWebPreview({
    files,
    courseKey,
    lessonSlug,
  });
  const workspaceRef = useRef<HTMLDivElement>(null);
  const split = useResizeSplit({
    axis: 'y',
    initial: 50,
    min: 20,
    max: 80,
    containerRef: workspaceRef,
  });

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

  const open = (path: string) => {
    setTabs(shownTabs.includes(path) ? shownTabs : [...shownTabs, path]);
    setActive(path);
    setPanel('code');
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
                  onClick={() => setActive(path)}
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
      <div className="flex items-center gap-2 px-2 py-1.5 border-b border-[var(--border)] bg-[var(--glass)]">
        <RunButton onClick={run} isRunning={false} className="shrink-0" />
        {pages.length > 0 && (
          <select
            aria-label={t('web.page')}
            value={page ?? ''}
            onChange={(e) => choosePage(e.target.value)}
            className="select min-w-0 flex-1 pl-2 pr-7 py-1 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[12px] font-mono text-[var(--text)]"
          >
            {pages.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}
      </div>
      {paused && (
        <p
          role="status"
          className="shrink-0 m-0 px-3 py-1.5 text-[12px] text-[var(--warning)] border-b border-[var(--border)]"
        >
          {t('web.paused')}
        </p>
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
            className="w-full h-full border-none block"
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
          className="text-[12px] px-2 py-0.5 rounded-[var(--radius-sm)] bg-transparent border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] disabled:opacity-50 disabled:cursor-default cursor-pointer"
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
    { key: 'files' as const, label: t('web.files') },
    { key: 'code' as const, label: t('web.code') },
    { key: 'preview' as const, label: t('web.preview') },
    { key: 'console' as const, label: t('web.console.title') },
  ];
  // On a phone one panel shows; from @2xl all of them do, laid out
  const shown = (key: Panel) => `${panel === key ? 'flex' : 'hidden'} @2xl:flex flex-col min-h-0`;

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <PanelTabs
        className="@2xl:hidden shrink-0"
        fill
        tabs={panelTabs}
        active={panel}
        onSelect={setPanel}
      />
      <div ref={workspaceRef} className="flex-1 min-h-0 flex flex-col">
        <div
          style={{ '--web-split': `${split.size}%` } as CSSProperties}
          className={`${panel === 'files' || panel === 'code' ? 'flex' : 'hidden'} @2xl:flex flex-1 @2xl:flex-none @2xl:h-[var(--web-split)] min-h-0`}
        >
          <div
            className={`${shown('files')} w-full @2xl:w-40 @2xl:shrink-0 @2xl:border-r border-[var(--border)]`}
          >
            {tree}
          </div>
          <div className={`${shown('code')} flex-1 min-w-0`}>{editor}</div>
        </div>
        <ResizeHandle
          axis="y"
          className="hidden @2xl:block"
          onPointerDown={split.onPointerDown}
          dragging={split.dragging}
        />
        <div
          className={`${panel === 'preview' || panel === 'console' ? 'flex' : 'hidden'} @2xl:flex flex-1 min-h-0 flex-col`}
        >
          <div className={`${shown('preview')} flex-1`}>{previewPane}</div>
          <div
            className={`${shown('console')} flex-1 @2xl:flex-none @2xl:h-[30%] @2xl:border-t border-[var(--border)]`}
          >
            {consolePane}
          </div>
        </div>
      </div>
    </div>
  );
}
