import { useId, type ReactNode } from 'react';
import { CROWNS, type CrownKind, type CrownStyle, type Tone } from './crowns';

// Drawn in a 32x32 box: points rise from the band's top edge
const BASE = 23.5;
const SHAPES: Record<Exclude<CrownKind, 'laurel'>, { n: number; top: number; drop: number }> = {
  plain: { n: 3, top: 9, drop: 2 },
  metal: { n: 5, top: 7.5, drop: 1.5 },
  crystal: { n: 5, top: 6, drop: 1.6 },
  star: { n: 7, top: 7.5, drop: 1.1 },
};
const VALLEY: Record<Exclude<CrownKind, 'laurel'>, number> = {
  plain: 16,
  metal: 15,
  crystal: 14.5,
  star: 14,
};

// The brand star from public/favicon.svg, shrunk onto the top crown's middle point
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

function gradient(id: string, tone: Tone) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stopColor={tone.light} />
      <stop offset="0.5" stopColor={tone.mid} />
      <stop offset="1" stopColor={tone.dark} />
    </linearGradient>
  );
}

function gem(x: number, y: number, r: number) {
  return `M${x} ${y - r} L${x + r * 0.8} ${y} L${x} ${y + r} L${x - r * 0.8} ${y} Z`;
}

function point(angle: number, r: number) {
  const a = (angle * Math.PI) / 180;
  return { x: 16 + r * Math.cos(a), y: 16 + r * Math.sin(a) };
}

function crown(style: CrownStyle, body: string, band: string, glow: string): ReactNode {
  const kind = style.kind as Exclude<CrownKind, 'laurel'>;
  const { n, top, drop } = SHAPES[kind];
  const mid = (n - 1) / 2;
  const peaks = Array.from({ length: n }, (_, i) => ({
    x: 4.5 + (23 * i) / (n - 1),
    y: top + Math.abs(i - mid) * drop,
  }));
  const valleys = peaks.slice(1).map((p, i) => ({ x: (p.x + peaks[i].x) / 2, y: VALLEY[kind] }));
  const outline = peaks
    .map((p, i) => (i > 0 ? `L${valleys[i - 1].x} ${valleys[i - 1].y} ` : '') + `L${p.x} ${p.y}`)
    .join(' ');
  const { tone } = style;
  const bandTone = style.band ?? tone;
  const faceted = kind === 'crystal' || kind === 'star';
  return (
    <>
      {kind === 'star' && <circle cx="16" cy="15" r="16" fill={glow} />}
      <path
        d={`M5.5 ${BASE} ${outline} L26.5 ${BASE} Z`}
        fill={body}
        stroke={tone.dark}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {faceted &&
        valleys.map((v) => (
          <path
            key={v.x}
            d={`M${v.x} ${v.y + 0.8} L${v.x} ${BASE}`}
            stroke={tone.light}
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}
      {style.grain && (
        <path
          d="M9.5 22.5 Q11 18 9 13 M16 22.5 Q17.4 16.5 16 11 M22.5 22.5 Q21 18 23 13"
          fill="none"
          stroke={tone.dark}
          strokeWidth="0.7"
          opacity="0.9"
        />
      )}
      {kind === 'star' &&
        STARDUST.map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} fill="#fff" opacity="0.9" />
        ))}
      {kind !== 'plain' && (
        <path
          d={`M${peaks[0].x + 1.6} 21.8 L${peaks[0].x + 0.9} ${peaks[0].y + 3.5}`}
          stroke={tone.light}
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.75"
        />
      )}
      {kind === 'metal' &&
        peaks.map((p) => (
          <circle
            key={p.x}
            cx={p.x}
            cy={p.y}
            r="1.5"
            fill={body}
            stroke={tone.dark}
            strokeWidth="0.8"
          />
        ))}
      {faceted &&
        peaks.map((p, i) =>
          kind === 'star' && i === mid ? null : (
            <path
              key={p.x}
              d={gem(p.x, p.y, 1.5)}
              fill={tone.light}
              stroke={tone.dark}
              strokeWidth="0.6"
            />
          ),
        )}
      {kind === 'star' && (
        <polygon
          points={STAR}
          fill={band}
          stroke={bandTone.dark}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      )}
      <rect
        x="5"
        y="22.8"
        width="22"
        height="4.4"
        rx="1.4"
        fill={band}
        stroke={bandTone.dark}
        strokeWidth="0.9"
      />
      {style.rivets &&
        [8, 12.7, 19.3, 24].map((x) => <circle key={x} cx={x} cy="25" r="0.6" fill={tone.dark} />)}
      {kind === 'metal' &&
        [9, 16, 23].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy="25"
            r={i === 1 ? 1.1 : 0.8}
            fill={style.gems?.[i] ?? tone.light}
            stroke={style.gems ? tone.dark : 'none'}
            strokeWidth="0.4"
          />
        ))}
      {faceted && (
        <>
          <ellipse
            cx="16"
            cy="25"
            rx="2.3"
            ry="1.6"
            fill={body}
            stroke={tone.dark}
            strokeWidth="0.6"
          />
          <circle cx="15.3" cy="24.5" r="0.45" fill="#fff" />
          <circle cx="9" cy="25" r="0.7" fill={tone.light} />
          <circle cx="23" cy="25" r="0.7" fill={tone.light} />
        </>
      )}
    </>
  );
}

// Two branches of leaves rising from a gold tie, open at the top
function laurel(style: CrownStyle, body: string, band: string): ReactNode {
  const { tone } = style;
  const bandTone = style.band ?? tone;
  const leaves: { x: number; y: number; rot: number }[] = [];
  for (const side of [-1, 1]) {
    for (let k = 0; k < 5; k++) {
      const angle = side < 0 ? 118 + k * 25 : 62 - k * 25;
      const tangent = angle - side * 90;
      for (const o of [-1, 1]) {
        const at = point(angle, 9 + o * 1.5);
        leaves.push({ ...at, rot: tangent + o * side * 30 });
      }
    }
    const tip = point(side < 0 ? 232 : -52, 9);
    leaves.push({ ...tip, rot: (side < 0 ? 232 : -52) - side * 90 });
  }
  const from = (a: number) => point(a, 9);
  return (
    <>
      <path
        d={`M${from(112).x} ${from(112).y} A9 9 0 0 1 ${from(228).x} ${from(228).y} M${from(68).x} ${from(68).y} A9 9 0 0 0 ${from(-48).x} ${from(-48).y}`}
        fill="none"
        stroke={tone.dark}
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
          fill={body}
          stroke={tone.dark}
          strokeWidth="0.4"
        />
      ))}
      <path d="M15.2 25.6 L13.4 29.4 L15 28.8 Z M16.8 25.6 L18.6 29.4 L17 28.8 Z" fill={band} />
      <circle cx="16" cy="25.4" r="1.4" fill={band} stroke={bandTone.dark} strokeWidth="0.5" />
    </>
  );
}

// A crown for places 1 to CROWNS.length, grander and a little bigger the higher the place
export function RankCrown({ rank }: { rank: number }) {
  // useId's separators (colons in older React) don't belong in url(#...)
  const id = `crown${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const place = Math.min(Math.max(rank, 1), CROWNS.length);
  const style = CROWNS[place - 1];
  const size = Math.round(24 + ((CROWNS.length - place) * 6) / (CROWNS.length - 1));
  const body = `url(#${id}b)`;
  const band = `url(#${id}g)`;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" data-crown={style.kind}>
      <defs>
        {gradient(`${id}b`, style.tone)}
        {gradient(`${id}g`, style.band ?? style.tone)}
        <radialGradient id={`${id}h`}>
          <stop offset="0" stopColor={style.tone.mid} stopOpacity="0.55" />
          <stop offset="1" stopColor={style.tone.mid} stopOpacity="0" />
        </radialGradient>
      </defs>
      {style.kind === 'laurel'
        ? laurel(style, body, band)
        : crown(style, body, band, `url(#${id}h)`)}
    </svg>
  );
}
