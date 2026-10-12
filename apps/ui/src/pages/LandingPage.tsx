import { useNavigate } from 'react-router';
import { useTranslation, Trans } from 'react-i18next';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { Reveal } from '../components/landing/Reveal';
import { ProofStrip } from '../components/landing/ProofStrip';

const CARDS = [
  ['readCard', 'readCardDesc'],
  ['writeCard', 'writeCardDesc'],
  ['runCard', 'runCardDesc'],
  ['levelCard', 'levelCardDesc'],
] as const;

// What a visitor sees on the home address. A signed-in student gets the
// dashboard there instead (HomePage decides).
export function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <LandingNav />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <Reveal>
            <h1 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.5px] mb-3">
              {t('home.marketing.title')}
            </h1>
            <p className="text-[var(--text2)] text-base sm:text-lg mb-10">
              <Trans
                i18nKey="home.marketing.subtitle"
                components={{
                  1: <span className="text-[var(--text)] font-semibold" />,
                  3: <span className="text-[var(--text)] font-semibold" />,
                  5: <span className="text-[var(--text)] font-semibold" />,
                  7: <span className="text-[var(--text)] font-semibold" />,
                }}
              />
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
              <button
                onClick={() => navigate('/courses')}
                className="px-6 py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer"
              >
                {t('home.marketing.startLearning')}
              </button>
              <button
                onClick={() => navigate('/getstarted')}
                className="px-6 py-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition cursor-pointer"
              >
                {t('home.marketing.signIn')}
              </button>
            </div>
          </Reveal>
        </div>

        <ProofStrip />

        <div className="flex justify-center px-6 py-14">
          <div className="max-w-3xl w-full text-center">
            <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 max-w-4xl mx-auto text-left">
              {CARDS.map(([title, desc]) => (
                <div key={title} className="p-5 panel rounded-[var(--radius)]">
                  <div className="font-semibold mb-1">{t(`home.marketing.${title}`)}</div>
                  <div className="text-sm text-[var(--text2)]">{t(`home.marketing.${desc}`)}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
