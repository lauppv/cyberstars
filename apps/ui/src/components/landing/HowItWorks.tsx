import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { LevelPicture, ReadPicture, TestPicture, WritePicture } from './StepPictures';

const STEPS: [string, ComponentType][] = [
  ['read', ReadPicture],
  ['write', WritePicture],
  ['test', TestPicture],
  ['level', LevelPicture],
];

// Four steps, each a short paragraph beside a picture from the app. On a wide
// screen they alternate sides; on a phone the text comes first.
export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="max-w-[1120px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <Reveal>
        <SectionHeading title={t('landing.how.title')}>{t('landing.how.subtitle')}</SectionHeading>
      </Reveal>
      <ol className="flex flex-col gap-14 sm:gap-20 m-0 p-0 list-none">
        {STEPS.map(([key, Picture], i) => (
          <li key={key} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14 items-center">
            <Reveal className={i % 2 ? 'lg:order-2' : ''}>
              <div className="text-[13px] font-semibold text-[var(--accent)] mb-2">
                {t('landing.how.step', { n: i + 1 })}
              </div>
              <h3 className="text-[22px] sm:text-[24px] font-bold tracking-[-0.3px] m-0 mb-3">
                {t(`landing.how.${key}.title`)}
              </h3>
              <p className="text-[15px] text-[var(--text2)] leading-relaxed m-0 max-w-[480px]">
                {t(`landing.how.${key}.text`)}
              </p>
            </Reveal>
            <Reveal delay={80} className="w-full max-w-[560px] mx-auto lg:max-w-none">
              <Picture />
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
