import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Reveal } from './Reveal';

// One part of a pinned story: its words, its picture, and on a wide screen
// the id the chapters at the side of the page scroll to.
export interface StoryPart {
  key: string;
  id?: string;
  words: ReactNode;
  picture: ReactNode;
}

// kenvo-site's pinned gesture (its ProblemPinned), without framer-motion: the
// picture sits pinned in the middle column while each part's words scroll
// past, left, right, left, right. A part fades in as it reaches the middle of
// the screen and out as it leaves, and the part past half opacity owns the
// picture. The right column starts half a part lower than the left, so no two
// parts are ever on screen at full strength together.

// A part's opacity along its own scroll progress, from its top entering the
// screen (0) to its bottom leaving it (1): nothing until a third, full from
// the middle to two thirds, gone by 83%. The middle is the part centred.
function opacityAt(p: number): number {
  if (p <= 0.33 || p >= 0.83) return 0;
  if (p < 0.5) return (p - 0.33) / 0.17;
  if (p <= 0.66) return 1;
  return (0.83 - p) / 0.17;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function Pinned({ parts }: { parts: StoryPart[] }) {
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

  const column = (side: 0 | 1, lead: string) => (
    <div className={`flex flex-col gap-12 ${lead}`}>
      {parts.map((part, i) =>
        i % 2 === side ? (
          <div key={part.key} id={part.id} className="h-screen flex flex-col justify-center">
            <div
              ref={(el) => {
                blocks.current[i] = el;
              }}
              data-step={part.key}
            >
              {part.words}
            </div>
          </div>
        ) : null,
      )}
    </div>
  );

  return (
    <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_440px_minmax(0,1fr)] lg:items-start lg:gap-x-12">
      {column(0, 'pt-[60vh]')}
      {/* self-stretch gives the sticky picture the whole section to travel */}
      <div className="self-stretch">
        <div className="sticky top-0 h-screen flex items-center">
          <div className="relative w-full h-[300px]">
            {parts.map((part, i) => (
              <div
                key={part.key}
                data-picture={part.key}
                aria-hidden={active !== i}
                className={`absolute inset-0 flex items-center ${still ? '' : 'transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'} ${active === i ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="w-full">{part.picture}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {column(1, 'pt-[110vh]')}
    </div>
  );
}

// Below 1024px there's no room for three columns: each part is its words and
// then its picture, fading in as it arrives.
function Stacked({ parts }: { parts: StoryPart[] }) {
  return (
    <ol className="lg:hidden flex flex-col gap-14 m-0 p-0 list-none">
      {parts.map((part) => (
        <li key={part.key} className="flex flex-col gap-5">
          <Reveal>{part.words}</Reveal>
          <Reveal delay={80} className="w-full max-w-[560px]">
            {part.picture}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export function PinnedStory({ parts }: { parts: StoryPart[] }) {
  return (
    <>
      <Pinned parts={parts} />
      <Stacked parts={parts} />
    </>
  );
}
