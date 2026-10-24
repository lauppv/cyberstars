import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleCheck } from 'lucide-react';
import { useCurriculum } from '../../context/CurriculumContext';
import { TutorMark } from '../tutor/TutorMark';
import { CodeStill } from './CodeStill';
import { curriculumCounts } from './curriculumCounts';

// The pictures for "what's inside", one per place a visitor can go. They are
// drawn with the app's own pieces and real data, so there are no screenshots
// to go stale and no editor to load.
function Box({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="img" aria-label={label} className="h-[220px] overflow-hidden p-4 text-left">
      {children}
    </div>
  );
}

// Every live course with its real lesson count, longest bar for the most
export function CoursesPicture() {
  const { t } = useTranslation();
  const { courses } = useCurriculum();
  const rows = useMemo(() => curriculumCounts(courses).perCourse, [courses]);
  const most = Math.max(1, ...rows.map((r) => r.lessons));
  return (
    <Box label={t('landing.features.courses.picture')}>
      <ul className="m-0 p-0 list-none flex flex-col gap-4">
        {rows.map((r) => (
          <li key={r.key}>
            <div className="flex items-baseline justify-between text-[13px] mb-1.5">
              <span className="font-semibold">{r.label}</span>
              <span className="text-[var(--text3)]">
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
const DIFFICULTY = {
  easy: { bg: 'rgba(0,214,143,0.12)', text: 'var(--success)' },
  medium: { bg: 'rgba(255,170,0,0.12)', text: 'var(--warning)' },
  hard: { bg: 'rgba(255,107,107,0.12)', text: 'var(--error)' },
};

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

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span
      aria-hidden="true"
      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-semibold text-white"
      style={{ background: color }}
    >
      {initials}
    </span>
  );
}

const FORUM_CODE = `for i in range(3):
    print("Maria")`;

// A beginner's question and the answer that solved it, laid out like a forum thread
export function ForumPicture() {
  const { t } = useTranslation();
  return (
    <Box label={t('landing.features.forum.picture')}>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2.5">
          <Avatar initials="M" color="#3572A5" />
          <div className="min-w-0 flex-1">
            <div className="text-[12px] text-[var(--text3)] mb-1">Maria21</div>
            <div className="text-[13px]">{t('landing.features.forum.question')}</div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Avatar initials="MH" color="#6c5ce7" />
          <div className="min-w-0 flex-1">
            <div className="text-[12px] text-[var(--text3)] mb-1 flex items-center gap-1.5">
              Marco Hoeger
              <span className="inline-flex items-center gap-1 text-[var(--success)]">
                <CircleCheck size={12} strokeWidth={2} aria-hidden="true" />
                {t('landing.features.forum.solved')}
              </span>
            </div>
            <div className="text-[13px] mb-1.5">{t('landing.features.forum.answer')}</div>
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)]">
              <CodeStill code={FORUM_CODE} />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

const TUTOR_TURNS: ['student' | 'tutor', string][] = [
  ['student', 'question'],
  ['tutor', 'answer'],
  ['student', 'followUp'],
  ['tutor', 'followUpAnswer'],
];

// A student stuck on a loop talking it through with the tutor, laid out like
// the tutor panel: each answer points at the idea and leaves the fix to them.
// A phone has room for the first question and answer only.
export function TutorPicture() {
  const { t } = useTranslation();
  return (
    <Box label={t('landing.features.tutor.picture')}>
      <div className="max-w-[640px] mx-auto flex flex-col gap-3">
        {TUTOR_TURNS.map(([who, key], i) =>
          who === 'student' ? (
            <div
              key={key}
              className={`self-end max-w-[85%] px-3 py-2 rounded-[var(--radius)] bg-[var(--accent)]/15 text-[13px] ${
                i >= 2 ? 'hidden md:block' : ''
              }`}
            >
              {t(`landing.features.tutor.${key}`)}
            </div>
          ) : (
            <div
              key={key}
              className={`max-w-[85%] items-start gap-2.5 ${i >= 2 ? 'hidden md:flex' : 'flex'}`}
            >
              <TutorMark size="sm" />
              <p className="pt-0.5 text-[13px] leading-relaxed">
                {t(`landing.features.tutor.${key}`)}
              </p>
            </div>
          ),
        )}
      </div>
    </Box>
  );
}

// Laniakea: planets in the dark, the student's own ringed in blue, one still
// to conquer ringed in white, the rest grey, next to a question from a test.
const GAME_PLANETS: { x: number; y: number; r: number; fill: string; ring?: string }[] = [
  { x: 52, y: 120, r: 22, fill: '#6a5040', ring: '#4da3ff' },
  { x: 120, y: 64, r: 14, fill: '#2a78c4', ring: '#4da3ff' },
  { x: 168, y: 140, r: 18, fill: '#8a5fd0', ring: '#e6ebff' },
  { x: 214, y: 70, r: 10, fill: '#55607a' },
  { x: 236, y: 160, r: 8, fill: '#55607a' },
];

export function GamePicture() {
  const { t } = useTranslation();
  return (
    <Box label={t('landing.features.laniakea.picture')}>
      <div className="flex gap-4 h-full">
        <svg
          viewBox="0 0 260 190"
          className="flex-1 min-w-0 h-full rounded-[var(--radius-sm)] bg-[#05050d]"
          aria-hidden="true"
        >
          {[...Array(40)].map((_, i) => (
            <circle
              key={i}
              cx={(i * 53) % 260}
              cy={(i * 37) % 190}
              r={i % 3 === 0 ? 0.9 : 0.5}
              fill="#cfd9ff"
              opacity={0.6}
            />
          ))}
          {GAME_PLANETS.map((p) => (
            <g key={`${p.x}-${p.y}`}>
              {p.ring === '#4da3ff' && (
                <circle cx={p.x} cy={p.y} r={p.r * 2.2} fill="#4da3ff" opacity={0.12} />
              )}
              <circle cx={p.x} cy={p.y} r={p.r} fill={p.fill} />
              {p.ring && (
                <ellipse
                  cx={p.x}
                  cy={p.y}
                  rx={p.r * 1.8}
                  ry={p.r * 0.55}
                  fill="none"
                  stroke={p.ring}
                  strokeWidth={1.6}
                  opacity={p.ring === '#4da3ff' ? 0.9 : 0.45}
                />
              )}
            </g>
          ))}
        </svg>
        <div className="hidden sm:flex flex-col gap-2 w-[180px] flex-shrink-0 text-[12px]">
          <div className="text-[var(--text3)]">{t('landing.features.laniakea.question')}</div>
          <div className="rounded-[var(--radius-sm)] border border-[var(--border)]">
            <CodeStill code={'print("5 + 3")'} />
          </div>
          <div className="px-2 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] font-mono">
            8
          </div>
          <div className="px-2 py-1.5 rounded-[var(--radius-sm)] border border-[var(--success)] text-[var(--success)] font-mono">
            5 + 3
          </div>
        </div>
      </div>
    </Box>
  );
}
