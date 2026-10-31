import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { switchLanguage } from '../../i18n';

// Picking the other language reloads the page on its own address, so the
// choice is kept in this tab and the tour goes on from there. The welcome is
// kept too, so a reload or a trip back to the lesson doesn't bring it up again.
const LANGUAGE_KEY = 'cyberstars.tourLanguage';
const WELCOME_KEY = 'cyberstars.tourWelcome';

function stored(key: string): boolean {
  try {
    return sessionStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

function store(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // storage blocked: the tour asks again after a reload
  }
}

interface LessonTourProps {
  userName: string;
  // The lesson's tests passed, which ends the tour.
  completed: boolean;
  onFinish: () => void;
}

// A new account's first lesson opens on a language choice and a word of
// welcome over the dimmed page. Then the lesson is theirs to explore, until
// its tests pass and the last card lets them out.
export function LessonTour({ userName, completed, onFinish }: LessonTourProps) {
  const { t } = useTranslation();
  const [languagePicked, setLanguagePicked] = useState(() => stored(LANGUAGE_KEY));
  const [welcomed, setWelcomed] = useState(() => stored(WELCOME_KEY));

  const card = completed ? 'done' : !languagePicked ? 'language' : !welcomed ? 'welcome' : null;
  if (!card) return null;

  const pickLanguage = (lang: 'ro' | 'en') => {
    setLanguagePicked(true);
    store(LANGUAGE_KEY, lang);
    switchLanguage(lang);
  };
  const begin = () => {
    setWelcomed(true);
    store(WELCOME_KEY, '1');
  };

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-tour-title"
        className="w-[min(360px,100%)] p-6 rounded-xl border border-[var(--border)] bg-[var(--bg2)] shadow-[0_8px_32px_#0008]"
      >
        <h2 id="lesson-tour-title" className="text-[16px] font-semibold text-[var(--text)] mb-2">
          {t(`tour.${card}.title`, { name: userName })}
        </h2>
        <p className="text-[14px] leading-relaxed text-[var(--text2)]">{t(`tour.${card}.body`)}</p>
        {card === 'language' ? (
          <div className="flex gap-2 mt-5">
            <TourButton onClick={() => pickLanguage('ro')} wide>
              {t('tour.language.ro')}
            </TourButton>
            <TourButton onClick={() => pickLanguage('en')} wide>
              {t('tour.language.en')}
            </TourButton>
          </div>
        ) : (
          <div className="flex justify-end mt-5">
            <TourButton onClick={card === 'done' ? onFinish : begin}>
              {t(card === 'done' ? 'tour.finish' : 'tour.start')}
            </TourButton>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

function TourButton({
  onClick,
  wide,
  children,
}: {
  onClick: () => void;
  wide?: boolean;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${wide ? 'flex-1 py-2' : 'py-1.5'} px-4 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold hover:brightness-110 transition cursor-pointer`}
    >
      {children}
    </button>
  );
}
