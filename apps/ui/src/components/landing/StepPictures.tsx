import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleCheck, Flame } from 'lucide-react';
import { Field } from '../judge/CaseFields';
import { caseLabel } from '../judge/format';
import { ActivityHeatmap } from '../gamification/ActivityHeatmap';
import { localDateStr, type DayCounts } from '../gamification/heatmap-utils';
import { CodeStill } from './CodeStill';

type Lang = 'en' | 'ro';

function useLang(): Lang {
  const { i18n } = useTranslation();
  return i18n.language === 'ro' ? 'ro' : 'en';
}

// Every step's picture sits in the same box, so the steps line up as the
// visitor scrolls. The pictures are the app's own pieces, not screenshots, so
// they keep matching the app after a restyle.
function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="panel overflow-hidden text-left h-[300px] flex flex-col"
    >
      {children}
    </div>
  );
}

function Bar({ children }: { children: ReactNode }) {
  return (
    <div className="h-9 px-4 flex items-center justify-between border-b border-[var(--border)] text-[12px] text-[var(--text3)] flex-shrink-0">
      {children}
    </div>
  );
}

// The opening of the first Python lesson (python/print), word for word
const READ: Record<Lang, { text: string; code: string; output: string }> = {
  en: {
    text: 'How can we tell the computer "hey, I like pizza"? In Python we say:',
    code: 'print("hey, I like pizza")',
    output: 'hey, I like pizza',
  },
  ro: {
    text: 'Cum îi spunem calculatorului „salut, îmi place pizza"? În Python scriem:',
    code: 'print("salut, imi place pizza")',
    output: 'salut, imi place pizza',
  },
};

export function ReadPicture() {
  const { t } = useTranslation();
  const read = READ[useLang()];
  return (
    <Frame label={t('landing.how.read.picture')}>
      <Bar>Python · Print</Bar>
      <div className="flex-1 p-4 flex flex-col justify-center gap-3">
        <p className="m-0 text-[13px] leading-relaxed text-[var(--text2)]">{read.text}</p>
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)]">
          <CodeStill code={read.code} />
        </div>
        <Field label={t('code.output')}>{read.output}</Field>
      </div>
    </Frame>
  );
}

const WRITE = `for star in ["Sirius", "Vega", "Rigel"]:
    print(star)`;

export function WritePicture() {
  const { t } = useTranslation();
  return (
    <Frame label={t('landing.how.write.picture')}>
      <Bar>
        <span>main.py</span>
        <span className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[11px] font-semibold">
          {t('code.run')}
        </span>
      </Bar>
      <div className="flex-1">
        <CodeStill code={WRITE} />
      </div>
      <div className="p-4 border-t border-[var(--border)]">
        <Field label={t('code.output')}>{'Sirius\nVega\nRigel'}</Field>
      </div>
    </Frame>
  );
}

// Run Tests passed on the Ship's Crew mission (python/lists-for), the lesson
// the hero's example comes from: its first tests ticked, the two the student
// can see and then the hidden ones, and the rest counted
const TESTS = 35;
const SHOWN = 6;

export function TestPicture() {
  const { t } = useTranslation();
  const cases = Array.from({ length: SHOWN }, (_, index) => ({
    index,
    visible: index < 2,
    passed: true,
  }));
  return (
    <Frame label={t('landing.how.test.picture')}>
      <Bar>
        <span className="flex items-center gap-1.5 text-[var(--success)] font-semibold">
          <CircleCheck size={14} strokeWidth={2} aria-hidden="true" />
          {t('tests.verdict.accepted')}
        </span>
        <span>
          {TESTS} / {TESTS}
        </span>
      </Bar>
      <ul className="flex-1 m-0 px-4 py-3 list-none flex flex-col justify-center gap-2.5">
        {cases.map((c) => (
          <li key={c.index} className="flex items-center gap-2.5 text-[13px]">
            <CircleCheck
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="text-[var(--success)] flex-shrink-0"
            />
            {caseLabel(c, t)}
          </li>
        ))}
        <li className="pl-[26px] text-[12px] text-[var(--text3)]">
          {t('landing.how.test.more', { count: TESTS - SHOWN })}
        </li>
      </ul>
    </Frame>
  );
}

// A student on a 12-day streak with a few weeks of lessons behind it, drawn
// on the dashboard's own heatmap, counted back from today so it never ages
const STREAK = 12;
// Three months, what the heatmap shows
const DAYS = 92;

function activity(): Record<string, DayCounts> {
  const counts: Record<string, DayCounts> = {};
  const day = new Date();
  for (let i = 0; i < DAYS; i++) {
    const n = i < STREAK ? 1 + (i % 3) : (i * 7) % 5 < 2 ? 1 + (i % 4) : 0;
    if (n) counts[localDateStr(day)] = { lesson: n };
    day.setDate(day.getDate() - 1);
  }
  return counts;
}

export function LevelPicture() {
  const { t } = useTranslation();
  const counts = useMemo(() => activity(), []);
  return (
    <div
      role="img"
      aria-label={t('landing.how.level.picture')}
      className="text-left h-[300px] flex flex-col justify-center gap-3"
    >
      <div className="flex items-center gap-2 text-[15px] font-semibold">
        <Flame size={18} strokeWidth={2} aria-hidden="true" className="text-[var(--warning)]" />
        {t('landing.how.level.streak', { count: STREAK })}
      </div>
      <ActivityHeatmap activityCounts={counts} />
    </div>
  );
}
