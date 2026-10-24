import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Lock, Orbit } from 'lucide-react';
import {
  LANIAKEA_COURSE,
  LANIAKEA_UNLOCK_LESSONS,
  type LaniakeaState,
} from '@cyberstars/shared/laniakea';
import { useAllProgress } from '../../context/ProgressContext';
import { useCurriculum } from '../../context/CurriculumContext';
import { getLaniakea } from '../../services/laniakeaService';
import { statusOf } from '../../pages/laniakea/planetStatus';
import { BetaBadge } from '../ui/BetaBadge';

// Laniakea on the dashboard: before the first Python lessons, what opens it and
// how far there is to go; after, how many planets are the student's and what
// is waiting for them.
export function LaniakeaCard() {
  const { t } = useTranslation();
  const { progressMap, isLoading } = useAllProgress();
  const { courses } = useCurriculum();
  const lessons = progressMap[LANIAKEA_COURSE]?.lessons ?? [];
  const done = lessons.filter((l) => l.completed).length;
  const open = done >= LANIAKEA_UNLOCK_LESSONS;
  const [state, setState] = useState<LaniakeaState | null>(null);

  useEffect(() => {
    if (!open) return;
    let live = true;
    getLaniakea()
      .then((s) => live && setState(s))
      .catch(() => {
        // the card then just says the game is open
      });
    return () => {
      live = false;
    };
  }, [open]);

  if (isLoading) return null;

  const python = courses.find((c) => c.key === LANIAKEA_COURSE);
  const next = python?.lessons.find((l) => !lessons.some((p) => p.slug === l.slug && p.completed));

  return (
    <section className="p-5 panel rounded-[var(--radius)] flex flex-col @xl:flex-row @xl:items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center flex-shrink-0">
        {open ? <Orbit size={20} strokeWidth={1.75} /> : <Lock size={18} strokeWidth={1.75} />}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="m-0 text-[14px] font-semibold flex items-center gap-2">
          {t('nav.laniakea')} <BetaBadge hint={t('laniakea.betaHint')} />
        </h3>
        <p className="m-0 mt-1 text-[13px] text-[var(--text2)]">
          {open ? summary(t, state) : t('home.laniakea.locked', { count: LANIAKEA_UNLOCK_LESSONS })}
        </p>
        {!open && (
          <p className="m-0 mt-1 text-[12px] text-[var(--text3)]">
            {t('laniakea.locked.progress', { done, total: LANIAKEA_UNLOCK_LESSONS })}
          </p>
        )}
      </div>
      {open ? (
        <Link
          to="/laniakea"
          className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold no-underline text-center"
        >
          {t('home.laniakea.fly')}
        </Link>
      ) : (
        next && (
          <Link
            to={`/lesson/${LANIAKEA_COURSE}/${next.slug}`}
            className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text)] text-[13px] font-semibold no-underline text-center hover:bg-[var(--surface)]"
          >
            {t('laniakea.locked.next')}
          </Link>
        )
      )}
    </section>
  );
}

function summary(t: ReturnType<typeof useTranslation>['t'], state: LaniakeaState | null): string {
  if (!state) return t('home.laniakea.open');
  const now = Date.parse(state.serverNow);
  const statuses = state.planets.map((p) => statusOf(p, now));
  const owned = state.planets.filter((p) => p.level >= 1).length;
  const recaps = statuses.filter((s) => s === 'recap').length;
  const ready = statuses.filter((s) => s === 'conquerable').length;
  const parts = [t('home.laniakea.owned', { owned, total: state.planets.length })];
  if (recaps > 0) parts.push(t('home.laniakea.recaps', { count: recaps }));
  if (ready > 0) parts.push(t('home.laniakea.ready', { count: ready }));
  return parts.join(' · ');
}
