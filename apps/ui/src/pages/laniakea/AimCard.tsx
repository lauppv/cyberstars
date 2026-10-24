import { useTranslation } from 'react-i18next';
import type { LaniakeaPlanet } from '@cyberstars/shared/laniakea';
import { useFeed, type Feed } from './feed';
import type { Aim } from './scene/explorer';
import { canFly, statusOf } from './planetStatus';
import { km, statusText } from './waitText';

// The planet ahead: its lesson, where it stands, and, once the ship is close
// enough, the way to land on it.
export function AimCard({
  aim,
  planets,
  titles,
  now,
  isTouch,
  onLand,
}: {
  aim: Feed<Aim | null>;
  planets: Map<string, LaniakeaPlanet>;
  titles: Map<string, string>;
  now: number;
  isTouch: boolean;
  onLand: (slug: string) => void;
}) {
  const { t } = useTranslation();
  const current = useFeed(aim);
  const planet = current ? planets.get(current.slug) : undefined;
  if (!current || !planet) return null;
  const status = statusOf(planet, now);
  const flyable = canFly(status);

  return (
    <div className="lnk-hud lnk-panel lnk-aim" role="status">
      <div className="text-[15px] font-semibold truncate">{titles.get(planet.slug)}</div>
      <div className="text-[12px] lnk-dim mt-0.5">{statusText(t, planet, status, now)}</div>
      {flyable &&
        (current.inReach ? (
          <div className="mt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              className="lnk-btn lnk-btn-primary"
              onClick={() => onLand(planet.slug)}
            >
              {t('laniakea.aim.land')}
            </button>
            {!isTouch && <span className="text-[11px] lnk-dim">{t('laniakea.aim.landKey')}</span>}
          </div>
        ) : (
          <div className="mt-1 text-[11px] lnk-teal">
            {t('laniakea.aim.closer')} · {t('laniakea.hud.distance', { km: km(current.distance) })}
          </div>
        ))}
    </div>
  );
}
