import { Trans } from 'react-i18next';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { Reveal } from '../components/landing/Reveal';
import { StartButtons } from '../components/landing/StartButtons';
import { HeroPreview } from '../components/landing/HeroPreview';
import { ProofStrip } from '../components/landing/ProofStrip';
import { HowItWorks } from '../components/landing/HowItWorks';
import { AlgorithmLoops } from '../components/landing/AlgorithmLoops';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { CtaBand } from '../components/landing/CtaBand';
import { FreeSection } from '../components/landing/FreeSection';
import { Faq } from '../components/landing/Faq';
import { ChapterRail } from '../components/landing/ChapterRail';

// What a visitor sees on the home address. A signed-in student gets the
// dashboard there instead (HomePage decides).
export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <LandingNav />
      <ChapterRail />

      <main className="flex-1">
        <div className="landing-glow">
          <section className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-12 pb-14 sm:pt-16 lg:pt-20 lg:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <Reveal>
                <h1 className="text-[36px] sm:text-[52px] font-bold tracking-[-1px] leading-[1.05] mb-4">
                  <Trans
                    i18nKey="home.marketing.title"
                    components={{ 1: <span className="landing-gradient-text" /> }}
                  />
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
                <StartButtons className="justify-center lg:justify-start" />
              </Reveal>
            </div>

            {/* Under the text below 1024px, so it never pushes the buttons down */}
            <Reveal delay={240} className="w-full max-w-[560px] mx-auto lg:max-w-none">
              <HeroPreview />
            </Reveal>
          </section>
        </div>

        <ProofStrip />

        <HowItWorks />
        <AlgorithmLoops />
        <FeaturesSection />
        <FreeSection />
        <Faq />
        <CtaBand />
      </main>

      <LandingFooter />
    </div>
  );
}
