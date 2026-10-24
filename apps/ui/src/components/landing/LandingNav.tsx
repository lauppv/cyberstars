import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '../ui/BrandMark';
import { Segmented } from '../ui/Segmented';
import { SUPPORTED_LANGS, switchLanguage } from '../../i18n';

function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  const current = i18n.language === 'ro' ? 'ro' : 'en';
  return (
    <Segmented
      value={current}
      options={SUPPORTED_LANGS}
      onChange={switchLanguage}
      optionLabel={(lng) => t(`lang.${lng}`)}
      ariaLabel={t('lang.switch')}
    />
  );
}

// The landing page's own header: the logo, the language switch and Sign in.
// The page presents everything below it, so the header sends nowhere else.
// The sign-in page itself leaves the Sign in button out.
export function LandingNav({ signIn = true }: { signIn?: boolean }) {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-30 bg-[var(--chrome)] border-b border-[var(--border)]">
      <nav className="max-w-[1120px] mx-auto h-14 px-4 sm:px-6 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-[var(--text)] no-underline">
          <BrandMark />
          <span className="font-semibold text-[15px] tracking-[-0.2px]">CyberStars</span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitch />
          {signIn && (
            <Link
              to="/getstarted"
              data-track="sign-in"
              className="px-3.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold no-underline hover:brightness-110 transition"
            >
              {t('topbar.signIn')}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
