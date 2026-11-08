import { useMemo, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useCurriculum } from '../../context/CurriculumContext';
import { TutorHero } from '../tutor/TutorHero';
import { useTimesShown } from './useTimesShown';
import { curriculumCounts } from './curriculumCounts';
import { DIFF_COLORS } from '../../constants/difficulty';

// The pictures for "what's inside", one per place a visitor can go. They are
// drawn with the app's own pieces and real data, so there are no screenshots
// to go stale and no editor to load.
function Box({
  label,
  height = 'h-[220px]',
  children,
}: {
  label: string;
  height?: string;
  children: ReactNode;
}) {
  return (
    <div role="img" aria-label={label} className={`${height} overflow-hidden p-4 text-left`}>
      {children}
    </div>
  );
}

// Every listed course with its real lesson count, in the page's language,
// longest bar for the most; a course still being built is marked Beta. The
// picture grows when a launch adds a course, rather than cutting it off
export function CoursesPicture() {
  const { t } = useTranslation();
  const { courses } = useCurriculum();
  const rows = useMemo(() => curriculumCounts(courses).perCourse, [courses]);
  const most = Math.max(1, ...rows.map((r) => r.lessons));
  return (
    <Box label={t('landing.features.courses.picture')} height="min-h-[220px]">
      <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
        {rows.map((r) => (
          <li key={r.key}>
            <div className="flex items-center justify-between gap-2 text-[13px] leading-4 mb-1.5">
              <span className="flex items-center gap-1.5 min-w-0">
                <span className="font-semibold truncate">
                  {t(`courses.names.${r.key}`, { defaultValue: r.label })}
                </span>
                {r.beta && (
                  <span
                    title={t('common.betaHint')}
                    className="px-1.5 rounded-full border border-[var(--border)] text-[10px] leading-[14px] font-semibold text-[var(--text2)]"
                  >
                    {t('common.beta')}
                  </span>
                )}
              </span>
              <span className="text-[var(--text3)] flex-shrink-0">
                {r.lessons} {t('courses.lessons', { count: r.lessons })}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--surface2)] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(r.lessons / most) * 100}%`, background: r.color }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Box>
  );
}

// Real Python challenges as the algorithm list shows them: the number, or a
// tick once solved, the title and the difficulty in its colour
const DIFFICULTY = DIFF_COLORS;

// slug, English title (until the curriculum is in), difficulty, solved
const CHALLENGES: [string, string, keyof typeof DIFFICULTY, boolean][] = [
  ['reverse-string', 'Reverse a String', 'easy', true],
  ['palindrome', 'Palindrome Check', 'easy', true],
  ['caesar-cipher', 'Caesar Cipher', 'medium', true],
  ['two-sum', 'Two Sum', 'medium', false],
  ['group-anagrams', 'Group Anagrams', 'hard', false],
];

export function AlgorithmsPicture() {
  const { t } = useTranslation();
  const { courses } = useCurriculum();
  const lessons = courses.find((c) => c.key === 'algo-python')?.lessons ?? [];
  // the title in the page's language, without the difficulty the pill shows
  const titleOf = (slug: string, english: string) =>
    lessons.find((l) => l.slug === slug)?.title.replace(/^(Easy|Medium|Hard) · /, '') ?? english;
  return (
    <Box label={t('landing.features.algorithms.picture')}>
      <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
        {CHALLENGES.map(([slug, english, diff, solved], i) => {
          const d = DIFFICULTY[diff];
          return (
            <li key={slug} className="flex items-center gap-3 h-[32px]">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{
                  background: solved ? 'var(--success)' : d.bg,
                  color: solved ? '#fff' : d.text,
                }}
              >
                {solved ? '✓' : i + 1}
              </span>
              <span className="text-[13px] font-medium flex-1">{titleOf(slug, english)}</span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: d.bg, color: d.text }}
              >
                {t(`algoList.diff.${diff}`)}
              </span>
            </li>
          );
        })}
      </ul>
    </Box>
  );
}

// The first steps of the Linux course (pwd, ls), in the lesson terminal's
// prompt and colours, with the Romanian lesson's own file names on a Romanian page
const SESSION: Record<'en' | 'ro', [string, string][]> = {
  en: [
    ['pwd', '/home/student'],
    ['ls', 'mission.txt  reports  tools'],
    ['ls reports', 'january.log  february.log'],
  ],
  ro: [
    ['pwd', '/home/student'],
    ['ls', 'misiune.txt  rapoarte  unelte'],
    ['ls rapoarte', 'ianuarie.log  februarie.log'],
  ],
};

export function LinuxPicture() {
  const { t, i18n } = useTranslation();
  return (
    <Box label={t('landing.features.linux.picture')}>
      <div className="h-[220px] -m-4 p-4 font-mono text-[12px] leading-[1.7] bg-[rgba(13,17,23,0.3)]">
        {SESSION[i18n.language === 'ro' ? 'ro' : 'en'].map(([command, output]) => (
          <div key={command}>
            <div>
              <span className="text-[#7EE787]">student@sandbox:~$ </span>
              {command}
            </div>
            <div className="text-[var(--text2)] whitespace-pre">{output}</div>
          </div>
        ))}
        <div>
          <span className="text-[#7EE787]">student@sandbox:~$ </span>
          <span className="inline-block w-[7px] h-[14px] align-middle bg-[var(--text2)]" />
        </div>
      </div>
    </Box>
  );
}

// What the tutor offers to start with on a lesson the student hasn't begun
const TUTOR_STARTERS = ['tutor.start.task', 'tutor.start.broken', 'tutor.start.nudge'];

// The tutor's chat before a conversation starts, as the panel shows it: its
// face circled by the turning arc, the greeting typed in, the line under it
// and three questions to start with, which here lead nowhere. The greeting
// types in again each time the picture comes into view, rather than once
// unseen when the page loads. Under reduced motion it all stands still.
export function TutorPicture() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const shown = useTimesShown(ref);
  return (
    <Box label={t('landing.features.tutor.picture')} height="min-h-[220px]">
      <div ref={ref} className="max-w-[360px] mx-auto">
        <div key={shown} className="flex flex-col items-center gap-2.5 text-center">
          <TutorHero title={t('tutor.emptyTitle')} mood="idle" titleAs="p" />
          <p
            className="m-0 text-[13px] text-[var(--text2)] rise-in"
            style={{ animationDelay: '0.5s' }}
          >
            {t('tutor.intro')}
          </p>
          <div className="flex flex-col gap-2 w-full">
            {TUTOR_STARTERS.map((key, i) => (
              <div key={key} className="rise-in" style={{ animationDelay: `${0.6 + i * 0.07}s` }}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] text-left text-[13px] text-[var(--text2)]">
                  <span className="flex-1 min-w-0">{t(key)}</span>
                  <ArrowRight
                    size={14}
                    aria-hidden="true"
                    className="flex-shrink-0 text-[var(--text3)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Box>
  );
}
