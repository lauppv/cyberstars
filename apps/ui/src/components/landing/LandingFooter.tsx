import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '../ui/BrandMark';
import { LICENSE_URL, SOURCE_URL, VISITOR_LINKS } from './links';

const footLink = 'text-[13px] text-[var(--text2)] hover:text-[var(--text)] no-underline transition';

export function LandingFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <Link to="/" className="flex items-center gap-2 text-[var(--text)] no-underline">
          <BrandMark size={20} />
          <span className="font-semibold text-[14px]">CyberStars</span>
        </Link>
        <nav
          aria-label={t('landing.footer.label')}
          className="flex flex-wrap gap-x-5 gap-y-2 sm:ml-auto"
        >
          {VISITOR_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={footLink}>
              {t(l.label)}
            </Link>
          ))}
          <a href={SOURCE_URL} target="_blank" rel="noreferrer" className={footLink}>
            {t('landing.footer.source')}
          </a>
          <a href={LICENSE_URL} target="_blank" rel="noreferrer" className={footLink}>
            {t('landing.footer.license')}
          </a>
        </nav>
      </div>
    </footer>
  );
}
