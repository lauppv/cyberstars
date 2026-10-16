import { useState } from 'react';
import { Navigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { INTERESTS, type Interest } from '@cyberstars/shared/interests';
import { useAuth } from '../context/AuthContext';
import { TutorMark } from '../components/tutor/TutorMark';
import { saveInterests } from '../services/profileService';

// Asked once, right after the tour (CYB-69): what the student wants to learn.
// The tutor picks its suggestions by the answer. TourGate keeps a new account
// here until it answers, and the saved answer sends it on to the dashboard.
export function InterestsPage() {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const [picked, setPicked] = useState<Interest[]>([]);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!user || user.interests) return <Navigate to="/" replace />;

  const toggle = (interest: Interest) =>
    setPicked((current) =>
      current.includes(interest) ? current.filter((i) => i !== interest) : [...current, interest],
    );

  const save = () => {
    setSaving(true);
    setFailed(false);
    // Kept in the order they're listed, whatever order they were ticked in.
    saveInterests(INTERESTS.filter((i) => picked.includes(i)))
      .then(refreshUser)
      .catch(() => {
        setFailed(true);
        setSaving(false);
      });
  };

  return (
    <main className="landing-glow min-h-screen text-[var(--text)]">
      <div className="max-w-[560px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="panel p-6 sm:p-8">
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <TutorMark size="lg" mood="happy" />
            <h1 className="m-0 text-[26px] sm:text-[30px] font-bold tracking-[-0.5px] leading-tight">
              {t('interests.title')}
            </h1>
            <p className="m-0 text-[var(--text2)] leading-relaxed">{t('interests.intro')}</p>
          </div>
          <div className="flex flex-col gap-2 mb-6">
            {INTERESTS.map((interest) => {
              const on = picked.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(interest)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] border text-left cursor-pointer transition ${
                    on
                      ? 'border-[var(--accent)] bg-[var(--surface2)]'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text3)]'
                  }`}
                >
                  <span
                    className={`flex-shrink-0 grid place-items-center w-5 h-5 rounded border ${
                      on
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                        : 'border-[var(--text3)]'
                    }`}
                  >
                    {on && <Check size={14} />}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {t(`interests.names.${interest}`)}
                    </span>
                    <span className="block text-[13px] text-[var(--text2)]">
                      {t(`interests.options.${interest}`)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {failed && (
            <p className="m-0 mb-3 text-[13px] text-[var(--error)]">{t('interests.error')}</p>
          )}
          <button
            type="button"
            data-track="interests-continue"
            onClick={save}
            disabled={!picked.length || saving}
            className="w-full px-6 py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('interests.continue')}
          </button>
        </div>
      </div>
    </main>
  );
}
