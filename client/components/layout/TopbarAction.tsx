import type { ReactNode } from 'react';

// The shape shared by the top-right actions (the bell) and their locked
// stand-ins. The button keeps its full `label` as the accessible name
export function TopbarAction({
  icon,
  label,
  onClick,
  children,
  className = '',
  dimmed = false,
  ...rest
}: {
  icon: ReactNode;
  /** Full name, used as the accessible name and tooltip. */
  label: string;
  onClick: () => void;
  /** Badges or other overlays positioned against the button. */
  children?: ReactNode;
  className?: string;
  dimmed?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'className' | 'children'>) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] bg-transparent border-none text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer ${
        dimmed ? 'opacity-60 hover:opacity-80' : ''
      } ${className}`}
      aria-label={label}
      title={label}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
