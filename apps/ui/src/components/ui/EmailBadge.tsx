import { useTranslation } from 'react-i18next';

// The small round mark sitting on the bottom-right edge of a profile avatar: a
// green check once the email is confirmed, a red cross until then. The parent
// must be `relative`; the ring in the panel colour cuts it out of the avatar.

interface EmailBadgeProps {
  confirmed: boolean;
  /** Diameter in px. */
  size?: number;
}

export function EmailBadge({ confirmed, size = 22 }: EmailBadgeProps) {
  const { t } = useTranslation();
  const label = t(confirmed ? 'emailConfirm.badgeConfirmed' : 'emailConfirm.badgeUnconfirmed');
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      data-testid={confirmed ? 'email-badge-confirmed' : 'email-badge-unconfirmed'}
      style={{ width: size, height: size }}
      className={`absolute -right-0.5 -bottom-0.5 z-10 flex items-center justify-center rounded-full border-2 border-[var(--panel-bg)] text-white ${
        confirmed ? 'bg-[var(--success)]' : 'bg-[var(--error)]'
      }`}
    >
      <svg
        viewBox="0 0 12 12"
        width={size * 0.55}
        height={size * 0.55}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {confirmed ? <path d="M2.5 6.5 5 9l4.5-6" /> : <path d="M3 3l6 6M9 3 3 9" />}
      </svg>
    </span>
  );
}
