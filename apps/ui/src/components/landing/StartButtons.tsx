import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

// The page's one action and its second: start a course, or sign in. Every
// place that asks the visitor to begin uses these, so they lead to the same
// pages and look the same.
export function StartButtons({
  signIn = true,
  className = '',
}: {
  signIn?: boolean;
  className?: string;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`.trim()}>
      <button
        onClick={() => navigate('/courses')}
        className="px-6 py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer"
      >
        {t('home.marketing.startLearning')}
      </button>
      {signIn && (
        <button
          onClick={() => navigate('/getstarted')}
          className="px-6 py-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition cursor-pointer"
        >
          {t('home.marketing.signIn')}
        </button>
      )}
    </div>
  );
}
