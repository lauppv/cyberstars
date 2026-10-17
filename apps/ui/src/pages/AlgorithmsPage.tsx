import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Topbar } from '../components/layout/Topbar';
import { ALGO_COURSE_KEYS, isBeta, xpForCourse } from '@cyberstars/shared/constants';
import { useCurriculum } from '../context/CurriculumContext';
import { courseLabel, courseMeta } from '../constants/courses';
import { BetaBadge } from '../components/ui/BetaBadge';

const LANGS = ALGO_COURSE_KEYS.map((key) => {
  const m = courseMeta(key);
  return { key, icon: m.icon, color: m.color };
});

export function AlgorithmsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { courses } = useCurriculum();

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-5">
          {LANGS.map((lang) => {
            const course = courses.find((c) => c.key === lang.key);
            const totalXp = course ? xpForCourse(course.lessons.length) : 0;
            return (
              <button
                key={lang.key}
                onClick={() => navigate(`/algorithms/${lang.key.replace('algo-', '')}`)}
                className="text-left p-6 panel rounded-xl hover:border-[var(--accent)] transition cursor-pointer group flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="flex-1 min-w-0 text-lg font-bold group-hover:text-[var(--accent)] transition truncate">
                    {courseLabel(lang.key, t)}
                  </h3>
                  {isBeta(lang.key) && <BetaBadge />}
                  {totalXp > 0 && (
                    <span
                      className="flex-shrink-0 text-[12px] font-semibold px-2.5 py-0.5 rounded-full border border-[var(--border)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      title={t('common.xpTotal', { xp: totalXp })}
                    >
                      {t('common.xpTotal', { xp: totalXp })}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[var(--text2)] leading-relaxed">
                  {t(`algorithms.desc.${lang.key}`)}
                </p>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
