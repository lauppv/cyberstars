import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { TestCaseResult } from '@cyberstars/shared/tests';
import { levelFromXp, levelTitleKey, xpForLevel } from '@cyberstars/shared/constants';
import { Field } from '../judge/CaseFields';
import { FailedCase } from '../judge/FailedCase';
import { Badge } from '../gamification/Badge';
import { badgeDescription, badgeLabel } from '../gamification/badgeMeta';
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

// Test 1 of the Flight Report mission (python/print-f), failed the way a
// student often fails it: the fuel line lost its "units". The picture leaves
// the test's input out, so what to fix is what fits in the box"
const FAILED: Record<Lang, TestCaseResult> = {
  en: {
    index: 0,
    visible: true,
    passed: false,
    expected: 'Pilot Shadow is flying Orion\nFuel: 400 units\nSpeed: 7.5 km/s',
    actual: 'Pilot Shadow is flying Orion\nFuel: 400\nSpeed: 7.5 km/s',
  },
  ro: {
    index: 0,
    visible: true,
    passed: false,
    expected: 'Pilotul Shadow piloteaza Orion\nCombustibil: 400 unitati\nViteza: 7.5 km/s',
    actual: 'Pilotul Shadow piloteaza Orion\nCombustibil: 400\nViteza: 7.5 km/s',
  },
};

export function TestPicture() {
  const { t } = useTranslation();
  return (
    <Frame label={t('landing.how.test.picture')}>
      <Bar>
        <span>{t('tests.verdict.wrongAnswer')}</span>
        <span>0 / 32</span>
      </Bar>
      <div className="p-4 overflow-hidden">
        <FailedCase result={FAILED[useLang()]} />
      </div>
    </Frame>
  );
}

// A student a dozen Python lessons in: level 3, two badges, the third ahead
const XP = 520;
const DONE = 12;
const PYTHON_LESSONS = 60;

export function LevelPicture() {
  const { t } = useTranslation();
  const level = levelFromXp(XP);
  const into = XP - xpForLevel(level);
  const span = xpForLevel(level + 1) - xpForLevel(level);
  return (
    <Frame label={t('landing.how.level.picture')}>
      <Bar>{t('landing.how.level.bar')}</Bar>
      <div className="flex-1 p-4 flex flex-col justify-center gap-5">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[18px] font-semibold">
              {t('level.short', { n: level })} · {t(levelTitleKey(level))}
            </span>
            <span className="text-[12px] text-[var(--text3)]">
              {into} / {span} XP
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--surface2)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent)]"
              style={{ width: `${(into / span) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between mb-2 text-[13px]">
            <span className="font-semibold">Python</span>
            <span className="text-[12px] text-[var(--text3)]">
              {t('home.lessonsCompleted', { count: DONE })} / {PYTHON_LESSONS}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--surface2)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--success)]"
              style={{ width: `${(DONE / PYTHON_LESSONS) * 100}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((tier) => (
            <Badge
              key={tier}
              label={badgeLabel(t, 'Python', tier)}
              description={badgeDescription(t, 'Python', tier)}
              earned={tier < 2}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}
