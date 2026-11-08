import { useId } from 'react';
import { CROWNS, VELVET, VIOLET, type CrownShape } from './crowns';
import { metalGradient } from './metalGradient';

// Drawn in a 32x32 box, every crown standing on the same band from y 22.6 to 27.6
const BASE = 23.5;

// The brand star from public/favicon.svg, shrunk onto the top crown
const STAR = [
  [32, 4],
  [39, 24],
  [60, 24],
  [43, 37],
  [49, 58],
  [32, 46],
  [15, 58],
  [21, 37],
  [4, 24],
  [25, 24],
]
  .map(([x, y]) => `${(16 + (x - 32) * 0.155).toFixed(2)},${(5.4 + (y - 32) * 0.155).toFixed(2)}`)
  .join(' ');

// Twelve gold rays round the top crown, every other one shorter
const RAYS = Array.from({ length: 12 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
  const outer = i % 2 ? 14.2 : 15.8;
  const at = (r: number) =>
    `${(16 + r * Math.cos(a)).toFixed(2)} ${(16 + r * Math.sin(a)).toFixed(2)}`;
  return `M${at(11.5)} L${at(outer)}`;
}).join(' ');

function spread(n: number, from: number, to: number) {
  return Array.from({ length: n }, (_, i) => from + ((to - from) * i) / (n - 1));
}

const SHAPES: Record<CrownShape, { xs: number[]; tops: number[]; valley: number }> = {
  low: { xs: spread(3, 4.5, 27.5), tops: [15, 13, 15], valley: 19.5 },
  open: { xs: spread(5, 4, 28), tops: [11.5, 10, 8.5, 10, 11.5], valley: 17 },
  spire: { xs: spread(5, 4, 28), tops: [11.5, 10, 6.5, 10, 11.5], valley: 17 },
  closed: { xs: spread(5, 4.5, 27.5), tops: [17, 16, 15, 16, 17], valley: 20 },
};

// A row of points as one outline from the band's left edge to its right
function points(xs: number[], tops: number[], valley: number) {
  const path = xs
    .map((x, i) => (i > 0 ? `L${(x + xs[i - 1]) / 2} ${valley} ` : '') + `L${x} ${tops[i]}`)
    .join(' ');
  return `M5 ${BASE} ${path} L27 ${BASE} Z`;
}

// A cut stone standing on (x, y), r its half height
function gem(x: number, y: number, r: number) {
  return `M${x} ${y - r} L${x + r * 0.75} ${y} L${x} ${y + r} L${x - r * 0.75} ${y} Z`;
}

// A crown for places 1 to CROWNS.length, each the one below it with one more thing, and a little bigger
export function RankCrown({ rank }: { rank: number }) {
  // useId's separators (colons in older React) don't belong in url(#...)
  const id = `crown${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const place = Math.min(Math.max(rank, 1), CROWNS.length);
  const crown = CROWNS[place - 1];
  const { metal, shape } = crown;
  const { xs, tops, valley } = SHAPES[shape];
  const size = Math.round(28 + ((CROWNS.length - place) * 6) / (CROWNS.length - 1));
  const [M, V] = [`url(#${id}m)`, `url(#${id}v)`];
  const auraTone = crown.aura === 'gold' ? '#f2c23a' : VIOLET.mid;
  // The spire's middle point wears its big stone instead of a ball
  const tipped = xs
    .map((x, i) => ({ x, y: tops[i] }))
    .filter((_, i) => shape !== 'spire' || i !== 2);

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" data-crown={place}>
      <defs>
        {metalGradient(`${id}m`, metal)}
        {metalGradient(`${id}v`, VIOLET)}
        {metalGradient(`${id}k`, VELVET)}
        <radialGradient id={`${id}h`}>
          <stop offset="0.35" stopColor={auraTone} stopOpacity="0.75" />
          <stop offset="1" stopColor={auraTone} stopOpacity="0" />
        </radialGradient>
      </defs>

      {crown.aura && <circle cx="16" cy="16" r="16" fill={`url(#${id}h)`} />}
      {crown.aura === 'stars' && (
        <path d={RAYS} stroke={M} strokeWidth="1.5" strokeLinecap="round" />
      )}

      {shape === 'closed' && (
        <>
          <path
            d="M5.5 22.8 Q5.5 8 16 8 Q26.5 8 26.5 22.8 Z"
            fill={`url(#${id}k)`}
            stroke={VELVET.dark}
            strokeWidth="0.8"
          />
          <path d="M16 8.6 V19" stroke={M} strokeWidth="2.6" strokeLinecap="round" />
          <path
            d="M5.9 22.8 Q5.9 8.7 16 8.6 Q26.1 8.7 26.1 22.8"
            fill="none"
            stroke={M}
            strokeWidth="2.2"
          />
        </>
      )}

      <path
        d={points(xs, tops, valley)}
        fill={M}
        stroke={metal.dark}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {shape === 'spire' && (
        <path
          d={gem(16, 5.2, 3.6)}
          fill={V}
          stroke={VIOLET.dark}
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
      )}
      {crown.violetTips &&
        tipped.map(({ x, y }) => (
          <circle
            key={x}
            cx={x}
            cy={y}
            r={shape === 'closed' ? 1.9 : 2.4}
            fill={V}
            stroke={VIOLET.dark}
            strokeWidth="0.6"
          />
        ))}

      <rect
        x="4.5"
        y="22.6"
        width="23"
        height="5"
        rx="1.5"
        fill={crown.violetBand ? VIOLET.mid : M}
        stroke={metal.dark}
        strokeWidth="1"
      />

      {crown.ermine && (
        <>
          <rect
            x="5"
            y="27.4"
            width="22"
            height="3.8"
            rx="1.6"
            fill="#ffffff"
            stroke="#8d88a6"
            strokeWidth="0.6"
          />
          <path
            d={[10, 16, 22].map((x) => `M${x} 28.2 L${x - 0.9} 30.3 L${x + 0.9} 30.3 Z`).join(' ')}
            fill="#14121f"
          />
        </>
      )}

      {crown.crest === 'orb' && (
        <circle cx="16" cy="5.6" r="3" fill={M} stroke={metal.dark} strokeWidth="0.9" />
      )}
      {crown.crest === 'star' && (
        <polygon
          points={STAR}
          fill={M}
          stroke={metal.dark}
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
