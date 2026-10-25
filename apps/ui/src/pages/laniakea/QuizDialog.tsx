import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Check, X } from 'lucide-react';
import {
  FOREVER_LEVEL,
  QUIZ_LENGTH,
  QUIZ_OUT,
  type QuizAnswer,
  type QuizAnswerResult,
  type QuizView,
} from '@cyberstars/shared/laniakea';
import * as laniakeaService from '../../services/laniakeaService';
import { formatWait } from './waitText';
import { withCode } from './codeText';
import { SendFeedback } from '../../components/support/SendFeedback';

const LETTERS = ['A', 'B', 'C', 'D'];

type Phase = 'loading' | 'failed' | 'asking' | 'done';

// The question as the student saw it, for a report about it
function asShown(question: QuizView['questions'][number], answer: QuizAnswer): string {
  return [
    question.text,
    question.code,
    question.output && `Output:\n${question.output}`,
    ...question.options.map(
      (o, i) =>
        `${LETTERS[i]}. ${o}${i === answer.correctChoice ? ' (right)' : ''}${i === answer.choice && !answer.correct ? ' (picked)' : ''}`,
    ),
  ]
    .filter(Boolean)
    .join('\n');
}

// A test on a planet: one question at a time, the right answer shown as soon
// as one is picked, over after the last question or the fifth wrong answer.
// Leaving it halfway keeps it on the server, so it opens again where it was.
export function QuizDialog({
  slug,
  title,
  lang,
  now,
  onClose,
}: {
  slug: string;
  title: string;
  lang: 'en' | 'ro';
  now: number;
  onClose: (result: QuizAnswerResult | null) => void;
}) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState('');
  const [view, setView] = useState<QuizView | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  // The question on screen: the one answered last while its answer shows
  const [shown, setShown] = useState(0);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<QuizAnswerResult | null>(null);
  const card = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    laniakeaService
      .startQuiz(slug, lang)
      .then((v) => {
        setView(v);
        setAnswers(v.answers);
        setShown(Math.min(v.answers.length, v.questions.length - 1));
        setPhase('asking');
      })
      .catch((err: Error) => {
        setError(err.message);
        setPhase('failed');
      });
  }, [slug, lang]);

  useEffect(open, [open]);
  useEffect(() => card.current?.focus(), [phase, shown]);

  const answered = answers[shown];
  const wrong = answers.filter((a) => !a.correct).length;
  const right = answers.length - wrong;
  const over = result !== null && result.status !== 'active';

  const choose = (choice: number) => {
    if (!view || answered || pending) return;
    setPending(true);
    setError('');
    laniakeaService
      .answerQuiz(slug, shown, choice)
      .then((r) => {
        setAnswers((list) => [
          ...list,
          { choice: r.choice, correct: r.correct, correctChoice: r.correctChoice },
        ]);
        setResult(r);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setPending(false));
  };

  const next = () => {
    if (over) setPhase('done');
    else if (answered) setShown((i) => i + 1);
  };

  const close = () => onClose(over ? result : null);

  const onKey = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (phase !== 'asking') {
      if (e.key === 'Enter' && phase === 'done') close();
      return;
    }
    const pick =
      '1234'.indexOf(e.key) >= 0 ? '1234'.indexOf(e.key) : 'abcd'.indexOf(e.key.toLowerCase());
    if (pick >= 0 && !answered) choose(pick);
    else if (e.key === 'Enter' && answered) next();
  };

  const question = view?.questions[shown];
  // A question about code, one asking for code that prints an output, or one
  // whose options are programs shows every option in the code font, so they all
  // read alike
  const codeOptions =
    !!question &&
    (question.code !== null ||
      question.output !== null ||
      question.options.some((o) => o.includes('\n')));
  const mode = view ? t(`laniakea.quiz.${view.mode}`) : '';

  return (
    <div className="lnk-quiz" role="dialog" aria-modal="true" aria-label={title}>
      <div
        ref={card}
        tabIndex={-1}
        onKeyDown={onKey}
        className="lnk-panel lnk-quiz-card outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="lnk-label">{mode}</div>
            <h2 className="m-0 text-[17px] font-semibold truncate">{title}</h2>
          </div>
          <button
            type="button"
            className="lnk-btn !h-8 !px-2"
            onClick={close}
            aria-label={t('laniakea.quiz.leave')}
          >
            <X size={16} />
          </button>
        </div>

        {phase === 'loading' && (
          <p className="mt-6 text-[13px] lnk-dim">{t('laniakea.quiz.loading')}</p>
        )}

        {phase === 'failed' && (
          <div className="mt-6">
            <p className="m-0 text-[14px] font-semibold">{t('laniakea.quiz.failed')}</p>
            <p role="alert" className="mt-1 text-[13px] lnk-dim">
              {error}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="lnk-btn"
                onClick={() => {
                  setPhase('loading');
                  open();
                }}
              >
                {t('laniakea.tryAgain')}
              </button>
              <button type="button" className="lnk-btn" onClick={close}>
                {t('laniakea.quiz.close')}
              </button>
            </div>
          </div>
        )}

        {phase === 'asking' && view && question && (
          <>
            <div className="lnk-progress" aria-hidden="true">
              {view.questions.map((_, i) => (
                <span
                  key={i}
                  className={
                    answers[i]
                      ? answers[i].correct
                        ? 'lnk-right'
                        : 'lnk-wrong'
                      : i === shown
                        ? 'lnk-now'
                        : undefined
                  }
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-[12px] lnk-dim mb-2">
              <span>{t('laniakea.quiz.question', { n: shown + 1, total: QUIZ_LENGTH })}</span>
              <span className="inline-flex items-center gap-3">
                <span className="inline-flex items-center gap-1 lnk-teal">
                  <Check size={13} /> {right}
                </span>
                <span className="inline-flex items-center gap-1" style={{ color: '#ff6b8a' }}>
                  <X size={13} /> {wrong}/{QUIZ_OUT}
                </span>
              </span>
            </div>
            <p className="lnk-question">{withCode(question.text)}</p>
            {question.code && <pre className="lnk-code">{question.code}</pre>}
            {question.output && (
              <>
                <div className="lnk-label mb-1">{t('laniakea.quiz.output')}</div>
                <pre className="lnk-code">{question.output}</pre>
              </>
            )}
            <ul className="lnk-options">
              {question.options.map((option, i) => {
                const state = !answered
                  ? ''
                  : i === answered.correctChoice
                    ? 'lnk-right'
                    : i === answered.choice
                      ? 'lnk-wrong'
                      : '';
                return (
                  <li key={i}>
                    <button
                      type="button"
                      className={`lnk-option ${state} ${codeOptions ? 'lnk-is-code' : ''}`}
                      disabled={!!answered || pending}
                      aria-pressed={answered ? answered.choice === i : undefined}
                      onClick={() => choose(i)}
                    >
                      <span className="lnk-letter">{LETTERS[i]}</span>
                      <span className="lnk-text">{withCode(option)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {error && (
              <p role="alert" className="m-0 mb-3 text-[13px]" style={{ color: '#ff6b8a' }}>
                {error}
              </p>
            )}
            {answered && (
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`lnk-verdict ${answered.correct ? 'lnk-teal' : ''}`}
                  style={answered.correct ? undefined : { color: '#ff6b8a' }}
                  role="status"
                >
                  {answered.correct ? <Check size={16} /> : <X size={16} />}
                  {t(answered.correct ? 'laniakea.quiz.right' : 'laniakea.quiz.wrong')}
                </span>
                <button type="button" className="lnk-btn lnk-btn-primary" onClick={next}>
                  {t(over ? 'laniakea.quiz.result' : 'laniakea.quiz.next')}
                </button>
              </div>
            )}
            {answered && (
              <div className="mt-4">
                <SendFeedback
                  key={shown}
                  look="laniakea"
                  prompt={t('feedback.question')}
                  subject={t('feedback.questionSubject', { planet: title, path: slug })}
                  context={asShown(question, answered)}
                />
              </div>
            )}
            {!answered && <p className="m-0 text-[11px] lnk-dim">{t('laniakea.quiz.leaveNote')}</p>}
          </>
        )}

        {phase === 'done' && result && (
          <Outcome result={result} title={title} now={now} right={right} wrong={wrong} />
        )}
        {phase === 'done' && (
          <button type="button" className="lnk-btn lnk-btn-primary mt-5" onClick={close}>
            {t('laniakea.quiz.close')}
          </button>
        )}
      </div>
    </div>
  );
}

function Outcome({
  result,
  title,
  now,
  right,
  wrong,
}: {
  result: QuizAnswerResult;
  title: string;
  now: number;
  right: number;
  wrong: number;
}) {
  const { t } = useTranslation();
  const planet = result.planet!;
  const wait = planet.nextRecapAt ? formatWait(t, Date.parse(planet.nextRecapAt) - now) : '';
  let heading: string;
  let body: string;
  let forever = false;
  if (result.status === 'failed') {
    heading = t('laniakea.quiz.outTitle');
    body = t('laniakea.quiz.outBody');
  } else if (result.leveledUp && planet.level >= FOREVER_LEVEL) {
    forever = true;
    heading = t('laniakea.quiz.foreverTitle');
    body = t('laniakea.quiz.foreverBody', { planet: title });
  } else if (result.leveledUp && planet.level === 1) {
    heading = t('laniakea.quiz.conqueredTitle');
    body = t('laniakea.quiz.conqueredBody', { wait });
  } else if (result.leveledUp) {
    heading = t('laniakea.quiz.recapTitle');
    body = t('laniakea.quiz.recapBody', { level: planet.level, total: FOREVER_LEVEL, wait });
  } else {
    heading = t('laniakea.quiz.practiceTitle');
    body =
      planet.level >= FOREVER_LEVEL
        ? t('laniakea.quiz.practiceForeverBody')
        : t('laniakea.quiz.practiceBody', { wait });
  }
  return (
    <div className="mt-5" role="status">
      {forever && <Award size={36} className="lnk-gold mb-2" />}
      <h3 className={`m-0 text-[20px] font-bold ${forever ? 'lnk-gold' : ''}`}>{heading}</h3>
      <p className="mt-2 mb-0 text-[14px] leading-relaxed lnk-dim">{body}</p>
      <p className="mt-3 mb-0 text-[12px] lnk-dim">{t('laniakea.quiz.score', { right, wrong })}</p>
    </div>
  );
}
