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
        data-track="start-learning"
        onClick={() => navigate('/courses')}
        className="btn btn-primary btn-lg"
      >
        {t('home.marketing.startLearning')}
      </button>
      {signIn && (
        <button
          data-track="sign-in"
          onClick={() => navigate('/getstarted')}
          className="btn btn-secondary btn-lg"
        >
          {t('home.marketing.signIn')}
        </button>
      )}
    </div>
  );
}
