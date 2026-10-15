import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleCheck } from 'lucide-react';
import { useCurriculum } from '../../context/CurriculumContext';
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

const CHALLENGES: [string, keyof typeof DIFFICULTY, boolean][] = [
  ['Reverse a String', 'easy', true],
  ['Palindrome Check', 'easy', true],
  ['Caesar Cipher', 'medium', true],
  ['Two Sum', 'medium', false],
  ['Group Anagrams', 'hard', false],
];

export function AlgorithmsPicture() {
  const { t } = useTranslation();
  return (
    <Box label={t('landing.features.algorithms.picture')}>
      <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
        {CHALLENGES.map(([title, diff, solved], i) => {
          const d = DIFFICULTY[diff];
          return (
            <li key={title} className="flex items-center gap-3 h-[32px]">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{
                  background: solved ? 'var(--success)' : d.bg,
                  color: solved ? '#fff' : d.text,
                }}
              >
                {solved ? '✓' : i + 1}
              </span>
              <span className="text-[13px] font-medium flex-1">{title}</span>
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
// prompt and colours
const SESSION: [string, string][] = [
  ['pwd', '/home/student'],
  ['ls', 'mission.txt  reports  tools'],
  ['ls reports', 'january.log  february.log'],
];

export function LinuxPicture() {
  const { t } = useTranslation();
  return (
    <Box label={t('landing.features.linux.picture')}>
      <div className="h-[220px] -m-4 p-4 font-mono text-[12px] leading-[1.7] bg-[rgba(13,17,23,0.3)]">
        {SESSION.map(([command, output]) => (
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
        {TUTOR_TURNS.map(([who, key], i) => (
          <div
            key={key}
            className={`max-w-[85%] text-[13px] ${
              who === 'student'
                ? 'self-end px-3 py-2 rounded-[var(--radius)] bg-[var(--glass)]'
                : 'leading-relaxed'
            } ${i >= 2 ? 'hidden md:block' : ''}`}
          >
            {t(`landing.features.tutor.${key}`)}
          </div>
        ))}
      </div>
    </Box>
  );
}
