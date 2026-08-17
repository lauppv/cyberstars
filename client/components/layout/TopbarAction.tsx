import type { ReactNode } from 'react';
import { Deco } from '../ui/Deco';

// The shape shared by every top-right action (bell, leaderboard, connections,
// messages) and by their locked stand-ins.
//
// Max graphics show the emoji these buttons have always used. Min has no icon
// set to fall back on, so it shows a short word instead — an unlabelled square
// would be a control nobody can identify. The button keeps its full `label` as
// the accessible name in both modes.
export function TopbarAction({
  emoji,
  label,
  short,
  onClick,
  children,
  className = '',
  dimmed = false,
  ...rest
}: {
  emoji: string;
  /** Full name, used as the accessible name and tooltip. */
  label: string;
  /** Compact word shown in min graphics, where there is no icon. */
  short: string;
  onClick: () => void;
  /** Badges or other overlays positioned against the button. */
  children?: ReactNode;
  className?: string;
  dimmed?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'className' | 'children'>) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center h-9 min-w-9 px-2 rounded-[var(--radius-sm)] bg-transparent border-none hover:bg-[var(--surface)] transition cursor-pointer ${
        dimmed ? 'opacity-60 hover:opacity-80' : ''
      } ${className}`}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Deco className="text-[17px] leading-none">{emoji}</Deco>
      <Deco only="min" className="text-[12px] font-semibold text-[var(--text2)] whitespace-nowrap">
        {short}
      </Deco>
      {children}
    </button>
  );
}
