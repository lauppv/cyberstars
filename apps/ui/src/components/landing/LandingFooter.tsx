import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '../ui/BrandMark';
import { LICENSE_URL, SOURCE_URL } from './links';

const footLink =
  'p-0 bg-transparent border-none cursor-pointer text-[13px] text-[var(--text2)] hover:text-[var(--text)] no-underline transition';

// Sections of this page, each by its id and the heading it opens on
const SECTIONS = [
  ['how', 'landing.how.title'],
  ['features', 'landing.features.title'],
  ['faq', 'landing.faq.title'],
] as const;

// Scrolled to by hand: an href="#how" would be read by the HashRouter as a route
function scrollToSection(id: string) {
  const smooth = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
}

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
          {SECTIONS.map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollToSection(id)} className={footLink}>
              {t(label)}
            </button>
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
