import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Crosshair } from 'lucide-react';
import { useFeed, type Feed } from './feed';
import { bearingTo, type ShipPose } from './navMath';
import { REACH, type PlanetSpot } from './planetLayout';
import { km } from './waitText';

// Below the middle: how far the target is and which way to turn and climb to
// face it, the words the arrow in front of the ship says.
export function TargetReadout({
  pose,
  spot,
  title,
}: {
  pose: Feed<ShipPose | null>;
  spot: PlanetSpot | null;
  title: string | null;
}) {
  const { t } = useTranslation();
  const ship = useFeed(pose);

  if (!spot || !ship) {
    return (
      <div className="lnk-hud lnk-panel lnk-bottom-center text-[12px] lnk-dim">
        {t('laniakea.hud.noTarget')}
      </div>
    );
  }
  const b = bearingTo(ship, spot.position);
  const surface = Math.max(0, b.distance - spot.radius);
  const turn = Math.round(b.turn);
  const climb = Math.round(b.climb);
  const ahead = Math.abs(turn) <= 3 && Math.abs(climb) <= 3;

  return (
    <div className="lnk-hud lnk-panel lnk-bottom-center" role="status">
      <div className="flex items-center gap-2 text-[11px] lnk-label">
        <Crosshair size={12} /> {t('laniakea.hud.target')}
      </div>
      <div className="text-[13px] font-semibold truncate mt-0.5">{title}</div>
      {surface < REACH ? (
        <div className="text-[12px] lnk-teal mt-1">{t('laniakea.hud.arrived')}</div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] mt-1">
          <span className="lnk-value !text-[12px] lnk-teal">
            {t('laniakea.hud.distance', { km: km(surface) })}
          </span>
          {ahead ? (
            <span>{t('laniakea.hud.ahead')}</span>
          ) : (
            <>
              {Math.abs(turn) > 3 && (
                <span className="inline-flex items-center gap-1">
                  {turn > 0 ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
                  {t(turn > 0 ? 'laniakea.hud.right' : 'laniakea.hud.left', {
                    deg: Math.abs(turn),
                  })}
                </span>
              )}
              {Math.abs(climb) > 3 && (
                <span className="inline-flex items-center gap-1">
                  {climb > 0 ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                  {t(climb > 0 ? 'laniakea.hud.up' : 'laniakea.hud.down', { deg: Math.abs(climb) })}
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
