import type { ComponentType } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { AlgorithmsPicture, AlmanacPicture, CoursesPicture, ForumPicture } from './FeaturePictures';

// What's inside, one tile per place a visitor can go: a picture and a name.
// The forum needs an account, so its tile leads to sign-up and says so.
// Preview features (messages, connections, the leaderboard) stay off the page.
const FEATURES: [string, string, ComponentType][] = [
  ['courses', '/courses', CoursesPicture],
  ['algorithms', '/algorithms', AlgorithmsPicture],
  ['almanac', '/almanac', AlmanacPicture],
  ['forum', '/getstarted', ForumPicture],
];

export function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <section className="max-w-[1120px] mx-auto px-4 sm:px-6 py-20 sm:py-24">
      <Reveal>
        <SectionHeading title={t('landing.features.title')} />
      </Reveal>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 m-0 p-0 list-none">
        {FEATURES.map(([key, to, Picture], i) => (
          <li key={key}>
            <Reveal delay={(i % 2) * 80}>
              <Picture />
              <Link
                to={to}
                className="mt-4 inline-flex items-center gap-1.5 text-[17px] font-semibold text-[var(--text)] no-underline hover:text-[var(--accent)]"
              >
                {t(`landing.features.${key}.title`)}
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
              {key === 'forum' && (
                <p className="m-0 mt-1 text-[13px] text-[var(--text3)]">
                  {t('landing.features.forum.note')}
                </p>
              )}
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
