import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Lock, Monitor, Play, Rocket } from 'lucide-react';
import type { LaniakeaState } from '@cyberstars/shared/laniakea';
import { BetaBadge } from '../../components/ui/BetaBadge';

export function LoadingScreen({ failed, onRetry }: { failed: boolean; onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="lnk-screen">
      {failed ? (
        <>
          <p role="alert">{t('laniakea.loadFailed')}</p>
          <div className="flex gap-2">
            <button type="button" className="lnk-btn lnk-btn-primary" onClick={onRetry}>
              {t('laniakea.tryAgain')}
            </button>
            <Link to="/" className="lnk-btn no-underline">
              {t('laniakea.locked.back')}
            </Link>
          </div>
        </>
      ) : (
        <p role="status">{t('laniakea.loading')}</p>
      )}
    </div>
  );
}

// Before the first lessons: what the game is and how far there is to go.
export function LockedScreen({ state }: { state: LaniakeaState }) {
  const { t } = useTranslation();
  const next = state.planets.find((p) => !p.lessonDone);
  const done = Math.min(state.lessonsDone, state.unlockAt);
  return (
    <div className="lnk-screen">
      <Lock size={34} className="mb-4 opacity-70" />
      <div className="mb-3">
        <BetaBadge hint={t('laniakea.betaHint')} />
      </div>
      <h1>{t('laniakea.locked.title', { count: state.unlockAt })}</h1>
      <p>{t('laniakea.locked.body')}</p>
      <div className="lnk-meter" aria-hidden="true">
        <span style={{ width: `${(done / state.unlockAt) * 100}%` }} />
      </div>
      <div className="text-[12px] lnk-dim mb-6">
        {t('laniakea.locked.progress', { done, total: state.unlockAt })}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {next && (
          <Link
            to={`/lesson/${state.courseKey}/${next.slug}`}
            className="lnk-btn lnk-btn-primary no-underline"
          >
            {t('laniakea.locked.next')}
          </Link>
        )}
        <Link to="/" className="lnk-btn no-underline">
          {t('laniakea.locked.back')}
        </Link>
      </div>
    </div>
  );
}

const KEYS: [string[], string][] = [
  [['W', 'S'], 'fly'],
  [['A', 'D'], 'turn'],
  [['K', 'O'], 'pitch'],
  [['Shift'], 'boost'],
  [['E'], 'land'],
  [['B'], 'board'],
  [['Esc'], 'pause'],
  [['Q'], 'quit'],
];

export function IntroScreen({ isTouch, onBegin }: { isTouch: boolean; onBegin: () => void }) {
  const { t } = useTranslation();
  const begin = useRef<HTMLButtonElement>(null);
  // Focused for Enter, without scrolling a short screen past its top
  useEffect(() => begin.current?.focus({ preventScroll: true }), []);
  return (
    <div className="lnk-screen">
      {isTouch && (
        <div className="lnk-panel lnk-pc mb-6" role="note">
          <Monitor size={28} className="lnk-blue flex-shrink-0" />
          <div className="text-left">
            <div className="text-[16px] font-bold">{t('laniakea.intro.pcTitle')}</div>
            <div className="text-[13px] lnk-dim mt-1 leading-snug">
              {t('laniakea.intro.pcBody')}
            </div>
          </div>
        </div>
      )}
      <Rocket size={34} className="lnk-rocket mb-4 opacity-80" />
      <div className="mb-3">
        <BetaBadge hint={t('laniakea.betaHint')} />
      </div>
      <h1>{t('laniakea.intro.title')}</h1>
      <p>{t('laniakea.intro.body')}</p>
      {isTouch ? (
        <div className="lnk-keys !grid-cols-1">
          <div>{t('laniakea.intro.touchSteer')}</div>
          <div>{t('laniakea.intro.touchThrottle')}</div>
          <div>{t('laniakea.intro.touchLand')}</div>
        </div>
      ) : (
        <div className="lnk-keys">
          {KEYS.map(([keys, what]) => (
            <div key={what}>
              {keys.map((k) => (
                <kbd key={k} className="lnk-kbd">
                  {k}
                </kbd>
              ))}
              <span>{t(`laniakea.intro.${what}`)}</span>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        className="lnk-btn lnk-btn-primary !h-11 !px-6"
        onClick={onBegin}
        ref={begin}
      >
        <Play size={14} /> {t('laniakea.intro.begin')}
      </button>
    </div>
  );
}

export function PauseScreen({ onResume, onQuit }: { onResume: () => void; onQuit: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="lnk-screen lnk-see-through">
      <h1>{t('laniakea.hud.paused')}</h1>
      <div className="flex gap-2">
        <button type="button" className="lnk-btn lnk-btn-primary" onClick={onResume} autoFocus>
          <Play size={14} /> {t('laniakea.hud.resume')}
        </button>
        <button type="button" className="lnk-btn" onClick={onQuit}>
          {t('laniakea.hud.quit')}
        </button>
      </div>
    </div>
  );
}
