interface XPBarProps {
  current: number;
  max: number;
  level: number;
}

export function XPBar({ current, max, level }: XPBarProps) {
  const pct = Math.min(100, (current / max) * 100);

  return (
    <div className="px-5 py-1.5 bg-[var(--bg2)] border-b border-[var(--border)] flex-shrink-0">
      <div className="w-1/4 min-w-[200px] max-w-[320px]">
        <div className="flex justify-between text-[11px] mb-1">
          <span className="text-[var(--warning)] font-semibold">⭐ Level {level}</span>
          <span className="text-[var(--text3)]">{current} / {max} XP</span>
        </div>
        <div className="h-1.5 bg-[var(--bg3)] rounded-[3px] overflow-hidden">
          <div
            className="h-full rounded-[3px] transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, var(--accent), #a855f7)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
