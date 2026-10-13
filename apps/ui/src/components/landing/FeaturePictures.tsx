import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleCheck } from 'lucide-react';
import { useCurriculum } from '../../context/CurriculumContext';
import { Runtime } from '../judge/Runtime';
import { CodeStill } from './CodeStill';
import { curriculumCounts } from './curriculumCounts';

// The pictures for "what's inside", one per place a visitor can go. They are
// drawn with the app's own pieces and real data, so there are no screenshots
// to go stale and no editor to load.
function Box({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="img" aria-label={label} className="panel h-[220px] overflow-hidden p-4 text-left">
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

// The judge's real runtime card, as an algorithm challenge shows it after a pass
export function AlgorithmsPicture() {
  const { t } = useTranslation();
  return (
    <Box label={t('landing.features.algorithms.picture')}>
      <div className="flex items-center gap-2 text-[var(--success)] font-semibold text-[16px] mb-4">
        <CircleCheck size={18} strokeWidth={2} aria-hidden="true" />
        {t('tests.verdict.accepted')}
      </div>
      <Runtime runtimeMs={29.6} referenceMs={41.9} />
    </Box>
  );
}

// Three real Almanac stories, with the titles the Almanac gives them
const STORIES: Record<'en' | 'ro', [string, string][]> = {
  en: [
    ['1843', 'Ada Lovelace wrote code before computers existed'],
    ['1969', 'Margaret Hamilton wrote the code that landed Apollo 11'],
    ['1991', 'How a 21-year-old in Helsinki accidentally changed the world'],
  ],
  ro: [
    ['1843', 'Ada Lovelace a scris cod înainte să existe computerele'],
    ['1969', 'Margaret Hamilton a scris codul care a aselenizat Apollo 11'],
    ['1991', 'Cum un tânăr de 21 de ani din Helsinki a schimbat din întâmplare lumea'],
  ],
};

export function AlmanacPicture() {
  const { t, i18n } = useTranslation();
  const stories = STORIES[i18n.language === 'ro' ? 'ro' : 'en'];
  return (
    <Box label={t('landing.features.almanac.picture')}>
      <ul className="m-0 p-0 list-none flex flex-col gap-2">
        {stories.map(([year, title]) => (
          <li key={year} className="rounded-[var(--radius-sm)] bg-[var(--glass)] px-3 py-2.5">
            <div className="text-[11px] text-[var(--text3)] mb-0.5">{year}</div>
            <div className="text-[13px] font-semibold leading-snug">{title}</div>
          </li>
        ))}
      </ul>
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

// A question and the answer that solved it, laid out like a forum thread
export function ForumPicture() {
  const { t } = useTranslation();
  return (
    <Box label={t('landing.features.forum.picture')}>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2.5">
          <Avatar initials="MR" color="#3572A5" />
          <div className="min-w-0 flex-1">
            <div className="text-[12px] text-[var(--text3)] mb-1">maria_r</div>
            <div className="text-[13px] mb-1.5">{t('landing.features.forum.question')}</div>
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)]">
              <CodeStill code="for i in range(1, n):" />
            </div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Avatar initials="SK" color="#6c5ce7" />
          <div className="min-w-0 flex-1">
            <div className="text-[12px] text-[var(--text3)] mb-1 flex items-center gap-1.5">
              sk_dev
              <span className="inline-flex items-center gap-1 text-[var(--success)]">
                <CircleCheck size={12} strokeWidth={2} aria-hidden="true" />
                {t('landing.features.forum.solved')}
              </span>
            </div>
            <div className="text-[13px]">{t('landing.features.forum.answer')}</div>
          </div>
        </div>
      </div>
    </Box>
  );
}
