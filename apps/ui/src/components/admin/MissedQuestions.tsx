import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import {
  LANIAKEA_COURSE,
  MISSED_MIN_ANSWERS,
  type MissedQuestion,
} from '@cyberstars/shared/laniakea';
import { getMissedQuestions } from '../../services/adminService';
import { usePlanetNames } from '../laniakea/usePlanetNames';
import { withCode } from '../../pages/laniakea/codeText';

const CODE_CLS =
  'm-0 mb-2 p-2.5 rounded-[var(--radius-sm)] bg-[var(--glass)] font-mono text-[12px] whitespace-pre-wrap break-words';

const share = (n: number, of: number) => `${Math.round((n / of) * 100)}%`;

function Question({ q, planet }: { q: MissedQuestion; planet: string }) {
  const { t } = useTranslation();
  // As in the game: a question about code, or whose options are programs,
  // shows every option in the code font
  const codeOptions =
    q.code !== null || q.output !== null || q.options.some((o) => o.includes('\n'));
  return (
    <li className="pt-4 border-t border-[var(--border)] first:pt-0 first:border-t-0">
      <div className="flex justify-between gap-3 mb-2 text-[12px]">
        <span className="text-[var(--text3)] truncate">
          {planet} · {q.id}
        </span>
        <span className="text-[var(--error)] tabular-nums shrink-0">
          {t('admin.missed.wrong', { count: q.wrong, answered: q.answered })} ·{' '}
          {share(q.wrong, q.answered)}
        </span>
      </div>
      <p className="m-0 mb-2 text-[13px] text-[var(--text)]">{withCode(q.text)}</p>
      {q.code && <pre className={CODE_CLS}>{q.code}</pre>}
      {q.output && (
        <>
          <div className="text-[11px] text-[var(--text3)] mb-1">{t('laniakea.quiz.output')}</div>
          <pre className={CODE_CLS}>{q.output}</pre>
        </>
      )}
      <ul className="m-0 p-0 list-none flex flex-col gap-1 text-[12px]">
        {q.options.map((option, k) => (
          <li key={k} className="flex justify-between items-start gap-3">
            <span
              className={`flex gap-1.5 min-w-0 ${k === q.answer ? 'text-[var(--success)]' : 'text-[var(--text2)]'}`}
            >
              <span className="w-3.5 shrink-0 pt-0.5">
                {k === q.answer && <Check size={13} aria-label={t('admin.missed.right')} />}
              </span>
              <span className={codeOptions ? 'font-mono whitespace-pre-wrap break-words' : ''}>
                {withCode(option)}
              </span>
            </span>
            <span className="text-[var(--text3)] tabular-nums shrink-0">
              {q.picks[k]} · {share(q.picks[k], q.answered)}
            </span>
          </li>
        ))}
      </ul>
    </li>
  );
}

// The Laniakea questions students miss most, a bad question more often than a
// hard one, each with how often every option was picked
export function MissedQuestions({ className, reload }: { className: string; reload: number }) {
  const { t, i18n } = useTranslation();
  const { titles } = usePlanetNames(LANIAKEA_COURSE);
  const [list, setList] = useState<MissedQuestion[] | null>(null);
  const [failed, setFailed] = useState(false);
  const lang = i18n.language === 'ro' ? 'ro' : 'en';

  useEffect(() => {
    let current = true;
    getMissedQuestions(lang)
      .then((questions) => {
        if (!current) return;
        setList(questions);
        setFailed(false);
      })
      .catch(() => {
        if (current) setFailed(true);
      });
    return () => {
      current = false;
    };
  }, [lang, reload]);

  return (
    <section className={className}>
      <h2 className="text-[14px] font-semibold mb-1">{t('admin.missed.title')}</h2>
      <p className="mt-0 mb-4 text-[12px] text-[var(--text3)]">
        {t('admin.missed.hint', { count: MISSED_MIN_ANSWERS })}
      </p>
      {failed && (
        <p role="alert" className="mt-0 mb-4 text-[12px] text-[var(--error)]">
          {t('admin.loadError')}
        </p>
      )}
      {list?.length === 0 && (
        <span className="text-[12px] text-[var(--text3)]">
          {t('admin.missed.none', { count: MISSED_MIN_ANSWERS })}
        </span>
      )}
      {list && list.length > 0 && (
        <ol className="m-0 p-0 list-none flex flex-col gap-4">
          {list.map((q) => (
            <Question key={`${q.slug}/${q.id}`} q={q} planet={titles.get(q.slug) ?? q.slug} />
          ))}
        </ol>
      )}
    </section>
  );
}
