import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pause, Play } from 'lucide-react';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { ArrayView, Words } from '../visual/ArrayView';
import { arrayFrames } from '../visual/arrayFrames';
import { bubbleSortVisual } from './bubbleSortVisual';

const VALUES = [5, 3, 8, 1, 2];
const SWAP_MS = 1200;
// How long a frame stays up: the first and the last longer, a swap its animation and a beat
const HOLD_MS = 2200;
const LONG_HOLD_MS = 4500;
const AFTER_SWAP_MS = SWAP_MS + 900;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    ? (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
    : false;
}

// The lesson visual playing on its own, round and round, like a short film. It plays only while
// on screen, has a pause button (WCAG 2.2.2), and under reduced motion waits for Play
export function SortingLoop() {
  const { t } = useTranslation();
  const visual = useMemo(() => bubbleSortVisual(VALUES, t), [t]);
  const frames = useMemo(() => arrayFrames(visual), [visual]);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [onScreen, setOnScreen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const last = frames.length - 1;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setOnScreen(true); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !onScreen) return;
    const swapped = step > 0 && frames[step].order !== frames[step - 1].order;
    const hold = step === 0 || step === last ? LONG_HOLD_MS : swapped ? AFTER_SWAP_MS : HOLD_MS;
    const id = setTimeout(() => setStep((s) => (s === last ? 0 : s + 1)), hold);
    return () => clearTimeout(id);
  }, [playing, onScreen, step, frames, last]);

  const frame = frames[step];
  return (
    <section className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-20 sm:pt-24">
      <Reveal>
        <SectionHeading title={t('landing.sorting.title')}>
          {t('landing.sorting.text')}
        </SectionHeading>
      </Reveal>
      <Reveal>
        <div ref={root} className="panel max-w-[720px] mx-auto p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[var(--text3)]">
              {frame.title ?? ''}
            </span>
            <button
              type="button"
              data-track="sorting-loop-pause"
              onClick={() => setPlaying((p) => !p)}
              aria-label={t(playing ? 'landing.sorting.pause' : 'landing.sorting.play')}
              title={t(playing ? 'landing.sorting.pause' : 'landing.sorting.play')}
              className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent text-[var(--text3)] hover:text-[var(--text)] hover:border-[var(--text3)] transition cursor-pointer"
            >
              {playing ? (
                <Pause size={14} aria-hidden="true" />
              ) : (
                <Play size={14} aria-hidden="true" />
              )}
            </button>
          </div>
          <div role="img" aria-label={t('landing.sorting.picture')} className="text-left">
            <ArrayView
              values={visual.values}
              pointers={visual.pointers}
              frame={frame}
              box={72}
              swapMs={SWAP_MS}
            />
            <Words frame={frame} live={false} big />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
