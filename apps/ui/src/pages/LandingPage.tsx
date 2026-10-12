import { useNavigate } from 'react-router';
import { useTranslation, Trans } from 'react-i18next';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { Reveal } from '../components/landing/Reveal';
import { HeroPreview } from '../components/landing/HeroPreview';
import { ProofStrip } from '../components/landing/ProofStrip';
import { ProblemSection } from '../components/landing/ProblemSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeaturesSection } from '../components/landing/FeaturesSection';

// What a visitor sees on the home address. A signed-in student gets the
// dashboard there instead (HomePage decides).
export function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <LandingNav />

      <main className="flex-1">
        <section className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-12 pb-14 sm:pt-16 lg:pt-20 lg:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <Reveal>
              <h1 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.5px] leading-[1.1] mb-4">
                {t('home.marketing.title')}
              </h1>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-[var(--text2)] text-base sm:text-lg mb-8 max-w-[560px] mx-auto lg:mx-0">
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
            </Reveal>
            <Reveal delay={160}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
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

          {/* Under the text below 1024px, so it never pushes the buttons down */}
          <Reveal delay={240} className="w-full max-w-[560px] mx-auto lg:max-w-none">
            <HeroPreview />
          </Reveal>
        </section>

        <ProofStrip />

        <ProblemSection />
        <HowItWorks />
        <FeaturesSection />
      </main>

      <LandingFooter />
    </div>
  );
}
