import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

// visible: as rendered, before the script is ready or when it won't animate
// hidden: waiting below the fold for its first appearance
// shown: on screen once, and stays that way
type Phase = 'visible' | 'hidden' | 'shown';

const LOOK: Record<Phase, string> = {
  visible: '',
  hidden: 'opacity-0 translate-y-4',
  shown:
    'opacity-100 translate-y-0 transition-[opacity,translate] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
};

// The one fade on the landing page: a block fades in and rises 16px the first
// time it enters the screen, on one curve and one duration for everything.
//
// A block starts visible and only hides itself once the observer that will
// bring it back is in place, before the first paint. A script that never runs
// leaves the content on screen, not a blank page. Under reduced motion it
// never hides at all.
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('visible');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setPhase('shown');
        io.disconnect();
      },
      // On its first visible pixel: a block peeking in at the bottom of the
      // first screen (the hero's buttons on a short window) must not sit there
      // hidden, and a tall block may never be mostly on screen
      { threshold: 0 },
    );
    setPhase('hidden'); // eslint-disable-line react-hooks/set-state-in-effect
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal={phase} className={`${LOOK[phase]} ${className}`.trim()}>
      {children}
    </div>
  );
}
