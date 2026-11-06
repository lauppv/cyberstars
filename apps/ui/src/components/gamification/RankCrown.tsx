import { useId } from 'react';
import { TIERS } from './badgeMeta';

// Places 1, 2 and 3 wear the badges' gold, silver and bronze
const PLACE_TIER: Record<number, number> = { 1: 3, 2: 2, 3: 1 };

export function RankCrown({ rank, size = 26 }: { rank: number; size?: number }) {
  // useId's separators (colons in older React) don't belong in url(#...)
  const gradientId = `crown${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const tier = TIERS[PLACE_TIER[rank] ?? 1];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tier.light} />
          <stop offset="0.45" stopColor={tier.mid} />
          <stop offset="1" stopColor={tier.dark} />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradientId})`} stroke={tier.dark} strokeWidth="1" strokeLinejoin="round">
        <path d="M3 17 L4.5 7.5 L9 11.5 L12 4.5 L15 11.5 L19.5 7.5 L21 17 Z" />
        <rect x="3" y="18.5" width="18" height="2.5" rx="1" />
      </g>
      <circle cx="12" cy="13.5" r="1.6" fill={tier.light} />
    </svg>
  );
}
