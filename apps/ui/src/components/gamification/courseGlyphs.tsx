import type { ReactNode } from 'react';
import { baseLanguage } from '@cyberstars/shared/constants';

// Course symbol, drawn in a 100x100 box centered on 0,0 with the stroke from the parent
// The Web Development card and the course under it share a glyph
const WEB_GLYPH = <path d="M-8 -12 L-18 0 L-8 12 M8 -12 L18 0 L8 12 M4 -16 L-4 16" />;

const GLYPHS: Record<string, ReactNode> = {
  python: (
    <>
      <path d="M-14 14 Q-14 2 0 2 Q14 2 14 -10" />
      <circle cx="14" cy="-12" r="4" fill="currentColor" stroke="none" />
      <path d="M18 -12 l4 -2 M18 -12 l4 2" />
    </>
  ),
  c: (
    <>
      <path d="M10.7 -4.2 L16.2 -2.9 L16.2 2.9 L10.7 4.2 L10.5 4.6 L13.5 9.4 L9.4 13.5 L4.6 10.5 L4.2 10.7 L2.9 16.2 L-2.9 16.2 L-4.2 10.7 L-4.6 10.5 L-9.4 13.5 L-13.5 9.4 L-10.5 4.6 L-10.7 4.2 L-16.2 2.9 L-16.2 -2.9 L-10.7 -4.2 L-10.5 -4.6 L-13.5 -9.4 L-9.4 -13.5 L-4.6 -10.5 L-4.2 -10.7 L-2.9 -16.2 L2.9 -16.2 L4.2 -10.7 L4.6 -10.5 L9.4 -13.5 L13.5 -9.4 L10.5 -4.6 Z" />
      <circle cx="0" cy="0" r="5" />
    </>
  ),
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
  web: WEB_GLYPH,
  'web-dev': WEB_GLYPH,
};

// Unknown courses get a star
const FALLBACK_GLYPH = (
  <path d="M0 -17 L5 -6 L16 -5 L8 3 L10 15 L0 9 L-10 15 L-8 3 L-16 -5 L-5 -6 Z" />
);

// algo-python draws python's symbol
export function courseGlyph(courseKey: string): ReactNode {
  return GLYPHS[baseLanguage(courseKey)] ?? FALLBACK_GLYPH;
}

// A part's symbol is the page the student builds in it
const PART_GLYPHS: Record<string, ReactNode> = {
  'station-home': <path d="M-16 -1 L0 -15 L16 -1 M-11 -5 V15 H11 V-5 M-4 15 V5 H4 V15" />,
  'crew-directory': (
    <>
      <circle cx="-6" cy="-6" r="5.5" />
      <path d="M-17 14 A11 11 0 0 1 5 14" />
      <circle cx="10" cy="-9" r="4.5" />
      <path d="M7 2 A9 9 0 0 1 19 11" />
    </>
  ),
  'flight-schedule': (
    <>
      <rect x="-17" y="-14" width="34" height="28" rx="3" />
      <path d="M-17 -5 H17 M-17 4 H17 M-6 -14 V14" />
    </>
  ),
  'boarding-form': (
    <>
      <rect x="-14" y="-17" width="28" height="34" rx="3" />
      <path d="M-7 -9 H7 M-7 -2 H7 M-7 8 L-4 11 L2 4 M6 9 H8" />
    </>
  ),
  'station-wiki': (
    <path d="M0 -10 C-6 -15 -13 -15 -18 -13 V13 C-13 11 -6 11 0 15 C6 11 13 11 18 13 V-13 C13 -15 6 -15 0 -10 Z M0 -10 V15" />
  ),
  'mission-dashboard': (
    <>
      <path d="M-16 8 A16 16 0 0 1 16 8 M-11 -3 L-8 -1 M0 -8 V-5 M11 -3 L8 -1 M0 8 L7 -3" />
      <circle cx="0" cy="8" r="2.5" fill="currentColor" stroke="none" />
    </>
  ),
  'settings-and-themes': (
    <>
      <path d="M-17 -9 H17 M-17 0 H17 M-17 9 H17" />
      <circle cx="-7" cy="-9" r="3.5" fill="var(--surface)" />
      <circle cx="8" cy="0" r="3.5" fill="var(--surface)" />
      <circle cx="-2" cy="9" r="3.5" fill="var(--surface)" />
    </>
  ),
  'starship-tracker': (
    <>
      <circle cx="0" cy="0" r="16" />
      <circle cx="0" cy="0" r="8" />
      <path d="M0 0 L11.3 -11.3" />
      <circle cx="-6" cy="6" r="2.5" fill="currentColor" stroke="none" />
    </>
  ),
  'tidy-code': <path d="M-10 -15 H-17 V15 H-10 M10 -15 H17 V15 H10 M-8 -6 H8 M-8 1 H4 M-8 8 H8" />,
};

export function partGlyph(partKey: string): ReactNode {
  return PART_GLYPHS[partKey] ?? FALLBACK_GLYPH;
}
