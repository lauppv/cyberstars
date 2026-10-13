import { useTranslation } from 'react-i18next';
import { Reveal } from './Reveal';
import { StartButtons } from './StartButtons';

// A call to action that stands apart from the sections around it. The mid
// band is one line and one button for a visitor convinced halfway down; the
// final one closes the page on a headline and both buttons over a purple glow.
// Worded unlike the hero, so the asks down the page don't read as a template.
export function CtaBand({ tone }: { tone: 'mid' | 'final' }) {
  const { t } = useTranslation();

  if (tone === 'mid') {
    return (
      <section className="border-y border-[var(--border)] bg-[var(--bg2)]">
        <Reveal className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <p className="m-0 text-[18px] sm:text-[20px] font-semibold">{t('landing.cta.mid')}</p>
          <StartButtons signIn={false} className="justify-center" />
        </Reveal>
      </section>
    );
  }

  return (
    <section className="landing-glow-center">
      <Reveal className="max-w-[1120px] mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
        <h2 className="text-[34px] sm:text-[48px] font-bold tracking-[-1px] leading-[1.05] m-0 mb-8 text-balance">
          {t('landing.cta.final.title')}
        </h2>
        <StartButtons className="justify-center" />
      </Reveal>
    </section>
  );
}
