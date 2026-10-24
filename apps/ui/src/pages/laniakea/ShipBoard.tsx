import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { FOREVER_LEVEL, type LaniakeaPlanet } from '@cyberstars/shared/laniakea';
import { boardPlanets, statusOf, type BoardSort } from './planetStatus';
import { MARK_COLOR, markOf } from './colors';
import { statusText } from './waitText';

const SORT_KEY = 'cyberstars.laniakea.sort';
const SORTS: BoardSort[] = ['next', 'order', 'level'];

function savedSort(): BoardSort {
  try {
    const saved = localStorage.getItem(SORT_KEY);
    return SORTS.includes(saved as BoardSort) ? (saved as BoardSort) : 'next';
  } catch {
    return 'next';
  }
}

// The steps a planet has climbed: the conquest, then each recap.
function Steps({ level }: { level: number }) {
  return (
    <span className={`lnk-steps ${level >= FOREVER_LEVEL ? 'lnk-forever' : ''}`} aria-hidden="true">
      {Array.from({ length: FOREVER_LEVEL }, (_, i) => (
        <span key={i} className={i < level ? 'lnk-on' : undefined} />
      ))}
    </span>
  );
}

// The ship's board: every planet whose lesson is done, with where it stands
// and its countdown. A click makes it the target the arrow points to.
export function ShipBoard({
  planets,
  titles,
  now,
  target,
  onTarget,
  onClose,
}: {
  planets: LaniakeaPlanet[];
  titles: Map<string, string>;
  now: number;
  target: string | null;
  onTarget: (slug: string | null) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [sort, setSort] = useState<BoardSort>(savedSort);
  const listed = boardPlanets(planets, sort, now);
  const waiting = planets.length - listed.length;

  const pick = (next: BoardSort) => {
    setSort(next);
    try {
      localStorage.setItem(SORT_KEY, next);
    } catch {
      // a browser that keeps nothing just forgets the choice
    }
  };

  return (
    <section className="lnk-hud lnk-panel lnk-board" aria-label={t('laniakea.board.title')}>
      <div className="lnk-board-head">
        <h2 className="m-0 text-[13px] font-semibold">{t('laniakea.board.title')}</h2>
        <div className="flex items-center gap-2">
          <select
            className="lnk-select"
            aria-label={t('laniakea.board.sort')}
            value={sort}
            onChange={(e) => pick(e.target.value as BoardSort)}
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {t(`laniakea.board.${s}`)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="lnk-btn !h-7 !px-2"
            onClick={onClose}
            aria-label={t('laniakea.board.close')}
          >
            <X size={14} />
          </button>
        </div>
      </div>
      {listed.length === 0 ? (
        <p className="m-0 p-4 text-[12px] lnk-dim">{t('laniakea.board.empty')}</p>
      ) : (
        <ul className="lnk-board-list">
          {listed.map((p) => {
            const status = statusOf(p, now);
            const targeted = target === p.slug;
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  className="lnk-row"
                  aria-pressed={targeted}
                  title={targeted ? t('laniakea.board.targeted') : t('laniakea.board.fly')}
                  onClick={() => onTarget(targeted ? null : p.slug)}
                >
                  <span className="lnk-dot" style={{ background: MARK_COLOR[markOf(p, status)] }} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] font-semibold truncate">
                      {titles.get(p.slug) ?? p.slug}
                    </span>
                    <span className="block text-[11px] lnk-dim truncate">
                      {statusText(t, p, status, now)}
                    </span>
                    {p.level > 0 && <Steps level={p.level} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {waiting > 0 && (
        <p className="m-0 px-4 py-2 text-[11px] lnk-dim border-t border-[rgba(108,92,231,0.2)]">
          {t('laniakea.board.waiting', { count: waiting })}
        </p>
      )}
    </section>
  );
}
