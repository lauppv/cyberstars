import { useId } from 'react';
import { CROWNS, VIOLET, type CrownShape } from './crowns';
import { metalGradient } from './metalGradient';

// Drawn in a 32x32 box, every crown standing on the same band from y 22.6 to 27.6
const BASE = 23.5;

// The orb and the sceptre stand outside that box, so a crown with them gets a wider one
const REGALIA_BOX = { x: -8, width: 46 };

// The brand star from public/favicon.svg, shrunk onto the top crown's middle spike
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
  .map(([x, y]) => `${(16 + (x - 32) * 0.155).toFixed(2)},${(4.6 + (y - 32) * 0.155).toFixed(2)}`)
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

// `spire` is the point that wears the big stone instead of a ball
const SHAPES: Record<
  CrownShape,
  { xs: number[]; tops: number[]; valley: number; spire?: number; tip: number }
> = {
  low: { xs: spread(3, 4.5, 27.5), tops: [15, 13, 15], valley: 19.5, tip: 2.4 },
  open: { xs: spread(5, 4, 28), tops: [11.5, 10, 8.5, 10, 11.5], valley: 17, tip: 2.4 },
  spire: { xs: spread(5, 4, 28), tops: [11.5, 10, 6.5, 10, 11.5], valley: 17, spire: 2, tip: 2.4 },
  spiky: {
    xs: spread(7, 4, 28),
    tops: [12.5, 10, 8.5, 6.5, 8.5, 10, 12.5],
    valley: 18.5,
    spire: 3,
    tip: 1.75,
  },
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

// The orb with its cross on the left of the crown, the sceptre with its violet stone on the right
function Regalia({ metal, stone, edge }: { metal: string; stone: string; edge: string }) {
  const [ox, oy, r] = [-3.4, 25.4, 4.3];
  const sx = 35.2;
  return (
    <g data-regalia="">
      <path
        d={`M${ox} ${oy - r - 3.8} V${oy - r + 0.2} M${ox - 1.5} ${oy - r - 2.4} H${ox + 1.5}`}
        stroke={metal}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx={ox} cy={oy} r={r} fill={metal} stroke={edge} strokeWidth="0.9" />
      <path
        d={`M${ox - r} ${oy} H${ox + r} M${ox} ${oy - r} V${oy}`}
        stroke={edge}
        strokeWidth="0.8"
      />
      <circle cx={ox} cy={oy} r="1.3" fill={stone} stroke={VIOLET.dark} strokeWidth="0.4" />

      <rect
        x={sx - 0.95}
        y="8.6"
        width="1.9"
        height="22"
        rx="0.9"
        fill={metal}
        stroke={edge}
        strokeWidth="0.6"
      />
      <path
        d={`M${sx - 2.4} 9.4 H${sx + 2.4}`}
        stroke={metal}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx={sx} cy="31" r="1.3" fill={metal} stroke={edge} strokeWidth="0.5" />
      <circle cx={sx} cy="5.9" r="2.7" fill={stone} stroke={VIOLET.dark} strokeWidth="0.6" />
      <path
        d={`M${sx} 0.4 V2.9 M${sx - 1.1} 1.5 H${sx + 1.1}`}
        stroke={metal}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </g>
  );
}

// A crown for places 1 to CROWNS.length, each the one below it with one more thing, and a little bigger
export function RankCrown({ rank }: { rank: number }) {
  // useId's separators (colons in older React) don't belong in url(#...)
  const id = `crown${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const place = Math.min(Math.max(rank, 1), CROWNS.length);
  const crown = CROWNS[place - 1];
  const { metal, shape } = crown;
  const { xs, tops, valley, spire, tip } = SHAPES[shape];
  const size = Math.round(28 + ((CROWNS.length - place) * 6) / (CROWNS.length - 1));
  const box = crown.regalia ? REGALIA_BOX : { x: 0, width: 32 };
  const [M, V] = [`url(#${id}m)`, `url(#${id}v)`];
  const auraTone = crown.aura === 'gold' ? '#f2c23a' : VIOLET.mid;

  return (
    <svg
      width={Math.round((size * box.width) / 32)}
      height={size}
      viewBox={`${box.x} 0 ${box.width} 32`}
      aria-hidden="true"
      data-crown={place}
    >
      <defs>
        {metalGradient(`${id}m`, metal)}
        {metalGradient(`${id}v`, VIOLET)}
        <radialGradient id={`${id}h`}>
          <stop offset="0.35" stopColor={auraTone} stopOpacity="0.75" />
          <stop offset="1" stopColor={auraTone} stopOpacity="0" />
        </radialGradient>
      </defs>

      {crown.aura && <circle cx="16" cy="16" r="16" fill={`url(#${id}h)`} />}
      {crown.aura === 'stars' && (
        <path d={RAYS} stroke={M} strokeWidth="1.5" strokeLinecap="round" />
      )}

      {crown.regalia && <Regalia metal={M} stone={V} edge={metal.dark} />}

      <path
        d={points(xs, tops, valley)}
        fill={M}
        stroke={metal.dark}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* The middle spire wears its big stone, or the brand star on the top crown */}
      {spire !== undefined && crown.crest !== 'star' && (
        <path
          d={gem(16, tops[spire] - 1.6, shape === 'spiky' ? 3.1 : 3.6)}
          fill={V}
          stroke={VIOLET.dark}
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
      )}
      {crown.violetTips &&
        xs.map((x, i) =>
          i === spire ? null : (
            <circle
              key={x}
              cx={x}
              cy={tops[i]}
              r={tip}
              fill={V}
              stroke={VIOLET.dark}
              strokeWidth="0.6"
            />
          ),
        )}

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
      {shape === 'spiky' && (
        <path
          d={[8.5, 16, 23.5].map((x) => gem(x, 25.1, 1.5)).join(' ')}
          fill={M}
          stroke={metal.dark}
          strokeWidth="0.4"
        />
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
