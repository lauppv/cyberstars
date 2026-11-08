import { useEffect, useState } from 'react';
import { TutorMark, type TutorMood } from './TutorMark';

const REDUCED = '(prefers-reduced-motion: reduce)';

// What greets the student before a conversation starts: the tutor's mark in a
// soft, still light, a thin arc circling it, and the greeting
// typed in, quick, in the landing page's gradient. Under reduced motion it all
// stands still and the greeting shows whole. The landing page's picture of it
// says the greeting as a plain line, since it isn't a heading there
export function TutorHero({
  title,
  mood,
  titleAs = 'h3',
}: {
  title: string;
  mood: TutorMood;
  titleAs?: 'h3' | 'p';
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <span className="tutor-aura" aria-hidden="true" />
        <span className="tutor-orbit" aria-hidden="true" />
        <TutorMark size="xl" mood={mood} />
      </div>
      <TypedTitle text={title} as={titleAs} />
    </div>
  );
}

function TypedTitle({ text, as: Tag }: { text: string; as: 'h3' | 'p' }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.(REDUCED).matches) {
      const done = setTimeout(() => setShown(text.length), 0);
      return () => clearTimeout(done);
    }
    // The whole greeting in about 0.6 s, whatever its length
    const step = Math.max(12, Math.round(600 / Math.max(text.length, 1)));
    let n = 0;
    const timer = setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= text.length) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [text]);

  const typing = shown < text.length;
  return (
    <Tag className="relative m-0 text-[16px] font-semibold" aria-label={text}>
      {/* The whole greeting holds the room, so nothing moves while it types */}
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span className="absolute inset-0 landing-gradient-text" aria-hidden="true">
        {text.slice(0, shown)}
        {typing && <span className="tutor-type-caret" />}
      </span>
    </Tag>
  );
}
