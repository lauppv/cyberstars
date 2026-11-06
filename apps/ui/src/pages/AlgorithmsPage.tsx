import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Topbar } from '../components/layout/Topbar';
import { PageHeader } from '../components/layout/PageHeader';
import { ALGO_COURSE_KEYS, isBeta, xpForCourse } from '@cyberstars/shared/constants';
import { useCurriculum } from '../context/CurriculumContext';
import { courseLabel, courseMeta, courseWash } from '../constants/courses';
import { BetaBadge } from '../components/ui/BetaBadge';
import { CourseMark } from '../components/ui/CourseMark';

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
        <PageHeader title={t('nav.algorithms')} subtitle={t('algorithms.subtitle')} />
        <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-5">
          {LANGS.map((lang) => {
            const course = courses.find((c) => c.key === lang.key);
            const totalXp = course ? xpForCourse(course.lessons.length) : 0;
            return (
              <button
                key={lang.key}
                onClick={() => navigate(`/algorithms/${lang.key.replace('algo-', '')}`)}
                className="text-left panel rounded-xl overflow-hidden hover:border-[var(--course)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_#0004] transition-all cursor-pointer group flex flex-col"
                style={
                  { '--course': lang.color, backgroundImage: courseWash(lang.key) } as CSSProperties
                }
              >
                <div className="h-1.5 w-full" style={{ background: lang.color }} />
                <div className="p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <CourseMark courseKey={lang.key} />
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
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
