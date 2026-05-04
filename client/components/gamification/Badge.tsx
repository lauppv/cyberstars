interface BadgeProps {
  icon: string;
  label: string;
  earned: boolean;
}

export function Badge({ icon, label, earned }: BadgeProps) {
  return (
    <div
      className={`flex flex-col items-center gap-1 p-2 rounded-[var(--radius-sm)] border transition-all ${
        earned
          ? 'border-[var(--accent)] bg-[var(--surface)]'
          : 'border-[var(--border)] bg-[var(--bg3)] opacity-40 grayscale'
      }`}
      style={earned ? { boxShadow: '0 0 12px var(--accent-glow)' } : undefined}
      title={label}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-semibold text-center text-[var(--text2)] leading-tight">
        {label}
      </span>
    </div>
  );
}
