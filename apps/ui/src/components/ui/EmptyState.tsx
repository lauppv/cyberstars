import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

// What a list or a pane shows while it has nothing yet: an icon on a faint
// accent tile, one line saying so, and where it helps a hint or a way on.
// `framed` puts it in a panel of its own, for a page whose list is empty
export function EmptyState({
  icon: Icon,
  title,
  hint,
  action,
  framed,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  action?: ReactNode;
  framed?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center text-center px-6 py-10 ${framed ? 'panel' : ''}`}>
      <div className="w-10 h-10 mb-3.5 rounded-[var(--radius)] flex items-center justify-center bg-[var(--accent)]/10 border border-[var(--border)] text-[var(--accent)]">
        <Icon size={18} aria-hidden="true" />
      </div>
      <p className="m-0 text-[14px] font-semibold text-[var(--text)]">{title}</p>
      {hint && (
        <p className="m-0 mt-1 max-w-xs text-[13px] leading-relaxed text-[var(--text3)]">{hint}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
