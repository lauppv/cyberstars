import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurriculum } from '../../context/CurriculumContext';
import { curriculumCounts } from './curriculumCounts';
import { Reveal } from './Reveal';

// Under the hero: how much there is to learn, in numbers,
// counted from the curriculum so a new lesson moves the numbers on its own.
// Until the curriculum arrives (or if it never does) there's nothing to claim.
export function ProofStrip() {
  const { t } = useTranslation();
  const { courses } = useCurriculum();
  const counts = useMemo(() => curriculumCounts(courses), [courses]);
  const stats = [
    ['courses', counts.courses],
    ['lessons', counts.lessons],
    ['challenges', counts.challenges],
  ] as const;

  if (counts.courses === 0) return null;

  return (
    <section aria-label={t('landing.proof.label')} className="border-y border-[var(--border)]">
      <Reveal className="max-w-[1120px] mx-auto px-4 sm:px-6 py-8 flex justify-center">
        <ul className="flex flex-wrap justify-center gap-x-10 gap-y-3 m-0 p-0 list-none">
          {stats.map(([key, n]) => (
            <li key={key} className="flex items-baseline gap-2">
              <span className="text-[28px] font-semibold tracking-[-0.5px] text-[var(--text)]">
                {n}
              </span>
              <span className="text-[13px] text-[var(--text3)]">
                {t(`landing.proof.${key}`, { count: n })}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
