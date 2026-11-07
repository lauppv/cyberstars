// How far along a set is: a thin bar in the set's colour, with its line over
// it when given. One for the set cards, the drawer, the dashboard's Continue
// and a project's steps
export function ProgressBar({
  pct,
  color,
  label,
  className,
}: {
  pct: number;
  color: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <div className="text-[11px] text-[var(--text3)] mb-1">{label}</div>}
      <div className="h-1 bg-[var(--bg3)] rounded-sm overflow-hidden">
        <div
          className="h-full rounded-sm transition-[width] duration-400"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
