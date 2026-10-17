import { useTranslation } from 'react-i18next';
import type { UsageState } from '@cyberstars/shared/usage';

// Formats the rolling-window reset time the Claude way: a weekday + local time
// (e.g. "Mon, 14:30") so people know exactly when their quota refills.
function formatReset(resetAt: string, locale: string): string {
  return new Date(resetAt).toLocaleString(locale, {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function UsageMeter({
  state,
  label,
  period,
  compact = false,
}: {
  state: UsageState;
  label: string;
  // How long the window lasts, shown after the label.
  period?: string;
  compact?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const { used, limit, remaining, resetAt, unlimited } = state;
  const pct = unlimited ? 0 : Math.min(100, (used / limit) * 100);
  const depleted = !unlimited && remaining <= 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-[var(--text2)] font-medium">
          {label}
          {period && <span className="text-[var(--text3)] font-normal"> · {period}</span>}
        </span>
        <span
          className={`tabular-nums font-semibold ${depleted ? 'text-[var(--error)]' : 'text-[var(--text3)]'}`}
        >
          {unlimited ? t('usage.unlimited') : t('usage.percentUsed', { percent: Math.round(pct) })}
        </span>
      </div>
      {!unlimited && (
        <div className="h-1.5 rounded-full bg-[var(--surface2)] overflow-hidden" aria-hidden>
          <div
            className={`h-full rounded-full transition-[width] duration-500 ${depleted ? 'bg-[var(--error)]' : 'bg-[var(--accent)]'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      {!compact && !unlimited && resetAt && (
        <span className="text-[11px] text-[var(--text3)]">
          {t('usage.resetsAt', { when: formatReset(resetAt, i18n.language) })}
        </span>
      )}
    </div>
  );
}
