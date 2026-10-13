import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Topbar } from '../components/layout/Topbar';

// An address that matches no page: the server answers it with a 404 too
export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="panel max-w-[420px] w-full p-6 text-center">
          <h1 className="text-lg font-semibold mb-2">{t('notFound.title')}</h1>
          <p className="text-[13px] text-[var(--text2)] mb-5">{t('notFound.text')}</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold no-underline hover:brightness-110 transition"
          >
            {t('notFound.home')}
          </Link>
        </div>
      </main>
    </div>
  );
}
