import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { BrandMark } from '../ui/BrandMark';
import { Segmented } from '../ui/Segmented';
import { SUPPORTED_LANGS } from '../../i18n';
import { VISITOR_LINKS } from './links';

const navLink =
  'text-[13px] font-medium text-[var(--text2)] hover:text-[var(--text)] no-underline transition';

function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  const current = i18n.language === 'ro' ? 'ro' : 'en';
  return (
    <Segmented
      value={current}
      options={SUPPORTED_LANGS}
      onChange={(lng) => i18n.changeLanguage(lng)}
      optionLabel={(lng) => t(`lang.${lng}`)}
      ariaLabel={t('lang.switch')}
    />
  );
}

// The landing page's own header: the logo, the pages a visitor can open, the
// language switch and Sign in. Below 768px the links and the language switch
// fold into a menu, and Sign in stays in reach.
export function LandingNav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 bg-[var(--chrome)] border-b border-[var(--border)]">
      <nav className="max-w-[1120px] mx-auto h-14 px-4 sm:px-6 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-[var(--text)] no-underline">
          <BrandMark />
          <span className="font-semibold text-[15px] tracking-[-0.2px]">CyberStars</span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {VISITOR_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={navLink}>
              {t(l.label)}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:block">
            <LanguageSwitch />
          </div>
          <Link
            to="/getstarted"
            className="px-3.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold no-underline hover:brightness-110 transition"
          >
            {t('topbar.signIn')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="landing-menu"
            aria-label={t(open ? 'landing.nav.closeMenu' : 'landing.nav.openMenu')}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] bg-transparent border-none text-[var(--text2)] hover:text-[var(--text)] cursor-pointer"
          >
            {open ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="landing-menu"
          className="md:hidden border-t border-[var(--border)] px-4 py-3 flex flex-col gap-1"
        >
          {VISITOR_LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`${navLink} py-2`}>
              {t(l.label)}
            </Link>
          ))}
          <div className="pt-2 flex">
            <LanguageSwitch />
          </div>
        </div>
      )}
    </header>
  );
}
