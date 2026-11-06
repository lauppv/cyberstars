import { useId } from 'react';
import { courseGlyph } from './courseGlyphs';
import { TIERS } from './badgeMeta';

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
  const glyph = courseGlyph(courseKey);
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
