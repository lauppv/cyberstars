interface BadgeProps {
  icon: string;
  label: string;
  earned: boolean;
  description?: string;
}

export function Badge({ icon, label, earned, description }: BadgeProps) {
  const tooltip = earned
    ? (description ?? label)
    : description
      ? `${description} (not yet earned)`
      : `${label} (not yet earned)`;

  return (
    <div
      className={`flex flex-col items-center gap-1 p-2 rounded-[var(--radius-sm)] border transition-all ${
        earned
          ? 'border-[var(--accent)] bg-[var(--surface)]'
          : 'border-[var(--border)] bg-[var(--bg3)] opacity-40 grayscale'
      }`}
      style={earned ? { boxShadow: '0 0 12px var(--accent-glow)' } : undefined}
      title={tooltip}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-semibold text-center text-[var(--text2)] leading-tight">
        {label}
      </span>
    </div>
  );
}
