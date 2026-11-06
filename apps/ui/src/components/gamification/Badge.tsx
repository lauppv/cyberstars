import { useTranslation } from 'react-i18next';
import { BadgeEmblem } from './BadgeEmblem';

interface BadgeProps {
  courseKey: string;
  level: number;
  label: string;
  earned: boolean;
  description?: string;
}

export function Badge({ courseKey, level, label, earned, description }: BadgeProps) {
  const { t } = useTranslation();
  const tooltip = earned
    ? (description ?? label)
    : `${description ?? label}${t('gamification.notEarned')}`;

  return (
    <div
      className={`flex flex-col items-center gap-1.5 p-2 rounded-[var(--radius-sm)] border transition-all ${
        earned
          ? 'border-[var(--accent)] bg-[var(--surface)]'
          : 'border-[var(--border)] bg-[var(--bg3)] opacity-40 grayscale'
      }`}
      style={earned ? { boxShadow: '0 0 12px var(--accent-glow)' } : undefined}
      title={tooltip}
    >
      <BadgeEmblem courseKey={courseKey} level={level} />
      <span className="text-[10px] font-semibold text-center text-[var(--text2)] leading-tight">
        {label}
      </span>
    </div>
  );
}
