import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award } from 'lucide-react';
import { FOREVER_LEVEL, type LaniakeaState } from '@cyberstars/shared/laniakea';
import { getLaniakea } from '../../services/laniakeaService';
import { BetaBadge } from '../ui/BetaBadge';
import { usePlanetNames } from './usePlanetNames';

// Laniakea on the student's own profile: how many planets they conquered and
// keep for good, and the achievement of each one kept for good. Nothing until
// the game is open and a planet conquered, or when the game can't be read.
export function LaniakeaTrophies() {
  const { t } = useTranslation();
  const [state, setState] = useState<LaniakeaState | null>(null);
  const { titles } = usePlanetNames(state?.courseKey);

  useEffect(() => {
    let live = true;
    getLaniakea()
      .then((s) => live && setState(s))
      .catch(() => {
        // the profile then just leaves the game out
      });
    return () => {
      live = false;
    };
  }, []);

  const conquered = state?.unlocked ? state.planets.filter((p) => p.level >= 1) : [];
  if (conquered.length === 0) return null;
  const kept = conquered.filter((p) => p.level >= FOREVER_LEVEL);

  return (
    <div className="py-5 border-b border-[var(--border)]">
      <h2 className="text-[13px] font-semibold tracking-[1px] text-[var(--text3)] mb-3.5 flex items-center gap-2">
        {t('nav.laniakea')} <BetaBadge hint={t('laniakea.betaHint')} />
      </h2>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="py-3 text-center rounded-[var(--radius-sm)] border border-[var(--border)]">
          <div className="text-[20px] font-bold">{conquered.length}</div>
          <div className="text-[11px] text-[var(--text3)] mt-0.5">
            {t('profile.laniakea.conquered')}
          </div>
        </div>
        <div className="py-3 text-center rounded-[var(--radius-sm)] border border-[var(--border)]">
          <div className="text-[20px] font-bold">{kept.length}</div>
          <div className="text-[11px] text-[var(--text3)] mt-0.5">
            {t('profile.laniakea.forever')}
          </div>
        </div>
      </div>
      {kept.length > 0 && (
        <ul className="list-none m-0 mt-2.5 p-0 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5">
          {kept.map((p) => {
            const planet = titles.get(p.slug) ?? p.slug;
            return (
              <li
                key={p.slug}
                title={t('profile.laniakea.keeperHint', { planet })}
                className="flex items-center gap-2 p-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)]"
              >
                <Award size={16} className="flex-shrink-0 text-[#ffcc55]" aria-hidden="true" />
                <span className="text-[12px] font-semibold text-[var(--text2)] leading-tight">
                  {t('profile.laniakea.keeper', { planet })}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
