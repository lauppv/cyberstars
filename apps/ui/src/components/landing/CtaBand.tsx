import { useTranslation } from 'react-i18next';
import { Reveal } from './Reveal';
import { StartButtons } from './StartButtons';

// The last ask before the footer: a headline and both buttons over a band of
// purple that runs the full width. Worded unlike the hero, so the page doesn't
// close on the line it opened with.
export function CtaBand() {
  const { t } = useTranslation();

  return (
    <section className="landing-wash-strong">
      <Reveal className="max-w-[1120px] mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
        <h2 className="text-[34px] sm:text-[48px] font-bold tracking-[-1px] leading-[1.05] m-0 mb-8 text-balance">
          {t('landing.cta.final.title')}
        </h2>
        <StartButtons className="justify-center" />
      </Reveal>
    </section>
  );
}
