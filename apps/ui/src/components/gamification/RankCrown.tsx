import { useId, type ReactNode } from 'react';
import { CROWNS, type CrownDesign, type Tone } from './crowns';
import { metalGradient } from './metalGradient';

// What a design paints with: its own tones and the gradients made of them
interface Paint {
  tone: Tone;
  band: Tone;
  body: string;
  gold: string;
  glow: string;
}

// Drawn in a 32x32 box, most of them standing on a band from y 22.8 to 27.2
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
  .map(([x, y]) => `${(16 + (x - 32) * 0.13).toFixed(2)},${(5 + (y - 32) * 0.13).toFixed(2)}`)
  .join(' ');

const STARDUST = [
  [10.5, 18.5, 0.55],
  [13.5, 13.8, 0.45],
  [19.5, 17.5, 0.55],
  [21.8, 14, 0.4],
  [16.5, 20.5, 0.4],
  [8, 15.5, 0.35],
];

function gem(x: number, y: number, r: number) {
  return `M${x} ${y - r} L${x + r * 0.8} ${y} L${x} ${y + r} L${x - r * 0.8} ${y} Z`;
}

function sparkle(x: number, y: number, r: number) {
  return `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`;
}

// A row of points, the middle one highest, as one outline from the band's left edge to its right
function points(xs: number[], tops: number[], valley: number) {
  const path = xs
    .map((x, i) => (i > 0 ? `L${(x + xs[i - 1]) / 2} ${valley} ` : '') + `L${x} ${tops[i]}`)
    .join(' ');
  return `M5.5 ${BASE} ${path} L26.5 ${BASE} Z`;
}

function spread(n: number, from: number, to: number) {
  return Array.from({ length: n }, (_, i) => from + ((to - from) * i) / (n - 1));
}

function band(p: Paint, fill: string, decor?: ReactNode) {
  return (
    <>
      <rect
        x="5"
        y="22.8"
        width="22"
        height="4.4"
        rx="1.4"
        fill={fill}
        stroke={p.band.dark}
        strokeWidth="0.9"
      />
      {decor}
    </>
  );
}

function shine(x: number, top: number, tone: Tone) {
  return (
    <path
      d={`M${x + 1.6} 21.8 L${x + 0.9} ${top + 3.5}`}
      stroke={tone.light}
      strokeWidth="0.9"
      strokeLinecap="round"
      opacity="0.75"
    />
  );
}

// A gold band's jewel in the crown's own stone, with two small ones beside it
function jewels(p: Paint) {
  return (
    <>
      <ellipse
        cx="16"
        cy="25"
        rx="2.3"
        ry="1.6"
        fill={p.body}
        stroke={p.tone.dark}
        strokeWidth="0.6"
      />
      <circle cx="15.3" cy="24.5" r="0.45" fill="#fff" />
      <circle cx="9" cy="25" r="0.7" fill={p.tone.light} />
      <circle cx="23" cy="25" r="0.7" fill={p.tone.light} />
    </>
  );
}

// A fleur-de-lis standing on (x, t), s its scale
function fleur(x: number, t: number, s: number) {
  const X = (dx: number) => x + dx * s;
  const Y = (dy: number) => t + dy * s;
  return [
    `M${x} ${t} C${X(2)} ${Y(3)} ${X(2)} ${Y(6)} ${x} ${Y(8)} C${X(-2)} ${Y(6)} ${X(-2)} ${Y(3)} ${x} ${t} Z`,
    `M${X(-0.5)} ${Y(7.5)} C${X(-4)} ${Y(7)} ${X(-5)} ${Y(3.5)} ${X(-3)} ${Y(2.5)} C${X(-3.4)} ${Y(4.5)} ${X(-2.2)} ${Y(6.2)} ${X(-0.5)} ${Y(7.5)} Z`,
    `M${X(0.5)} ${Y(7.5)} C${X(4)} ${Y(7)} ${X(5)} ${Y(3.5)} ${X(3)} ${Y(2.5)} C${X(3.4)} ${Y(4.5)} ${X(2.2)} ${Y(6.2)} ${X(0.5)} ${Y(7.5)} Z`,
    `M${X(-2.6)} ${Y(7.6)} H${X(2.6)} V${Y(8.9)} H${X(-2.6)} Z`,
    `M${X(-0.7)} ${Y(8.9)} H${X(0.7)} V18 H${X(-0.7)} Z`,
  ].join(' ');
}

const DESIGNS: Record<CrownDesign, (p: Paint) => ReactNode> = {
  // Ten: three plain points carved from wood
  wood: (p) => (
    <>
      <path
        d="M5.5 23.5 L4.5 11 L10 16 L16 9 L22 16 L27.5 11 L26.5 23.5 Z"
        fill={p.body}
        stroke={p.tone.dark}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 22.5 Q11 18 9 13 M16 22.5 Q17.4 16.5 16 11 M22.5 22.5 Q21 18 23 13"
        fill="none"
        stroke={p.tone.dark}
        strokeWidth="0.7"
        opacity="0.9"
      />
      {band(p, p.body)}
    </>
  ),

  // Nine: two branches of leaves rising from a gold tie, open at the top
  laurel: (p) => {
    const at = (angle: number, r: number) => {
      const a = (angle * Math.PI) / 180;
      return { x: 16 + r * Math.cos(a), y: 16 + r * Math.sin(a) };
    };
    const leaves: { x: number; y: number; rot: number }[] = [];
    for (const side of [-1, 1]) {
      for (let k = 0; k < 5; k++) {
        const angle = side < 0 ? 118 + k * 25 : 62 - k * 25;
        for (const o of [-1, 1]) {
          leaves.push({ ...at(angle, 9 + o * 1.5), rot: angle - side * 90 + o * side * 30 });
        }
      }
      const tip = side < 0 ? 232 : -52;
      leaves.push({ ...at(tip, 9), rot: tip - side * 90 });
    }
    const [a, b, c, d] = [at(112, 9), at(228, 9), at(68, 9), at(-48, 9)];
    return (
      <>
        <path
          d={`M${a.x} ${a.y} A9 9 0 0 1 ${b.x} ${b.y} M${c.x} ${c.y} A9 9 0 0 0 ${d.x} ${d.y}`}
          fill="none"
          stroke={p.tone.dark}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        {leaves.map(({ x, y, rot }) => (
          <ellipse
            key={`${x.toFixed(2)},${y.toFixed(2)}`}
            cx={x}
            cy={y}
            rx="2.5"
            ry="1.05"
            transform={`rotate(${rot} ${x} ${y})`}
            fill={p.body}
            stroke={p.tone.dark}
            strokeWidth="0.4"
          />
        ))}
        <path d="M15.2 25.6 L13.4 29.4 L15 28.8 Z M16.8 25.6 L18.6 29.4 L17 28.8 Z" fill={p.gold} />
        <circle cx="16" cy="25.4" r="1.4" fill={p.gold} stroke={p.band.dark} strokeWidth="0.5" />
      </>
    );
  },

  // Eight: an iron wall with battlements, like a tower's top
  mural: (p) => (
    <>
      <path
        d="M5 23.5 V10 H8.2 V13 H9.7 V10 H12.9 V13 H14.4 V10 H17.6 V13 H19.1 V10 H22.3 V13 H23.8 V10 H27 V23.5 Z"
        fill={p.body}
        stroke={p.tone.dark}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path
        d="M5 17.5 H27 M10.5 13 V17.5 M21.5 13 V17.5 M8 17.5 V22.8 M16 17.5 V22.8 M24 17.5 V22.8"
        stroke={p.tone.dark}
        strokeWidth="0.6"
        opacity="0.8"
      />
      {band(
        p,
        p.body,
        [8, 12.7, 19.3, 24].map((x) => (
          <circle key={x} cx={x} cy="25" r="0.6" fill={p.tone.dark} />
        )),
      )}
    </>
  ),

  // Seven: five points, each ending in a ball
  balls: (p) => {
    const xs = spread(5, 4.5, 27.5);
    const tops = [10.5, 9, 7.5, 9, 10.5];
    return (
      <>
        <path
          d={points(xs, tops, 15)}
          fill={p.body}
          stroke={p.tone.dark}
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        {shine(xs[0], tops[0], p.tone)}
        {xs.map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={tops[i]}
            r="1.5"
            fill={p.body}
            stroke={p.tone.dark}
            strokeWidth="0.8"
          />
        ))}
        {band(
          p,
          p.body,
          [9, 16, 23].map((x, i) => (
            <circle key={x} cx={x} cy="25" r={i === 1 ? 1.1 : 0.8} fill={p.tone.light} />
          )),
        )}
      </>
    );
  },

  // Six: nine thin rays, the long ones tipped with pearls
  radiant: (p) => {
    const xs = spread(9, 5, 27);
    const tops = xs.map((_, i) =>
      i % 2 ? 11 + Math.abs(i - 4) * 0.4 : 6.5 + Math.abs(i - 4) * 0.6,
    );
    return (
      <>
        <path
          d={points(xs, tops, 16.5)}
          fill={p.body}
          stroke={p.tone.dark}
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        {shine(xs[0], tops[0], p.tone)}
        {xs.map((x, i) =>
          i % 2 ? null : (
            <circle
              key={x}
              cx={x}
              cy={tops[i]}
              r="0.9"
              fill="#fff"
              stroke={p.tone.dark}
              strokeWidth="0.4"
            />
          ),
        )}
        {band(
          p,
          p.body,
          [9, 16, 23].map((x, i) => (
            <circle key={x} cx={x} cy="25" r={i === 1 ? 1.1 : 0.8} fill={p.tone.light} />
          )),
        )}
      </>
    );
  },

  // Five: gold arches over a velvet cap, an orb and a cross on top
  imperial: (p) => (
    <>
      <path
        d="M6.5 22.8 Q6.5 10.5 16 10.5 Q25.5 10.5 25.5 22.8 Z"
        fill="#7a1838"
        stroke="#4a0d22"
        strokeWidth="0.6"
      />
      <path
        d="M10 23 L11.5 19 L13 23 Z M19 23 L20.5 19 L22 23 Z"
        fill={p.body}
        stroke={p.tone.dark}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 22.8 Q6.5 10.5 16 10.5 Q25.5 10.5 25.5 22.8 M16 10.5 V22.8"
        fill="none"
        stroke={p.tone.mid}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {[
        [8, 16],
        [10.8, 12.3],
        [21.2, 12.3],
        [24, 16],
        [16, 15],
        [16, 19],
      ].map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r="0.65" fill="#fff" opacity="0.9" />
      ))}
      <circle cx="16" cy="7.4" r="2.3" fill={p.body} stroke={p.tone.dark} strokeWidth="0.7" />
      <path
        d="M16 1.8 V5 M14.7 3.2 H17.3"
        stroke={p.tone.mid}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {band(
        p,
        p.body,
        ['#3a67d8', '#d22d4c', '#3a67d8'].map((color, i) => (
          <circle
            key={i}
            cx={[9, 16, 23][i]}
            cy="25"
            r={i === 1 ? 1.1 : 0.85}
            fill={color}
            stroke={p.tone.dark}
            strokeWidth="0.4"
          />
        )),
      )}
    </>
  ),

  // Four: five rounded petals of jade, a lotus on a gold band
  petals: (p) => {
    const xs = spread(5, 6.2, 25.8);
    const tops = [12, 9.5, 7, 9.5, 12];
    return (
      <>
        {[0, 4, 1, 3, 2].map((i) => {
          const [x, t] = [xs[i], tops[i]];
          return (
            <g key={i}>
              <path
                d={`M${x - 3} 23 Q${x - 3.6} ${t + 5} ${x} ${t} Q${x + 3.6} ${t + 5} ${x + 3} 23 Z`}
                fill={p.body}
                stroke={p.tone.dark}
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              <path
                d={`M${x} ${t + 2.5} V21`}
                stroke={p.tone.light}
                strokeWidth="0.6"
                opacity="0.6"
              />
              <circle cx={x} cy={t + 1.6} r="0.6" fill="#fff" opacity="0.85" />
            </g>
          );
        })}
        {band(p, p.gold, jewels(p))}
      </>
    );
  },

  // Three: a sapphire tiara, three gold-edged arches round a teardrop stone, pearls on top
  tiara: (p) => (
    <>
      <path
        d="M4 23 Q4.5 17.5 8.5 17.2 Q10.5 12 13.6 12.6 Q14.6 6.5 16 5.2 Q17.4 6.5 18.4 12.6 Q21.5 12 23.5 17.2 Q27.5 17.5 28 23 Z"
        fill={p.body}
        stroke={p.band.mid}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 21.5 Q9.5 18.5 12 18 Q14.5 17.2 16 14 Q17.5 17.2 20 18 Q22.5 18.5 24.5 21.5"
        fill="none"
        stroke={p.band.mid}
        strokeWidth="0.6"
        opacity="0.8"
      />
      <path
        d="M16 9.5 Q18.3 12.8 16 15.4 Q13.7 12.8 16 9.5 Z"
        fill={p.tone.light}
        stroke={p.tone.dark}
        strokeWidth="0.5"
      />
      <circle cx="15.4" cy="12.6" r="0.5" fill="#fff" />
      {[
        [8.5, 17.2],
        [13.6, 12.6],
        [18.4, 12.6],
        [23.5, 17.2],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="1" fill="#fff" stroke={p.band.dark} strokeWidth="0.4" />
      ))}
      <circle cx="16" cy="5.2" r="1.2" fill="#fff" stroke={p.band.dark} strokeWidth="0.4" />
      <circle cx="10.5" cy="20.2" r="0.8" fill={p.tone.light} />
      <circle cx="21.5" cy="20.2" r="0.8" fill={p.tone.light} />
      {band(p, p.gold, jewels(p))}
    </>
  ),

  // Two: a ruby crown under three gold fleurs-de-lis
  fleur: (p) => (
    <>
      <path
        d="M5 23.5 L5 17 Q16 13.5 27 17 L27 23.5 Z"
        fill={p.body}
        stroke={p.tone.dark}
        strokeWidth="0.9"
      />
      <path
        d={`${fleur(16, 4.2, 1)} ${fleur(8.5, 8.8, 0.8)} ${fleur(23.5, 8.8, 0.8)}`}
        fill={p.gold}
        stroke={p.band.dark}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path
        d={`${gem(12.25, 15, 1.3)} ${gem(19.75, 15, 1.3)}`}
        fill={p.tone.light}
        stroke={p.tone.dark}
        strokeWidth="0.5"
      />
      {shine(5, 17, p.tone)}
      {band(p, p.gold, jewels(p))}
    </>
  ),

  // One: seven points tipped with sparkles, stardust, a glow and the brand star on top
  stars: (p) => {
    const xs = spread(7, 4.5, 27.5);
    const tops = xs.map((_, i) => 7.5 + Math.abs(i - 3) * 1.1);
    return (
      <>
        <circle cx="16" cy="15" r="16" fill={p.glow} />
        <path
          d={points(xs, tops, 14)}
          fill={p.body}
          stroke={p.tone.dark}
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        {STARDUST.map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} fill="#fff" opacity="0.9" />
        ))}
        {shine(xs[0], tops[0], p.tone)}
        <path
          d={xs
            .filter((_, i) => i !== 3)
            .map((x, i) => sparkle(x, tops[i < 3 ? i : i + 1], 1.9))
            .join(' ')}
          fill={p.gold}
        />
        <polygon
          points={STAR}
          fill={p.gold}
          stroke={p.band.dark}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        {band(p, p.gold, jewels(p))}
      </>
    );
  },
};

// A crown for places 1 to CROWNS.length, each its own shape, grander and a little bigger the higher the place
export function RankCrown({ rank }: { rank: number }) {
  // useId's separators (colons in older React) don't belong in url(#...)
  const id = `crown${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const place = Math.min(Math.max(rank, 1), CROWNS.length);
  const { design, tone, band: bandTone } = CROWNS[place - 1];
  const size = Math.round(24 + ((CROWNS.length - place) * 6) / (CROWNS.length - 1));
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" data-crown={design}>
      <defs>
        {metalGradient(`${id}b`, tone)}
        {metalGradient(`${id}g`, bandTone ?? tone)}
        <radialGradient id={`${id}h`}>
          <stop offset="0" stopColor={tone.mid} stopOpacity="0.55" />
          <stop offset="1" stopColor={tone.mid} stopOpacity="0" />
        </radialGradient>
      </defs>
      {DESIGNS[design]({
        tone,
        band: bandTone ?? tone,
        body: `url(#${id}b)`,
        gold: `url(#${id}g)`,
        glow: `url(#${id}h)`,
      })}
    </svg>
  );
}
