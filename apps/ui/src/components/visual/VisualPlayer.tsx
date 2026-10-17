import { useContext, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Maximize2, RotateCcw, X } from 'lucide-react';
import { Segmented } from '../ui/Segmented';
import type { Visual } from './parseVisual';
import { arrayFrames } from './arrayFrames';
import { boxFrames } from './boxFrames';
import { treeFrames } from './treeFrames';
import { graphFrames } from './graphFrames';
import { gridFrames } from './gridFrames';
import { ArrayView } from './ArrayView';
import { BoxesView } from './BoxesView';
import { TreeView } from './TreeView';
import { GraphView } from './GraphView';
import { GridView } from './GridView';
import { VisualSteps } from './VisualSteps';
import { Words } from './Words';

// Loaded lazily by MarkdownRenderer, so a lesson without a visual never downloads it

const SPEEDS = ['slow', 'normal', 'fast'] as const;
type Speed = (typeof SPEEDS)[number];
// How long a swap, or any other move of the boxes, takes
const MOVE_MS: Record<Speed, number> = { slow: 2000, normal: 1200, fast: 600 };

const BUTTON =
  'flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[13px] font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] aria-disabled:opacity-30 aria-disabled:cursor-not-allowed aria-disabled:hover:border-[var(--border)] aria-disabled:hover:text-[var(--text)] transition cursor-pointer';

const ICON_BUTTON =
  'w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent text-[var(--text3)] hover:text-[var(--text)] hover:border-[var(--text3)] transition cursor-pointer';

export function VisualPlayer({ visual }: { visual: Visual }) {
  const { t } = useTranslation();
  const drawn = useMemo(() => {
    switch (visual.type) {
      case 'array':
        return { type: visual.type, visual, frames: arrayFrames(visual) };
      case 'boxes':
        return { type: visual.type, visual, frames: boxFrames(visual) };
      case 'tree':
        return { type: visual.type, visual, frames: treeFrames(visual) };
      case 'graph':
        return { type: visual.type, visual, frames: graphFrames(visual) };
      case 'grid':
        return { type: visual.type, visual, frames: gridFrames(visual) };
    }
  }, [visual]);
  const { frames } = drawn;
  // A visual with an id opens on the step the student left it on, when the lesson's text comes back
  // in another programming language
  const steps = useContext(VisualSteps);
  const [step, setStep] = useState(() =>
    Math.min(frames.length - 1, (visual.id && steps?.get(visual.id)) || 0),
  );
  const [speed, setSpeed] = useState<Speed>('normal');
  const [expanded, setExpanded] = useState(false);
  const expandRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const last = frames.length - 1;
  const frame = frames[step];
  const moveMs = MOVE_MS[speed];

  const go = (to: number) => {
    const next = Math.max(0, Math.min(last, to));
    setStep(next);
    if (visual.id) steps?.set(visual.id, next);
  };

  const stepKeys = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(step + 1);
    else if (e.key === 'ArrowLeft') go(step - 1);
    else return false;
    e.preventDefault();
    return true;
  };

  const close = () => {
    setExpanded(false);
    expandRef.current?.focus();
  };

  useEffect(() => {
    if (expanded) dialogRef.current?.focus();
  }, [expanded]);

  // aria-disabled rather than disabled, so the focus stays on a button that runs out of steps
  // and the arrow keys keep working
  const controls = (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => go(0)}
        aria-disabled={step === 0}
        aria-label={t('lesson.visualRestart')}
        title={t('lesson.visualRestart')}
        className={BUTTON}
      >
        <RotateCcw size={14} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => go(step - 1)}
        aria-disabled={step === 0}
        className={BUTTON}
      >
        <ChevronLeft size={14} aria-hidden="true" />
        {t('lesson.visualPrevious')}
      </button>
      <button
        type="button"
        onClick={() => go(step + 1)}
        aria-disabled={step === last}
        className={BUTTON}
      >
        {t('lesson.visualNext')}
        <ChevronRight size={14} aria-hidden="true" />
      </button>
      <span className="ml-auto text-[13px] text-[var(--text3)]">
        {t('lesson.visualStep', { n: step + 1, total: frames.length })}
      </span>
    </div>
  );

  const speedControl = (
    <div className="flex items-center gap-2 text-[13px] text-[var(--text3)]">
      <span aria-hidden="true">{t('lesson.visualSpeed')}</span>
      <Segmented
        value={speed}
        options={SPEEDS}
        onChange={setSpeed}
        optionLabel={(s) => t(`lesson.visualSpeeds.${s}`)}
        ariaLabel={t('lesson.visualSpeed')}
      />
    </div>
  );

  const picture = (box: number) =>
    drawn.type === 'array' ? (
      <ArrayView
        values={drawn.visual.values}
        pointers={drawn.visual.pointers}
        markers={drawn.visual.markers}
        frame={drawn.frames[step]}
        box={box}
        swapMs={moveMs}
        lift={drawn.visual.steps.some((s) => s.swap)}
      />
    ) : drawn.type === 'boxes' ? (
      <BoxesView
        visual={drawn.visual}
        frames={drawn.frames}
        step={step}
        box={box}
        moveMs={moveMs}
      />
    ) : drawn.type === 'tree' ? (
      <TreeView visual={drawn.visual} frames={drawn.frames} step={step} box={box} moveMs={moveMs} />
    ) : drawn.type === 'graph' ? (
      <GraphView
        visual={drawn.visual}
        frames={drawn.frames}
        step={step}
        box={box}
        moveMs={moveMs}
      />
    ) : (
      <GridView visual={drawn.visual} frames={drawn.frames} step={step} box={box} />
    );

  const title = (
    <span className="text-[13px] font-semibold text-[var(--text3)]">{frame.title ?? ''}</span>
  );

  return (
    <div
      role="group"
      aria-label={t('lesson.visualLabel')}
      tabIndex={0}
      onKeyDown={stepKeys}
      data-visual
      className="my-4 panel rounded p-4 font-sans whitespace-normal focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
    >
      <div className="flex items-center justify-between">
        {title}
        <button
          ref={expandRef}
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={t('lesson.visualExpand')}
          title={t('lesson.visualExpand')}
          className={ICON_BUTTON}
        >
          <Maximize2 size={14} aria-hidden="true" />
        </button>
      </div>
      {picture(48)}
      <div className="mb-3">
        <Words frame={frame} live={!expanded} big={false} />
      </div>
      {controls}
      <div className="mt-3">{speedControl}</div>

      {expanded &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
            onMouseDown={close}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={t('lesson.visualLabel')}
              tabIndex={-1}
              onMouseDown={(e) => e.stopPropagation()}
              // The dialog sits in a portal, whose events still bubble to the player in React;
              // it handles its own keys so a step isn't taken twice
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Escape') close();
                else stepKeys(e);
              }}
              className="w-full max-w-[760px] max-h-[90vh] overflow-y-auto bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-6 font-sans outline-none"
            >
              <div className="flex items-center justify-between mb-2">
                {title}
                <button
                  type="button"
                  onClick={close}
                  aria-label={t('lesson.visualClose')}
                  title={t('lesson.visualClose')}
                  className={ICON_BUTTON}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
              {picture(80)}
              <div className="mb-6">
                <Words frame={frame} live big />
              </div>
              {controls}
              <div className="mt-4">{speedControl}</div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
