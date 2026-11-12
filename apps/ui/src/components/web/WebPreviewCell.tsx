import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resolveWebPath, WEB_PREVIEW_PATH } from '@cyberstars/shared/webFiles';
import { CodeEditor } from '../code/CodeEditor';
import { buildPreviewPage, type PreviewPage } from './previewDocument';
import { PREVIEW_SOURCE } from './previewPrelude';
import { parsePreviewCell, PreviewCourseContext, shownPart, wholePage } from './previewCell';
import { assetUrl, loadImage } from './useWebPreview';

// A preview cell of a web lesson's text (```html preview, ```css preview): the
// part of a page the lesson is about, in an editor, and under it the page it
// makes, drawn again a moment after the student stops typing. View shows the
// whole page the part sits in, editable too (previewCell.ts). The page runs
// in the same sandboxed frame as the lesson's site (web-preview.html), on its
// own, with nothing of the student's site but the course's pictures.

interface WebPreviewCellProps {
  source: string;
  // The language of the part shown: html or css
  language: string;
}

// How long the code stays still before the page follows it, in ms
const SETTLE_MS = 300;
// The frame's height before its page says how tall it is, and its bounds
const START_HEIGHT = 80;
const MIN_HEIGHT = 32;
// A page as tall as its frame (min-height: 100vh) would grow it for ever
const MAX_HEIGHT = 600;
const LOOP_LIMIT_MS = 2000;
const DOCTYPE = /^\s*<!doctype\s/i;
// A picture the page names: an <img>'s src or a url() in its CSS
const IMAGE_REF = /\bsrc\s*=\s*["']([^"']+)["']|url\(\s*["']?([^"')]+)["']?\s*\)/gi;
const IMAGE_FILE = /\.(svg|png|jpe?g|gif|webp)$/i;

function imagePaths(page: string): string[] {
  const paths = new Set<string>();
  for (const match of page.matchAll(IMAGE_REF)) {
    const path = resolveWebPath('index.html', match[1] ?? match[2] ?? '');
    if (path && IMAGE_FILE.test(path)) paths.add(path);
  }
  return [...paths];
}

export function WebPreviewCell({ source, language }: WebPreviewCellProps) {
  const { t } = useTranslation();
  const course = useContext(PreviewCourseContext);
  const cell = useMemo(() => parsePreviewCell(source), [source]);
  // The whole page, which both views edit
  const [page, setPage] = useState(() => wholePage(cell, cell.shown));
  const [whole, setWhole] = useState(false);
  // The part shown, as the page has it now; null once an edit in the whole
  // page reached outside it, and the cell keeps to the whole page from then
  const shown = useMemo(() => (cell.hasRest ? shownPart(cell, page) : page), [cell, page]);
  const canSplit = cell.hasRest && shown !== null;
  const showingWhole = whole || !canSplit;

  const [frame, setFrame] = useState<{ id: number; page: PreviewPage } | null>(null);
  const [height, setHeight] = useState(START_HEIGHT);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const draw = async () => {
      // The course's pictures the page names, as the lesson's own preview
      // has them (img/station.svg)
      const images: Record<string, string> = {};
      if (course) {
        await Promise.all(
          imagePaths(page).map(async (path) => {
            const data = await loadImage(assetUrl(course, path));
            if (data) images[path] = data;
          }),
        );
      }
      if (cancelled) return;
      setFrame({
        id: nextId.current++,
        page: buildPreviewPage({
          // A page without a doctype would draw in quirks mode, unlike the
          // student's own, and its <html> would never be shorter than the frame
          files: [
            { path: 'index.html', content: DOCTYPE.test(page) ? page : `<!DOCTYPE html>\n${page}` },
          ],
          page: 'index.html',
          images,
          prelude: {
            parentOrigin: window.location.origin,
            storage: {},
            loopMessage: t('web.console.loopStopped', { line: '{line}', file: '{file}' }),
            loopLimitMs: LOOP_LIMIT_MS,
            evalMessage: t('web.console.evalBlocked'),
          },
        }),
      });
    };
    // The first drawing doesn't wait
    const timer = setTimeout(() => void draw(), nextId.current === 0 ? 0 : SETTLE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [page, t, course]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const win = frameRef.current?.contentWindow;
      if (!win || event.source !== win) return;
      const data = event.data as { source?: unknown; type?: unknown; height?: unknown } | null;
      if (!data || data.source !== PREVIEW_SOURCE) return;
      if (data.type === 'runtime' && frame) {
        win.postMessage(
          { type: 'cyberstars-render', html: frame.page.html, scripts: frame.page.scripts },
          '*',
        );
      } else if (data.type === 'height' && typeof data.height === 'number') {
        setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, data.height)));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [frame]);

  const editShown = (next: string) => setPage(wholePage(cell, next));

  return (
    <div className="my-4 panel rounded p-3" data-testid="web-preview-cell">
      <CodeEditor
        value={showingWhole ? page : (shown ?? '')}
        onChange={showingWhole ? setPage : editShown}
        language={showingWhole ? 'html' : language}
        minHeight="40px"
      />
      {canSplit && (
        <button
          type="button"
          onClick={() => setWhole((on) => !on)}
          aria-expanded={whole}
          className="btn btn-secondary btn-sm mt-2"
        >
          {whole ? t('web.cell.hideRest') : t('web.cell.viewAll')}
        </button>
      )}
      <div className="mt-2 rounded-[var(--radius-sm)] overflow-hidden border border-[var(--border)] bg-white">
        {frame && (
          <iframe
            key={frame.id}
            ref={frameRef}
            src={WEB_PREVIEW_PATH}
            // No allow-same-origin, as the lesson's own preview
            sandbox="allow-scripts allow-forms allow-modals"
            title={t('web.cell.previewTitle')}
            style={{ height }}
            className="w-full border-none block"
          />
        )}
      </div>
    </div>
  );
}
