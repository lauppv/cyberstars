import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { PinnedStory } from './PinnedStory';
import { LevelPicture, ReadPicture, TestPicture, WritePicture } from './StepPictures';

const STEPS: [string, ComponentType][] = [
  ['read', ReadPicture],
  ['write', WritePicture],
  ['test', TestPicture],
  ['level', LevelPicture],
];

function Copy({ step }: { step: string }) {
  const { t } = useTranslation();
  return (
    <>
      <h3 className="text-[24px] sm:text-[28px] font-bold tracking-[-0.4px] leading-[1.15] m-0 mb-2">
        {t(`landing.how.${step}.title`)}
      </h3>
      <p className="text-[15px] text-[var(--text2)] m-0">{t(`landing.how.${step}.text`)}</p>
    </>
  );
}

// The four steps, told as a pinned story: the picture held in the middle while
// each step's words rise past it
export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section id="how" className="landing-wash scroll-mt-14">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-20 pb-16 lg:pb-0">
        <Reveal>
          <SectionHeading title={t('landing.how.title')} />
        </Reveal>
        <PinnedStory
          parts={STEPS.map(([key, Picture]) => ({
            key,
            words: <Copy step={key} />,
            picture: <Picture />,
          }))}
        />
      </div>
    </section>
  );
}
