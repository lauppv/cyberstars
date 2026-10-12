import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { ScreenshotSlot } from './ScreenshotSlot';
import { SectionHeading } from './SectionHeading';

// What's inside, one block per place a visitor can go. The forum needs an
// account, so its block says so and leads to sign-up instead of bouncing the
// visitor there unannounced. Preview features (messages, connections, the
// leaderboard) stay off the page until they launch.
const FEATURES = [
  ['courses', '/courses'],
  ['algorithms', '/algorithms'],
  ['almanac', '/almanac'],
  ['forum', '/getstarted'],
] as const;

export function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <section className="max-w-[1120px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <Reveal>
        <SectionHeading title={t('landing.features.title')}>
          {t('landing.features.subtitle')}
        </SectionHeading>
      </Reveal>
      <ul className="flex flex-col gap-14 sm:gap-20 m-0 p-0 list-none">
        {FEATURES.map(([key, to], i) => (
          <li key={key} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14 items-center">
            <Reveal className={i % 2 ? 'lg:order-2' : ''}>
              <h3 className="text-[22px] sm:text-[24px] font-bold tracking-[-0.3px] m-0 mb-3">
                {t(`landing.features.${key}.title`)}
              </h3>
              <p className="text-[15px] text-[var(--text2)] leading-relaxed m-0 mb-4 max-w-[480px]">
                {t(`landing.features.${key}.text`)}
              </p>
              <Link
                to={to}
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--accent)] no-underline hover:brightness-110"
              >
                {t(`landing.features.${key}.link`)}
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </Link>
            </Reveal>
            <Reveal delay={80} className="w-full max-w-[560px] mx-auto lg:max-w-none">
              <ScreenshotSlot label={t(`landing.features.${key}.shot`)} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
