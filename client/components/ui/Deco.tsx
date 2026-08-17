import type { ElementType, ReactNode } from 'react';

// Mode-specific presentation, switched by CSS alone (see index.css) so wrapping
// something costs no subscription and no re-render.
//
//   <Deco>🏆</Deco>                     a flourish that exists only in max
//   <Deco only="min">Inbox</Deco>       the plain stand-in min shows instead
//   <Deco as="div" className="mb-2">    when the thing to hide is a block, so
//     📖                                its margins go with it
//   </Deco>
//
// Only for presentation that carries no meaning of its own. If the two modes
// need genuinely different elements — an avatar's fallback, a medal versus a
// rank number — read the mode with `useGraphics` and branch there instead.
export function Deco({
  children,
  className = '',
  only = 'max',
  as: Tag = 'span' as ElementType,
}: {
  children: ReactNode;
  className?: string;
  only?: 'min' | 'max';
  as?: ElementType;
}) {
  return (
    <Tag className={`deco-${only} ${className}`} aria-hidden={only === 'max' || undefined}>
      {children}
    </Tag>
  );
}
