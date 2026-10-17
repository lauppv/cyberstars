import { useMemo, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { ArrayVisual } from './parseVisual';
import { arrayFrames, type ArrayFrame } from './arrayFrames';

// Loaded lazily by MarkdownRenderer, so a lesson without a visual never downloads it

const BOX = 48;
const GAP = 8;

function ArrayView({ values, frame }: { values: ArrayVisual['values']; frame: ArrayFrame }) {
  const n = values.length;
  // The boxes shrink to fit a narrow screen; each one sits at its position by a transform, so a
  // swap slides it there (unless the student asked for reduced motion)
  const width = `min(100%, ${n * BOX + (n - 1) * GAP}px)`;
  return (
    <div className="mx-auto font-mono" style={{ width }} aria-hidden="true">
      <div className="relative" style={{ height: BOX }}>
        {frame.order.map((id, pos) => {
          const sorted = pos >= frame.sortedFrom;
          const compared = !sorted && frame.compared?.includes(pos);
          return (
            <div
              key={id}
              data-box={id}
              data-state={sorted ? 'sorted' : compared ? 'compared' : 'idle'}
              className={`absolute top-0 left-0 h-full flex items-center justify-center rounded-[var(--radius-sm)] text-[17px] transition-transform duration-300 ease-out motion-reduce:transition-none ${
                sorted
                  ? 'border-2 border-[var(--success)] bg-[rgba(59,167,118,0.25)] text-[#c4f0da]'
                  : compared
                    ? 'border-2 border-[var(--accent)] bg-[rgba(108,92,231,0.25)] text-[#cdc6ff]'
                    : 'border border-[var(--border)] bg-[var(--glass)] text-[var(--text)]'
              }`}
              style={{
                width: `calc((100% - ${(n - 1) * GAP}px) / ${n})`,
                transform: `translateX(calc(${pos} * (100% + ${GAP}px)))`,
              }}
            >
              {values[id]}
            </div>
          );
        })}
      </div>
      <div
        className="grid mt-1 text-center text-[13px] text-[var(--text3)]"
        style={{ gridTemplateColumns: `repeat(${n}, 1fr)`, columnGap: GAP }}
      >
        {values.map((_, pos) => (
          <span key={pos}>{pos}</span>
        ))}
      </div>
    </div>
  );
}

const BUTTON =
  'flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[13px] font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] aria-disabled:opacity-30 aria-disabled:cursor-not-allowed aria-disabled:hover:border-[var(--border)] aria-disabled:hover:text-[var(--text)] transition cursor-pointer';

export function VisualPlayer({ visual }: { visual: ArrayVisual }) {
  const { t } = useTranslation();
  const frames = useMemo(() => arrayFrames(visual), [visual]);
  const [step, setStep] = useState(0);
  const last = frames.length - 1;
  const frame = frames[step];

  const go = (to: number) => setStep(Math.max(0, Math.min(last, to)));

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(step + 1);
    else if (e.key === 'ArrowLeft') go(step - 1);
    else return;
    e.preventDefault();
  };

  // aria-disabled rather than disabled, so the focus stays on a button that runs out of steps
  // and the arrow keys keep working
  return (
    <div
      role="group"
      aria-label={t('lesson.visualLabel')}
      tabIndex={0}
      onKeyDown={onKeyDown}
      data-visual
      className="my-4 panel rounded p-4 font-sans whitespace-normal focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
    >
      <ArrayView values={visual.values} frame={frame} />
      <p aria-live="polite" className="mt-4 mb-3 min-h-[2.5em] text-[14px] text-[var(--text)]">
        {frame.caption}
      </p>
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
    </div>
  );
}
