import { useTranslation } from 'react-i18next';
import { PREVIEW_FEATURES } from '@cyberstars/shared/features';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { PinnedStory } from './PinnedStory';
import { FEATURES, featureId } from './featureList';

function Words({ part }: { part: string }) {
  const { t } = useTranslation();
  return (
    <>
      {part === 'web' && PREVIEW_FEATURES.webDevelopment && (
        <span
          title={t('common.comingSoonHint')}
          className="inline-flex mb-3 px-2 py-0.5 rounded-full border border-[var(--border)] text-[11px] font-semibold text-[var(--text2)]"
        >
          {t('common.comingSoon')}
        </span>
      )}
      <h3 className="text-[24px] sm:text-[28px] font-bold tracking-[-0.4px] leading-[1.15] m-0 mb-2">
        {t(`landing.features.${part}.title`)}
      </h3>
      <p className="text-[15px] text-[var(--text2)] m-0">{t(`landing.features.${part}.text`)}</p>
    </>
  );
}

// What's inside, told like How it works above: each part's picture held in
// the middle while its name and a sentence rise past it, the same pictures
// drawn from the app's own pieces. Web Development says Coming soon while it
// is a preview feature, and stops saying it once launched.
export function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <section id="features" className="landing-wash scroll-mt-14">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-20 pb-16 lg:pb-0">
        <Reveal>
          <SectionHeading title={t('landing.features.title')} />
        </Reveal>
        <PinnedStory
          parts={FEATURES.map(([key, Picture]) => ({
            key,
            id: featureId(key),
            words: <Words part={key} />,
            picture: (
              <div className="panel overflow-hidden">
                <Picture />
              </div>
            ),
          }))}
        />
      </div>
    </section>
  );
}
