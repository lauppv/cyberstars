import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Reveal } from './Reveal';

// The last ask before the footer: a headline and one big button to the
// placement test, over a band of purple that runs the full width. Worded
// unlike the hero, so the page doesn't close on the line it opened with.
export function CtaBand() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section id="start" className="landing-wash-strong scroll-mt-14">
      <Reveal className="max-w-[1120px] mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
        <h2 className="text-[34px] sm:text-[48px] font-bold tracking-[-1px] leading-[1.05] m-0 mb-8 text-balance">
          {t('landing.cta.final.title')}
        </h2>
        <button
          type="button"
          data-track="test-me"
          onClick={() => navigate('/placement')}
          className="px-10 py-4 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-base font-semibold hover:brightness-110 transition cursor-pointer"
        >
          {t('landing.cta.final.button')}
        </button>
      </Reveal>
    </section>
  );
}
