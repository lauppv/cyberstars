import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { CELL_RUN_EVENT } from '../../constants/tour';
import { holeFor, mergeHoles, placeCard, RADIUS, roundedRect, type Rect } from './geometry';

type Panel = 'lesson' | 'workspace';

// What lets the student past a step: the Next button, a run of the cell in
// the spotlight, a run of their own code, or the lesson's tests passing.
type Gate = 'next' | 'cellRun' | 'editorRun' | 'testsPass';

interface Step {
  copy: string;
  vars?: Record<string, number>;
  panel?: Panel;
  // Each group of elements becomes one hole in the dimmed screen. Queried on
  // every frame, so a re-render or a scroll never leaves a stale hole behind.
  targets: () => Element[][];
  gate: Gate;
  enter?: () => void;
}

const byTour = (name: string) => document.querySelector(`[data-tour="${name}"]`);

// The rendered lesson's top-level blocks, in reading order: paragraphs,
// headings, and the code cells, each inside its own <pre>.
function blocks(): Element[] {
  const prose = document.querySelector('[data-tour="lesson"] .lesson-body > *');
  return prose ? Array.from(prose.children) : [];
}

// The mission is the lesson's last section: its heading and everything after it.
function mission(): Element[] {
  const headings = document.querySelectorAll('[data-tour="lesson"] .lesson-body h2');
  const els: Element[] = [];
  let el: Element | null = headings[headings.length - 1] ?? null;
  for (; el; el = el.nextElementSibling) {
    els.push(el);
  }
  return els;
}

function groups(...items: (Element | Element[] | null | undefined)[]): Element[][] {
  return items
    .map((item) => (Array.isArray(item) ? item : item ? [item] : []))
    .filter((group) => group.length > 0);
}

// Scrolls the lesson so the elements sit in the middle of it, or at its top
// when they are taller than the lesson panel.
function reveal(els: Element[]) {
  const panel = byTour('lesson');
  if (!panel || els.length === 0) return;
  const box = panel.getBoundingClientRect();
  const rects = els.map((el) => el.getBoundingClientRect());
  const top = Math.min(...rects.map((r) => r.top));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  const delta =
    bottom - top > box.height - 32
      ? top - box.top - 16
      : (top + bottom) / 2 - (box.top + box.bottom) / 2;
  panel.scrollBy({ top: delta, behavior: 'smooth' });
}

interface Part {
  kind: 'text' | 'cell';
  at: number[];
}

// The lesson before its mission, cut into stretches of text and the code
// cells between them. Parts point into blocks() by index, so a re-render
// never leaves a step holding elements that are gone.
function parts(): Part[] {
  const all = blocks();
  const missionAt = all.indexOf(mission()[0]);
  const end = missionAt === -1 ? all.length : missionAt;
  const out: Part[] = [];
  for (let i = 0; i < end; i++) {
    const el = all[i];
    if (el.tagName === 'HR') continue;
    if (el.querySelector('[data-code-cell]')) {
      out.push({ kind: 'cell', at: [i] });
    } else if (out.at(-1)?.kind === 'text') {
      out.at(-1)!.at.push(i);
    } else {
      out.push({ kind: 'text', at: [i] });
    }
  }
  return out;
}

// Built once the lesson is on screen, so its parts can be counted. In the
// tour lesson the second cell is the one that fails on purpose (print
// without quotes); the copy assumes that order.
function buildPlan(): Step[] {
  const lessonParts = parts();
  const cellTotal = lessonParts.filter((part) => part.kind === 'cell').length;
  const plan: Step[] = [];
  let textSeen = 0;
  let cellSeen = 0;
  for (const part of lessonParts) {
    if (part.kind === 'text') {
      const first = textSeen++ === 0;
      // The opening stretch takes the lesson's title along with it.
      const els = () =>
        [
          ...(first ? [document.querySelector('[data-tour="lesson"] h1')] : []),
          ...part.at.map((i) => blocks()[i]),
        ].filter((el): el is Element => !!el);
      plan.push({
        copy: first ? 'lesson' : 'text',
        panel: 'lesson',
        targets: () => groups(els()),
        gate: 'next',
        enter: () => reveal(els()),
      });
    } else {
      const n = cellSeen++;
      const cell = () => blocks()[part.at[0]]?.querySelector('[data-code-cell]');
      plan.push({
        copy: n === 0 ? 'cellFirst' : n === 1 ? 'cellError' : 'cellMore',
        vars: { n: n + 1, total: cellTotal },
        panel: 'lesson',
        targets: () => groups(cell()),
        gate: 'cellRun',
        enter: () => reveal(groups(cell()).flat()),
      });
    }
  }
  if (mission().length > 0) {
    plan.push({
      copy: 'mission',
      panel: 'lesson',
      targets: () => groups(mission()),
      gate: 'next',
      enter: () => reveal(mission()),
    });
  }
  // While coding, the mission stays lit beside the editor. On a phone the
  // panel tabs stay usable too, so the mission is one tap away. A test run
  // opens its verdict in the lesson panel, so that stays lit with its tabs,
  // which lead back to the mission.
  const coding = () =>
    groups(
      byTour('workspace'),
      mission(),
      byTour('tabs'),
      byTour('panel-tabs'),
      byTour('result'),
      byTour('submissions'),
    );
  plan.push(
    {
      copy: 'editor',
      panel: 'workspace',
      targets: () => groups(byTour('editor'), mission(), byTour('tabs')),
      gate: 'next',
    },
    { copy: 'run', panel: 'workspace', targets: coding, gate: 'editorRun' },
    { copy: 'tests', panel: 'workspace', targets: coding, gate: 'testsPass' },
  );
  return plan;
}

interface LessonTourProps {
  userName: string;
  // Runs of the lesson's own editor so far, and whether one is going now.
  editorRuns: number;
  isRunning: boolean;
  testStatus: 'passed' | 'failed' | null;
  completed: boolean;
  // The tour opens on a language choice; the page keeps the answer, since a
  // language switch reloads the lesson and remounts the tour.
  languagePicked: boolean;
  onLanguage: (lang: 'ro' | 'en') => void;
  onPanel: (panel: Panel) => void;
  // A click on the dimmed part of the screen.
  onBlocked: () => void;
  onFinish: () => void;
}

export function LessonTour({
  userName,
  editorRuns,
  isRunning,
  testStatus,
  completed,
  languagePicked,
  onLanguage,
  onPanel,
  onBlocked,
  onFinish,
}: LessonTourProps) {
  const { t } = useTranslation();
  const [plan, setPlan] = useState<Step[] | null>(null);
  const [index, setIndex] = useState(0);
  const [runsAtStep, setRunsAtStep] = useState(0);
  const [cellRanAt, setCellRanAt] = useState(-1);
  const [layout, setLayout] = useState({
    holes: [] as Rect[],
    vw: window.innerWidth,
    vh: window.innerHeight,
    cardW: 0,
    cardH: 0,
  });
  const cardRef = useRef<HTMLDivElement>(null);

  // Passing the tests ends the tour from whatever step the student is on.
  const done = plan !== null && completed;
  const step = plan && !done ? plan[index] : null;

  const go = useCallback(
    (steps: Step[], i: number) => {
      const next = steps[i];
      setIndex(i);
      setRunsAtStep(editorRuns);
      if (next.panel) onPanel(next.panel);
      // Let a panel switch paint before scrolling inside it.
      requestAnimationFrame(() => next.enter?.());
    },
    [editorRuns, onPanel],
  );

  const start = () => {
    const steps = buildPlan();
    setPlan(steps);
    go(steps, 0);
  };

  useEffect(() => {
    if (!step || step.gate !== 'cellRun') return;
    const onRun = (e: Event) => {
      if (step.targets().some((group) => group.includes(e.target as Element))) {
        setCellRanAt(index);
      }
    };
    document.addEventListener(CELL_RUN_EVENT, onRun);
    return () => document.removeEventListener(CELL_RUN_EVENT, onRun);
  }, [step, index]);

  // Follow the targets frame by frame: the lesson scrolls, the editor grows,
  // output appears, the window resizes. State only changes when they move.
  useEffect(() => {
    let frame = 0;
    let last = '';
    const tick = () => {
      const holes = step
        ? mergeHoles(
            step
              .targets()
              .map(holeFor)
              .filter((r): r is Rect => r !== null),
          )
        : [];
      const next = {
        holes,
        vw: window.innerWidth,
        vh: window.innerHeight,
        cardW: cardRef.current?.offsetWidth ?? 0,
        cardH: cardRef.current?.offsetHeight ?? 0,
      };
      const key = JSON.stringify(next);
      if (key !== last) {
        last = key;
        setLayout(next);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [step]);

  const open =
    !step ||
    step.gate === 'next' ||
    (step.gate === 'cellRun' && cellRanAt === index) ||
    (step.gate === 'editorRun' && editorRuns > runsAtStep && !isRunning);

  const copy =
    plan === null ? (languagePicked ? 'welcome' : 'language') : done ? 'done' : step!.copy;
  const vars = { name: userName, ...step?.vars };
  const { holes, vw, vh, cardW, cardH } = layout;
  const pos = placeCard(holes, cardW, cardH, vw, vh);

  return createPortal(
    <>
      <svg
        className="fixed inset-0 z-[90] pointer-events-none"
        width={vw}
        height={vh}
        aria-hidden="true"
      >
        <path
          d={`M0 0H${vw}V${vh}H0Z${holes.map(roundedRect).join('')}`}
          fillRule="evenodd"
          fill="rgba(0, 0, 0, 0.6)"
          className="pointer-events-auto"
          onClick={done ? undefined : onBlocked}
        />
        {holes.map((r, i) => (
          <rect
            key={i}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            rx={Math.min(RADIUS, r.w / 2, r.h / 2)}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
          />
        ))}
      </svg>
      <div
        ref={cardRef}
        role="dialog"
        aria-labelledby="lesson-tour-title"
        className="fixed z-[91] w-[min(340px,calc(100vw-32px))] p-5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--popover)] shadow-[0_8px_32px_#0008]"
        style={{ left: pos.x, top: pos.y, visibility: cardH ? 'visible' : 'hidden' }}
      >
        <h2 id="lesson-tour-title" className="text-[15px] font-semibold text-[var(--text)] mb-2">
          {t(`tour.${copy}.title`, vars)}
        </h2>
        <p className="text-[13px] leading-relaxed text-[var(--text2)]">
          {t(`tour.${copy}.body`, vars)}
        </p>
        {step?.gate === 'testsPass' && testStatus === 'failed' && (
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--warning)]">
            {t('tour.testsFailed')}
          </p>
        )}
        {copy === 'language' && (
          <div className="flex gap-2 mt-4">
            <TourButton onClick={() => onLanguage('ro')} wide>
              {t('tour.language.ro')}
            </TourButton>
            <TourButton onClick={() => onLanguage('en')} wide>
              {t('tour.language.en')}
            </TourButton>
          </div>
        )}
        {copy !== 'language' && (
          <div className="flex items-center gap-3 mt-4">
            {plan && step && (
              <span className="text-[11px] text-[var(--text3)] tabular-nums">
                {t('tour.counter', { n: index + 1, total: plan.length })}
              </span>
            )}
            {!open && step && (
              <span className="text-[12px] text-[var(--text3)]">
                {t(`tour.waitFor.${step.gate}`)}
              </span>
            )}
            <div className="ml-auto">
              {plan === null ? (
                <TourButton onClick={start}>{t('tour.start')}</TourButton>
              ) : done ? (
                <TourButton onClick={onFinish}>{t('tour.finish')}</TourButton>
              ) : (
                step!.gate !== 'testsPass' && (
                  <TourButton onClick={() => go(plan, index + 1)} disabled={!open}>
                    {t('tour.next')}
                  </TourButton>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}

function TourButton({
  onClick,
  disabled,
  wide,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  wide?: boolean;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${wide ? 'flex-1 py-2' : 'py-1.5'} px-4 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer`}
    >
      {children}
    </button>
  );
}
