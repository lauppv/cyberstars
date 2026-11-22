import { useId } from 'react';
import { CROWNS, VIOLET, type CrownShape } from './crowns';
import { metalGradient } from './metalGradient';

// Drawn in a 32x32 box, every crown standing on the same band from y 23 to 28.2
const BASE = 23;

// The orb and the sceptre stand outside that box, so a crown with them gets a wider one
const REGALIA_BOX = { x: -8, width: 46 };

// The brand star from public/favicon.svg, set into the top crown's middle stone
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
  .map(([x, y]) => `${(16 + (x - 32) * 0.15).toFixed(2)},${(5.1 + (y - 32) * 0.15).toFixed(2)}`)
  .join(' ');

// Twelve gold rays round the top crown, every other one shorter, all inside the box
const RAYS = Array.from({ length: 12 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
  const outer = i % 2 ? 13.4 : 15.0;
  const at = (r: number) =>
    `${(16 + r * Math.cos(a)).toFixed(2)} ${(16 + r * Math.sin(a)).toFixed(2)}`;
  return `M${at(11.2)} L${at(outer)}`;
}).join(' ');

function spread(n: number, from: number, to: number) {
  return Array.from({ length: n }, (_, i) => from + ((to - from) * i) / (n - 1));
}

// `spire` is the index of the middle point that wears the big stone instead of a ball
const SHAPES: Record<
  CrownShape,
  { xs: number[]; tops: number[]; valley: number; smooth: boolean; spire?: number }
> = {
  circlet: { xs: [7.5, 16, 24.5], tops: [15.5, 13, 15.5], valley: 19.5, smooth: true },
  arc: {
    xs: spread(5, 4.5, 27.5),
    tops: [12.5, 10, 8.5, 10, 12.5],
    valley: 17,
    smooth: true,
  },
  spire: {
    xs: spread(5, 4.5, 27.5),
    tops: [12.5, 10, 5.5, 10, 12.5],
    valley: 17,
    smooth: true,
    spire: 2,
  },
  royal: {
    xs: spread(7, 4, 28),
    tops: [13.5, 11, 9, 6.5, 9, 11, 13.5],
    valley: 18,
    smooth: false,
    spire: 3,
  },
};

// A row of points as one outline from the band's left edge to its right edge. Smooth shapes
// dip between points in a curve, sharp ones in a straight valley.
function outline(xs: number[], tops: number[], valley: number, smooth: boolean) {
  let d = `M4 ${BASE}`;
  for (let i = 0; i < xs.length; i++) {
    if (i === 0) d += ` L${xs[i]} ${tops[i]}`;
    else {
      const mid = ((xs[i - 1] + xs[i]) / 2).toFixed(2);
      d += smooth
        ? ` Q${mid} ${valley} ${xs[i]} ${tops[i]}`
        : ` L${mid} ${valley} L${xs[i]} ${tops[i]}`;
    }
  }
  return `${d} L28 ${BASE} Z`;
}

// A cut stone standing on (x, y), r its half height
function gem(x: number, y: number, r: number) {
  return `M${x} ${y - r} L${(x + r * 0.72).toFixed(2)} ${y} L${x} ${y + r} L${(x - r * 0.72).toFixed(2)} ${y} Z`;
}

// The orb with its cross on the left of the crown, the sceptre with its violet stone on the right
function Regalia({ metal, stone, edge }: { metal: string; stone: string; edge: string }) {
  const [ox, oy, r] = [-3.6, 25.8, 4];
  const sx = 35;
  return (
    <g data-regalia="">
      <path
        d={`M${ox} ${oy - r - 3.6} V${oy - r + 0.4} M${ox - 1.5} ${oy - r - 2.2} H${ox + 1.5}`}
        stroke={metal}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx={ox} cy={oy} r={r} fill={metal} stroke={edge} strokeWidth="0.9" />
      <path
        d={`M${ox - r} ${oy} H${ox + r} M${ox} ${oy - r} V${oy + r}`}
        stroke={edge}
        strokeWidth="0.8"
      />
      <circle cx={ox} cy={oy} r="1.3" fill={stone} stroke={VIOLET.dark} strokeWidth="0.4" />

      <rect
        x={sx - 0.95}
        y="9.2"
        width="1.9"
        height="21.6"
        rx="0.9"
        fill={metal}
        stroke={edge}
        strokeWidth="0.6"
      />
      <path
        d={`M${sx - 2.4} 10 H${sx + 2.4}`}
        stroke={metal}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx={sx} cy="30.9" r="1.3" fill={metal} stroke={edge} strokeWidth="0.5" />
      <circle cx={sx} cy="6.4" r="2.6" fill={stone} stroke={VIOLET.dark} strokeWidth="0.6" />
      <path
        d={`M${sx} 1.2 V3.4 M${sx - 1.1} 2.2 H${sx + 1.1}`}
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
  const { xs, tops, valley, smooth, spire } = SHAPES[shape];
  const size = Math.round(28 + ((CROWNS.length - place) * 6) / (CROWNS.length - 1));
  const box = crown.regalia ? REGALIA_BOX : { x: 0, width: 32 };
  const [M, V] = [`url(#${id}m)`, `url(#${id}v)`];
  const gemR = shape === 'royal' ? 3 : 3.5;
  const gemAt = spire !== undefined ? { x: xs[spire], y: tops[spire] - 1.4 } : null;

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
          <stop offset="0.35" stopColor={VIOLET.mid} stopOpacity="0.75" />
          <stop offset="1" stopColor={VIOLET.mid} stopOpacity="0" />
        </radialGradient>
      </defs>

      {crown.coronation && <circle cx="16" cy="16" r="15.5" fill={`url(#${id}h)`} />}
      {crown.coronation && <path d={RAYS} stroke={M} strokeWidth="1.4" strokeLinecap="round" />}

      {crown.regalia && <Regalia metal={M} stone={V} edge={metal.dark} />}

      <path
        d={outline(xs, tops, valley, smooth)}
        fill={M}
        stroke={metal.dark}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      <rect
        x="4"
        y="23"
        width="24"
        height="5.2"
        rx="1.8"
        fill={crown.violetBand ? V : M}
        stroke={metal.dark}
        strokeWidth="1"
      />

      {/* The middle spire wears its big violet stone */}
      {gemAt && (
        <g>
          <path
            d={gem(gemAt.x, gemAt.y, gemR)}
            fill={V}
            stroke={VIOLET.dark}
            strokeWidth="0.7"
            strokeLinejoin="round"
          />
          <path
            d={`M${gemAt.x} ${gemAt.y - gemR} V${gemAt.y + gemR}`}
            stroke={VIOLET.light}
            strokeWidth="0.5"
            opacity="0.9"
          />
        </g>
      )}
      {xs.map((x, i) =>
        i === spire ? null : (
          <circle
            key={x}
            cx={x}
            cy={tops[i]}
            r="2.1"
            fill={crown.violetTips ? V : M}
            stroke={crown.violetTips ? VIOLET.dark : metal.dark}
            strokeWidth="0.6"
          />
        ),
      )}

      {/* Place 1 sets the brand star into the middle stone */}
      {crown.coronation && (
        <polygon
          points={STAR}
          fill={M}
          stroke={metal.dark}
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
