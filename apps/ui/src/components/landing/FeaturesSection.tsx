import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { LANIAKEA_UNLOCK_LESSONS } from '@cyberstars/shared/laniakea';
import { Reveal } from './Reveal';
import { BetaBadge } from '../ui/BetaBadge';
import { SectionHeading } from './SectionHeading';
import {
  AlgorithmsPicture,
  CoursesPicture,
  ForumPicture,
  GamePicture,
  LinuxPicture,
  TutorPicture,
} from './FeaturePictures';

// What's inside, one card per part of CyberStars: its name on top, its
// picture below. The forum and the tutor need an account, and their cards say
// so; Laniakea says it opens after the first Python lessons, and in a few
// lines what it is, since no picture alone tells a game's rules. Laniakea and the
// tutor each take a whole row. Messages, connections and the leaderboard stay
// off the page.
const FEATURES: [string, ComponentType][] = [
  ['courses', CoursesPicture],
  ['algorithms', AlgorithmsPicture],
  ['linux', LinuxPicture],
  ['forum', ForumPicture],
  ['laniakea', GamePicture],
  ['tutor', TutorPicture],
];

const NEEDS_ACCOUNT = new Set(['forum', 'tutor']);
const WIDE = new Set(['laniakea', 'tutor']);

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
          <li key={key} className={WIDE.has(key) ? 'md:col-span-2' : undefined}>
            <Reveal delay={(i % 2) * 80} className="panel overflow-hidden">
              <div className="min-h-12 px-4 py-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-[var(--border)]">
                <h3 className="m-0 text-[15px] font-semibold tracking-[-0.2px] flex items-center gap-2">
                  {t(`landing.features.${key}.title`)}
                  {key === 'laniakea' && <BetaBadge hint={t('laniakea.betaHint')} />}
                </h3>
                {(NEEDS_ACCOUNT.has(key) || key === 'laniakea') && (
                  <span className="px-2 py-0.5 rounded-full bg-[var(--glass)] text-[11px] text-[var(--text3)]">
                    {key === 'laniakea'
                      ? t('landing.features.laniakea.note', { count: LANIAKEA_UNLOCK_LESSONS })
                      : t('landing.features.accountNote')}
                  </span>
                )}
              </div>
              {key === 'laniakea' && (
                <p className="m-0 px-4 pt-4 text-[14px] leading-relaxed text-[var(--text2)] max-w-[720px]">
                  {t('landing.features.laniakea.body')}
                </p>
              )}
              <Picture />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
