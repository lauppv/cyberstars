import { useTranslation } from 'react-i18next';
import { FOREVER_LEVEL, type LaniakeaPlanet } from '@cyberstars/shared/laniakea';
import { useFeed, type Feed } from './feed';
import { statusOf } from './planetStatus';
import { BetaBadge } from '../../components/ui/BetaBadge';

// Top left: how many planets are the student's, how many for good, and how
// many recaps are open now.
export function ShipStats({ planets, now }: { planets: LaniakeaPlanet[]; now: number }) {
  const { t } = useTranslation();
  const owned = planets.filter((p) => p.level >= 1).length;
  const forever = planets.filter((p) => p.level >= FOREVER_LEVEL).length;
  const recaps = planets.filter((p) => statusOf(p, now) === 'recap').length;
  return (
    <div className="lnk-hud lnk-panel lnk-top-left">
      <div className="flex items-center gap-2 text-[12px] font-semibold">
        {t('laniakea.hud.ship')} <BetaBadge hint={t('laniakea.betaHint')} />
      </div>
      <div className="lnk-stats">
        <div>
          <span className="lnk-label">{t('laniakea.hud.planets')}</span>
          <span className="lnk-value lnk-blue">
            {owned}
            <span className="lnk-dim text-[11px]">/{planets.length}</span>
          </span>
        </div>
        <div>
          <span className="lnk-label">{t('laniakea.hud.forever')}</span>
          <span className="lnk-value lnk-gold">{forever}</span>
        </div>
        <div>
          <span className="lnk-label">{t('laniakea.hud.recaps')}</span>
          <span className="lnk-value">{recaps}</span>
        </div>
      </div>
    </div>
  );
}

// Bottom left: the speed, and the keys on a keyboard.
export function SpeedPanel({ speed }: { speed: Feed<number> }) {
  const { t } = useTranslation();
  const value = useFeed(speed);
  return (
    <div className="lnk-hud lnk-panel lnk-bottom-left">
      <span className="lnk-label">{t('laniakea.hud.velocity')}</span>
      <div className="lnk-value lnk-teal">
        {Math.round(value * 600).toLocaleString()}
        <span className="lnk-dim text-[10px]"> km/s</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1 text-[10px] lnk-dim">
        <kbd className="lnk-kbd">W</kbd>
        <kbd className="lnk-kbd">A</kbd>
        <kbd className="lnk-kbd">S</kbd>
        <kbd className="lnk-kbd">D</kbd>
        <kbd className="lnk-kbd">K</kbd>
        <kbd className="lnk-kbd">O</kbd>
        <kbd className="lnk-kbd">Shift</kbd>
        <kbd className="lnk-kbd">E</kbd>
        <kbd className="lnk-kbd">B</kbd>
      </div>
    </div>
  );
}
