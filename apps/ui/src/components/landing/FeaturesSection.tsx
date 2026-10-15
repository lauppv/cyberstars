import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import {
  AlgorithmsPicture,
  CoursesPicture,
  ForumPicture,
  LinuxPicture,
  TutorPicture,
} from './FeaturePictures';

// What's inside, one card per part of CyberStars: its name on top, its
// picture below. The forum and the tutor need an account, and their cards say
// so; the tutor, fifth, takes the whole row. Preview features (messages,
// connections, the leaderboard) stay off the page.
const FEATURES: [string, ComponentType][] = [
  ['courses', CoursesPicture],
  ['algorithms', AlgorithmsPicture],
  ['linux', LinuxPicture],
  ['forum', ForumPicture],
  ['tutor', TutorPicture],
];

const NEEDS_ACCOUNT = new Set(['forum', 'tutor']);

export function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section
      id="features"
      className="scroll-mt-14 max-w-[1120px] mx-auto px-4 sm:px-6 py-20 sm:py-24"
    >
      <Reveal>
        <SectionHeading title={t('landing.features.title')} />
      </Reveal>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 m-0 p-0 list-none">
        {FEATURES.map(([key, Picture], i) => (
          <li key={key} className={key === 'tutor' ? 'md:col-span-2' : undefined}>
            <Reveal delay={(i % 2) * 80} className="panel overflow-hidden">
              <div className="h-12 px-4 flex items-center justify-between gap-3 border-b border-[var(--border)]">
                <h3 className="m-0 text-[15px] font-semibold tracking-[-0.2px]">
                  {t(`landing.features.${key}.title`)}
                </h3>
                {NEEDS_ACCOUNT.has(key) && (
                  <span className="px-2 py-0.5 rounded-full bg-[var(--glass)] text-[11px] text-[var(--text3)]">
                    {t('landing.features.accountNote')}
                  </span>
                )}
              </div>
              <Picture />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
