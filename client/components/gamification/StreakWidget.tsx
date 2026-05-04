interface StreakWidgetProps {
  days: number;
}

export function StreakWidget({ days }: StreakWidgetProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-full">
      <span className="text-base">🔥</span>
      <span className="text-xs font-semibold whitespace-nowrap">
        {days} day{days === 1 ? '' : 's'} streak!
      </span>
      <div className="flex gap-[3px]">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`w-[18px] h-[18px] rounded flex items-center justify-center text-[8px] font-semibold ${
              i < days
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg3)] text-[var(--text3)]'
            }`}
          >
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
          </div>
        ))}
      </div>
    </div>
  );
}
