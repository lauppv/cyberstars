import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS } from '../../i18n';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div
      role="group"
      aria-label={t('lang.switch')}
      className="flex items-center rounded-[var(--radius-sm)] border border-[var(--border)] overflow-hidden"
    >
      {SUPPORTED_LANGS.map((lng) => {
        const active = current === lng;
        return (
          <button
            key={lng}
            onClick={() => i18n.changeLanguage(lng)}
            aria-pressed={active}
            className={`px-2 py-1 text-[11px] font-semibold cursor-pointer border-none transition ${
              active
                ? 'bg-[var(--accent)] text-white'
                : 'bg-transparent text-[var(--text3)] hover:text-[var(--text)]'
            }`}
          >
            {t(`lang.${lng}`)}
          </button>
        );
      })}
    </div>
  );
}
