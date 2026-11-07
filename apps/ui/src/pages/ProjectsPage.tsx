import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Topbar } from '../components/layout/Topbar';
import { PageHeader } from '../components/layout/PageHeader';
import { BetaBadge } from '../components/ui/BetaBadge';
import { CourseMark } from '../components/ui/CourseMark';
import { courseLabel, courseMeta, courseWash } from '../constants/courses';
import { useAuth } from '../context/AuthContext';
import { canAccessFeature } from '@cyberstars/shared/features';
import { PROJECTS, PROJECT_LANGUAGES } from '@cyberstars/shared/projects';
import { NotFoundPage } from './NotFoundPage';

// A card per language, as on Algorithms; each opens that language's list
export function ProjectsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!canAccessFeature('projects', user?.role, import.meta.env.PROD)) return <NotFoundPage />;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <PageHeader title={t('nav.projects')} subtitle={t('projects.subtitle')} />
        <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-5">
          {PROJECT_LANGUAGES.map((language) => {
            const { color } = courseMeta(language);
            const count = PROJECTS.filter((p) => p.language === language).length;
            return (
              <button
                key={language}
                onClick={() => navigate(`/projects/${language}`)}
                className="text-left panel rounded-xl overflow-hidden hover:border-[var(--course)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_#0004] transition-all cursor-pointer group flex flex-col"
                style={
                  { '--course': color, backgroundImage: courseWash(language) } as CSSProperties
                }
              >
                <div className="h-1.5 w-full" style={{ background: color }} />
                <div className="p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <CourseMark courseKey={language} />
                    <h3 className="flex-1 min-w-0 text-lg font-bold group-hover:text-[var(--accent)] transition truncate">
                      {t('projects.setTitle', { language: courseLabel(language, t) })}
                    </h3>
                    <BetaBadge hint={t('projects.betaHint')} />
                    <span className="flex-shrink-0 text-[12px] font-semibold px-2.5 py-0.5 rounded-full border border-[var(--border)] bg-[var(--accent)]/10 text-[var(--accent)]">
                      {t('projects.count', { count })}
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--text2)] leading-relaxed">
                    {t(`projects.desc.${language}`)}
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
