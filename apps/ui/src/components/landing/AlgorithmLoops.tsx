import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pause, Play } from 'lucide-react';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { ArrayView } from '../visual/ArrayView';
import { BoxesView } from '../visual/BoxesView';
import { TreeView } from '../visual/TreeView';
import { GraphView } from '../visual/GraphView';
import { arrayFrames } from '../visual/arrayFrames';
import { boxFrames } from '../visual/boxFrames';
import { treeFrames } from '../visual/treeFrames';
import { graphFrames } from '../visual/graphFrames';
import { bubbleSortVisual } from './bubbleSortVisual';
import { breadthFirstVisual, linkedListVisual, searchTreeVisual } from './loopVisuals';

type Loop = 'sorting' | 'lists' | 'trees' | 'graphs';

const SORTED = [5, 3, 8, 1, 2];
const LISTED = [10, 20, 30];
const REMOVED = 20;
const PLANTED = [8, 3, 10, 1, 6, 14];
const VERTICES: [number, number][] = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
  [2, 0],
  [2, 1],
  [3, 1],
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [1, 4],
  [4, 5],
  [5, 6],
];

const BOX = 56;
// A move takes as long as the lessons' Fast, then the picture rests a moment before the next
const MOVE_MS = 600;
const HOLD_MS = MOVE_MS + 200;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    ? (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
    : false;
}

// One film: its frames one after another, round and round, while it may play
function Film({
  name,
  frames,
  playing,
  children,
}: {
  name: Loop;
  frames: number;
  playing: boolean;
  children: (step: number) => ReactNode;
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % frames), HOLD_MS);
    return () => clearTimeout(id);
  }, [playing, step, frames]);

  return (
    <div data-film={name} className="panel p-4 sm:p-5 flex flex-col">
      <span className="text-[13px] font-semibold text-[var(--text3)]">
        {t(`landing.loops.${name}`)}
      </span>
      <div
        role="img"
        aria-label={t(`landing.${name}.picture`)}
        className="flex-1 flex flex-col justify-center text-left"
      >
        {children(step)}
      </div>
    </div>
  );
}

// Lesson visuals playing on their own, like short films without words: bubble sort, a linked
// list, a binary search tree and a breadth-first search, side by side, each round and round. They
// play only while on screen, have one pause button (WCAG 2.2.2), and under reduced motion wait
// for Play
export function AlgorithmLoops() {
  const { t, i18n } = useTranslation();
  const drawn = useMemo(() => {
    const sorting = bubbleSortVisual(SORTED, t);
    const lists = linkedListVisual(LISTED, REMOVED, t);
    const trees = searchTreeVisual(PLANTED, t);
    const graphs = breadthFirstVisual(VERTICES, EDGES, 0, t, i18n.language);
    return {
      sorting: { visual: sorting, frames: arrayFrames(sorting) },
      lists: { visual: lists, frames: boxFrames(lists) },
      trees: { visual: trees, frames: treeFrames(trees) },
      graphs: { visual: graphs, frames: graphFrames(graphs) },
    };
  }, [t, i18n.language]);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [onScreen, setOnScreen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

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

  const go = playing && onScreen;
  const { sorting, lists, trees, graphs } = drawn;
  return (
    <section className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-20 sm:pt-24">
      <Reveal>
        <SectionHeading title={t('landing.loops.title')}>{t('landing.loops.text')}</SectionHeading>
      </Reveal>
      <Reveal>
        <div ref={root} className="max-w-[960px] mx-auto">
          <div className="flex justify-end mb-3">
            <button
              type="button"
              data-track="sorting-loop-pause"
              onClick={() => setPlaying((p) => !p)}
              aria-label={t(playing ? 'landing.loops.pause' : 'landing.loops.play')}
              title={t(playing ? 'landing.loops.pause' : 'landing.loops.play')}
              className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent text-[var(--text3)] hover:text-[var(--text)] hover:border-[var(--text3)] transition cursor-pointer"
            >
              {playing ? (
                <Pause size={14} aria-hidden="true" />
              ) : (
                <Play size={14} aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Film name="sorting" frames={sorting.frames.length} playing={go}>
              {(step) => (
                <ArrayView
                  values={sorting.visual.values}
                  pointers={sorting.visual.pointers}
                  frame={sorting.frames[step]}
                  box={BOX}
                  swapMs={MOVE_MS}
                />
              )}
            </Film>
            <Film name="lists" frames={lists.frames.length} playing={go}>
              {(step) => (
                <BoxesView
                  visual={lists.visual}
                  frames={lists.frames}
                  step={step}
                  box={BOX}
                  moveMs={MOVE_MS}
                />
              )}
            </Film>
            <Film name="trees" frames={trees.frames.length} playing={go}>
              {(step) => (
                <TreeView
                  visual={trees.visual}
                  frames={trees.frames}
                  step={step}
                  box={BOX}
                  moveMs={MOVE_MS}
                />
              )}
            </Film>
            <Film name="graphs" frames={graphs.frames.length} playing={go}>
              {(step) => (
                <GraphView
                  visual={graphs.visual}
                  frames={graphs.frames}
                  step={step}
                  box={BOX}
                  moveMs={MOVE_MS}
                />
              )}
            </Film>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
