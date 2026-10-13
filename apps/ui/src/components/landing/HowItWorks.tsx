import { useEffect, useRef, useState, type ComponentType } from 'react';
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

// kenvo-site's pinned gesture (its ProblemPinned), without framer-motion: the
// picture sits pinned in the middle column while each step's words scroll
// past, left, right, left, right. A step fades in as it reaches the middle of
// the screen and out as it leaves, and the step past half opacity owns the
// picture. The right column starts half a step lower than the left, so no two
// steps are ever on screen at full strength together.
const LEFT = [0, 2];
const RIGHT = [1, 3];

// A step's opacity along its own scroll progress, from its top entering the
// screen (0) to its bottom leaving it (1): nothing until a third, full from
// the middle to two thirds, gone by 83%. The middle is the step centred.
function opacityAt(p: number): number {
  if (p <= 0.33 || p >= 0.83) return 0;
  if (p < 0.5) return (p - 0.33) / 0.17;
  if (p <= 0.66) return 1;
  return (0.83 - p) / 0.17;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

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

function Pinned() {
  const [active, setActive] = useState(0);
  const [still, setStill] = useState(false);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStill(true); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      blocks.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const o = opacityAt((vh - r.top) / (r.height + vh));
        el.style.opacity = String(o);
        if (o > 0.5) setActive(i);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const column = (indices: number[], lead: string) => (
    <div className={`flex flex-col gap-12 ${lead}`}>
      {indices.map((i) => (
        <div key={STEPS[i][0]} className="h-screen flex flex-col justify-center">
          <div
            ref={(el) => {
              blocks.current[i] = el;
            }}
            data-step={STEPS[i][0]}
          >
            <Copy step={STEPS[i][0]} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_440px_minmax(0,1fr)] lg:items-start lg:gap-x-12">
      {column(LEFT, 'pt-[60vh]')}
      {/* self-stretch gives the sticky picture the whole section to travel */}
      <div className="self-stretch">
        <div className="sticky top-0 h-screen flex items-center">
          <div className="relative w-full h-[300px]">
            {STEPS.map(([key, Picture], i) => (
              <div
                key={key}
                data-picture={key}
                aria-hidden={active !== i}
                className={`absolute inset-0 ${still ? '' : 'transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'} ${active === i ? 'opacity-100' : 'opacity-0'}`}
              >
                <Picture />
              </div>
            ))}
          </div>
        </div>
      </div>
      {column(RIGHT, 'pt-[110vh]')}
    </div>
  );
}

// Below 1024px there's no room for three columns: each step is its words and
// then its picture, fading in as it arrives.
function Stacked() {
  return (
    <ol className="lg:hidden flex flex-col gap-14 m-0 p-0 list-none">
      {STEPS.map(([key, Picture]) => (
        <li key={key} className="flex flex-col gap-5">
          <Reveal>
            <Copy step={key} />
          </Reveal>
          <Reveal delay={80} className="w-full max-w-[560px]">
            <Picture />
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="landing-wash">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-20 pb-16 lg:pb-0">
        <Reveal>
          <SectionHeading title={t('landing.how.title')} />
        </Reveal>
        <Pinned />
        <Stacked />
      </div>
    </section>
  );
}
