import { useTranslation } from 'react-i18next';
import { Reveal } from './Reveal';
import { StartButtons } from './StartButtons';

// A call to action that stands apart from the sections around it. The mid
// band is one line and one button for a visitor convinced halfway down; the
// final one closes the page on a headline and both buttons. Worded unlike the
// hero, so three asks down the page don't read as a template.
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
    <section className="max-w-[1120px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <Reveal className="panel px-6 py-12 sm:py-16 text-center">
        <h2 className="text-[26px] sm:text-[34px] font-bold tracking-[-0.4px] leading-[1.15] m-0 text-balance">
          {t('landing.cta.final.title')}
        </h2>
        <p className="mt-3 mb-8 mx-auto max-w-[560px] text-[15px] sm:text-[16px] text-[var(--text2)] leading-relaxed">
          {t('landing.cta.final.text')}
        </p>
        <StartButtons className="justify-center" />
      </Reveal>
    </section>
  );
}
