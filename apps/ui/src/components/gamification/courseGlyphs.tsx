import type { ReactNode } from 'react';
import { baseLanguage } from '@cyberstars/shared/constants';

// Course symbol, drawn in a 100x100 box centered on 0,0 with the stroke from the parent
const GLYPHS: Record<string, ReactNode> = {
  python: (
    <>
      <path d="M-14 14 Q-14 2 0 2 Q14 2 14 -10" />
      <circle cx="14" cy="-12" r="4" fill="currentColor" stroke="none" />
      <path d="M18 -12 l4 -2 M18 -12 l4 2" />
    </>
  ),
  c: <path d="M13 -11 A16 16 0 1 0 13 11" />,
  java: (
    <>
      <path d="M-14 -3 H10 V5 A10 10 0 0 1 0 15 H-4 A10 10 0 0 1 -14 5 Z" />
      <path d="M10 0 H13 A5 5 0 0 1 13 10 H9" />
      <path d="M-6 -8 C-9 -12 -3 -14 -6 -18 M2 -8 C-1 -12 5 -14 2 -18" />
    </>
  ),
  linux: (
    <>
      <rect x="-18" y="-14" width="36" height="28" rx="4" />
      <path d="M-10 -5 L-4 0 L-10 5 M0 6 H10" />
    </>
  ),
  'trees-graphs': (
    <>
      <circle cx="0" cy="-12" r="5" />
      <circle cx="-12" cy="10" r="5" />
      <circle cx="12" cy="10" r="5" />
      <path d="M-2.5 -7.5 L-9.5 5.5 M2.5 -7.5 L9.5 5.5 M-7 10 H7" />
    </>
  ),
};

// Unknown courses get a star
const FALLBACK_GLYPH = (
  <path d="M0 -17 L5 -6 L16 -5 L8 3 L10 15 L0 9 L-10 15 L-8 3 L-16 -5 L-5 -6 Z" />
);

// algo-python draws python's symbol
export function courseGlyph(courseKey: string): ReactNode {
  return GLYPHS[baseLanguage(courseKey)] ?? FALLBACK_GLYPH;
}
