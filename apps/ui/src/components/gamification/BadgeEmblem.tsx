import { useId, type ReactNode } from 'react';
import { baseLanguage } from '@cyberstars/shared/constants';

// Frame metal per badge level: 0 First Steps, then Bronze, Silver, Gold, Platinum, Diamond, Legend
const TIERS = [
  { dark: '#4a3db8', mid: '#6c5ce7', light: '#b7aefc' },
  { dark: '#6e4322', mid: '#c27c45', light: '#f2c194' },
  { dark: '#6b717c', mid: '#c3c8d0', light: '#ffffff' },
  { dark: '#8f6410', mid: '#e8b23a', light: '#fff0b3' },
  { dark: '#4f7d8c', mid: '#9fd0dc', light: '#effcff' },
  { dark: '#1d6fa8', mid: '#45b8ee', light: '#c9f2ff' },
  { dark: '#8a1f5c', mid: '#e0468f', light: '#ffc2e0' },
];

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

function hexPoints(r: number): string {
  return [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
    })
    .join(' ');
}

const OUTER = hexPoints(47);
const INNER = hexPoints(40);

interface BadgeEmblemProps {
  courseKey: string;
  level: number;
  size?: number;
}

// Algorithm courses (algo-*) reuse their base course's symbol plus a flowchart decision pip
export function BadgeEmblem({ courseKey, level, size = 56 }: BadgeEmblemProps) {
  // useId's separators (colons in older React) don't belong in url(#...)
  const gradientId = `badge${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const tier = TIERS[Math.min(level, TIERS.length - 1)];
  const algo = courseKey.startsWith('algo-');
  const glyph = GLYPHS[baseLanguage(courseKey)] ?? FALLBACK_GLYPH;
  const metal = `url(#${gradientId})`;

  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tier.light} />
          <stop offset="0.45" stopColor={tier.mid} />
          <stop offset="1" stopColor={tier.dark} />
        </linearGradient>
      </defs>
      <polygon points={OUTER} fill={metal} />
      <polygon points={INNER} fill="var(--surface)" />
      <polygon points={INNER} fill={tier.mid} opacity="0.08" />
      <g
        transform={algo ? 'translate(-3 -3)' : undefined}
        color={tier.light}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {glyph}
      </g>
      {algo && (
        <>
          <circle cx="31" cy="31" r="15" fill="var(--bg)" />
          <circle cx="31" cy="31" r="12.5" fill={metal} />
          <path
            d="M31 24 L38 31 L31 38 L24 31 Z"
            fill="none"
            stroke="var(--bg)"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
