import { useId, type ReactNode } from 'react';
import { CROWNS, type Tone } from './crowns';
import { TIERS } from './badgeMeta';
import { metalGradient } from './metalGradient';

const GOLD = TIERS[3];
const SILVER = TIERS[2];

// Drawn in a 52x52 box behind a crown centred on 26,26
interface Paint {
  tone: Tone;
  fill: string;
  gold: string;
  silver: string;
}

function star(cx: number, cy: number, r: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const d = i % 2 ? r * 0.45 : r;
    return `${(cx + d * Math.cos(a)).toFixed(2)},${(cy + d * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
}

// One: two gold sceptres crossed behind, each topped with a star, over a starry mantle
function sceptres(p: Paint) {
  return (
    <>
      <path d="M43 43 L9 9 M9 43 L43 9" stroke={p.gold} strokeWidth="2.4" strokeLinecap="round" />
      <polygon points={star(9, 9, 5.5)} fill={p.gold} stroke={GOLD.dark} strokeWidth="0.6" />
      <polygon points={star(43, 9, 5.5)} fill={p.gold} stroke={GOLD.dark} strokeWidth="0.6" />
      <path
        d="M5 28 Q5 48 26 49.5 Q47 48 47 28 L41 30 Q40 42 26 43 Q12 42 11 30 Z"
        fill={p.fill}
        stroke={p.tone.dark}
        strokeWidth="0.8"
      />
      {[
        [9.5, 37],
        [14.5, 43.5],
        [26, 46.6],
        [37.5, 43.5],
        [42.5, 37],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="1" fill="#fff" />
      ))}
    </>
  );
}

// Two: two swords crossed behind, points up, ruby pommels
function swords(p: Paint) {
  const sword = (hx: number, tx: number) => {
    const dir = Math.sign(tx - hx);
    return (
      <g key={hx}>
        <path
          d={`M${hx} 40 L${tx - dir * 2} 10 L${tx} 7 L${tx - dir * 0.5} 11 Z`}
          fill={p.silver}
          stroke={SILVER.dark}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <path
          d={`M${hx + dir * 0.5} 34 L${hx + dir * 6.5} 40`}
          stroke={p.gold}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d={`M${hx} 40 L${hx - dir * 3} 44`}
          stroke={p.tone.dark}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle
          cx={hx - dir * 4}
          cy="45.5"
          r="2"
          fill={p.fill}
          stroke={p.tone.dark}
          strokeWidth="0.6"
        />
      </g>
    );
  };
  return (
    <>
      {sword(12, 44)}
      {sword(40, 8)}
    </>
  );
}

// Three: a sapphire shield rimmed in gold behind the avatar, its corners and point showing
function shield(p: Paint) {
  return (
    <>
      <path
        d="M6 6 H46 V24 Q46 41 26 50 Q6 41 6 24 Z"
        fill={p.fill}
        stroke={p.gold}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 9 H43 V24 Q43 39 26 46.5 Q9 39 9 24 Z"
        fill="none"
        stroke={p.tone.light}
        strokeWidth="0.6"
        opacity="0.7"
      />
      <circle cx="10.5" cy="10.5" r="1.2" fill={p.gold} />
      <circle cx="41.5" cy="10.5" r="1.2" fill={p.gold} />
      <circle cx="26" cy="47" r="1" fill="#fff" />
    </>
  );
}

// Four: two jade staffs crossed behind, each flying a small pennant
function staffs(p: Paint) {
  return (
    <>
      <path
        d="M43 44 L10 11 M9 44 L42 11"
        stroke={p.tone.dark}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M10 11 L19 9 L13.5 16 Z M42 11 L33 9 L38.5 16 Z"
        fill={p.fill}
        stroke={p.tone.dark}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="10" r="1.8" fill={p.gold} />
      <circle cx="43" cy="10" r="1.8" fill={p.gold} />
    </>
  );
}

// Five: a pair of gold wings spreading out from behind the crown
function wings(p: Paint) {
  const tips = [
    [3, 14],
    [3.5, 22.5],
    [7, 30.5],
  ];
  const feathers = [-1, 1].flatMap((side) =>
    tips.map(([tx, ty]) => {
      const [rx, ry] = [26 - side * 5, 31];
      const x = side < 0 ? tx : 52 - tx;
      const length = Math.hypot(x - rx, ty - ry);
      const angle = (Math.atan2(ty - ry, x - rx) * 180) / Math.PI;
      return { cx: (x + rx) / 2, cy: (ty + ry) / 2, rx: length / 2, angle };
    }),
  );
  return (
    <>
      {feathers.map(({ cx, cy, rx, angle }) => (
        <ellipse
          key={`${cx.toFixed(2)},${cy.toFixed(2)}`}
          cx={cx}
          cy={cy}
          rx={rx}
          ry="2.6"
          transform={`rotate(${angle} ${cx} ${cy})`}
          fill={p.gold}
          stroke={GOLD.dark}
          strokeWidth="0.6"
        />
      ))}
    </>
  );
}

const REGALIA: Record<number, ((p: Paint) => ReactNode) | undefined> = {
  1: sceptres,
  2: swords,
  3: shield,
  4: staffs,
  5: wings,
};

// The podium's insignia behind the crown for places 1 to 5, like a coat of arms; any other place gets the crown alone
export function RankRegalia({ rank, children }: { rank: number; children: ReactNode }) {
  const id = `regalia${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const draw = REGALIA[rank];
  if (!draw) return <>{children}</>;

  const tone = CROWNS[rank - 1].tone;
  return (
    <span className="relative inline-flex items-center justify-center w-12 h-12 flex-shrink-0">
      <svg
        className="absolute inset-0 pointer-events-none"
        width="48"
        height="48"
        viewBox="0 0 52 52"
        aria-hidden="true"
        data-regalia={rank}
      >
        <defs>
          {metalGradient(`${id}f`, tone)}
          {metalGradient(`${id}g`, GOLD)}
          {metalGradient(`${id}s`, SILVER)}
        </defs>
        {draw({ tone, fill: `url(#${id}f)`, gold: `url(#${id}g)`, silver: `url(#${id}s)` })}
      </svg>
      <span className="relative inline-flex">{children}</span>
    </span>
  );
}
