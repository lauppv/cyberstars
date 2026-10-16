import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { CodeStill } from '../components/landing/CodeStill';
import { PLACEMENT_QUESTIONS, type PlacementQuestion } from '../constants/placement';
import { savePlacementScore } from '../services/placementScore';

const TOTAL = PLACEMENT_QUESTIONS.length;

const PRIMARY =
  'px-6 py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
const SECONDARY =
  'px-6 py-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm font-semibold hover:border-[var(--accent)] transition cursor-pointer';

function useQuestion(question: PlacementQuestion) {
  const { t } = useTranslation();
  return {
    text: t(`placement.questions.${question.id}.q`),
    options: t(`placement.questions.${question.id}.options`, { returnObjects: true }) as string[],
  };
}

function Heading({ question }: { question: PlacementQuestion }) {
  const { text } = useQuestion(question);
  return (
    <>
      <p className="m-0 mb-1 text-[12px] font-semibold text-[var(--accent)]">{question.topic}</p>
      <h2 className="m-0 mb-4 text-lg font-semibold">{text}</h2>
      {question.code && (
        <div className="panel overflow-hidden mb-4">
          <CodeStill code={question.code} />
        </div>
      )}
    </>
  );
}

function Ask({
  question,
  picked,
  onPick,
}: {
  question: PlacementQuestion;
  picked: number | undefined;
  onPick: (option: number) => void;
}) {
  const { options } = useQuestion(question);
  return (
    <div className="flex flex-col gap-2">
      {options.map((option, i) => (
        <button
          key={i}
          type="button"
          aria-pressed={picked === i}
          onClick={() => onPick(i)}
          className={`px-4 py-3 rounded-[var(--radius-sm)] border text-left text-sm cursor-pointer transition ${
            picked === i
              ? 'border-[var(--accent)] bg-[var(--surface2)] text-[var(--text)]'
              : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text3)]'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

// A question after Submit: the right option in green and, when the student
// picked another one, theirs in red. Each is named too, not only coloured.
function Reviewed({ question, picked }: { question: PlacementQuestion; picked: number }) {
  const { t } = useTranslation();
  const { options } = useQuestion(question);
  return (
    <li className="panel p-5">
      <Heading question={question} />
      <ul className="m-0 p-0 list-none flex flex-col gap-2">
        {options.map((option, i) => {
          const right = i === question.correct;
          const wrong = i === picked && !right;
          return (
            <li
              key={i}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--radius-sm)] border text-sm ${
                right
                  ? 'border-[var(--success)] bg-[var(--diff-missing)] text-[var(--text)]'
                  : wrong
                    ? 'border-[var(--error)] bg-[var(--diff-wrong)] text-[var(--text)]'
                    : 'border-[var(--border)] text-[var(--text3)]'
              }`}
            >
              <span>{option}</span>
              {(right || wrong) && (
                <span className="flex items-center gap-1 text-[12px] font-semibold flex-shrink-0">
                  {right ? (
                    <Check size={14} aria-hidden="true" />
                  ) : (
                    <X size={14} aria-hidden="true" />
                  )}
                  {i === picked ? t('placement.result.yours') : t('placement.result.correct')}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
}

// The landing page's placement test (CYB-68). Nothing tells right from wrong
// until Submit; then every question shows with its answers and the score.
export function PlacementPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<'intro' | number | 'result'>('intro');
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);

  const score = PLACEMENT_QUESTIONS.filter((q, i) => answers[i] === q.correct).length;

  const submit = () => {
    savePlacementScore(score);
    setStep('result');
    window.scrollTo(0, 0);
  };

  const getStarted = (
    <div className="panel p-6 text-center">
      <p className="m-0 mb-4 text-[var(--text2)]">{t('placement.result.ctaText')}</p>
      <button
        type="button"
        data-track="placement-get-started"
        onClick={() => navigate('/getstarted', { state: { mode: 'signup' } })}
        className={PRIMARY}
      >
        {t('placement.result.cta')}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <LandingNav />
      <main className="landing-glow flex-1">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {step === 'intro' && (
            <div className="panel p-6 sm:p-8">
              <h1 className="m-0 mb-4 text-[28px] sm:text-[34px] font-bold tracking-[-0.5px] leading-tight">
                {t('placement.title')}
              </h1>
              <p className="m-0 mb-3 text-[var(--text2)] leading-relaxed">{t('placement.intro')}</p>
              <p className="m-0 mb-6 text-[13px] text-[var(--text3)]">{t('placement.meta')}</p>
              <button
                type="button"
                data-track="placement-start"
                onClick={() => setStep(0)}
                className={PRIMARY}
              >
                {t('placement.start')}
              </button>
            </div>
          )}

          {typeof step === 'number' && (
            <div className="panel p-6 sm:p-8">
              <p className="m-0 mb-2 text-[13px] text-[var(--text3)]">
                {t('placement.progress', { n: step + 1, total: TOTAL })}
              </p>
              <div className="h-1 mb-6 rounded-full bg-[var(--surface2)] overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] transition-[width]"
                  style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
                />
              </div>
              <Heading question={PLACEMENT_QUESTIONS[step]} />
              <Ask
                question={PLACEMENT_QUESTIONS[step]}
                picked={answers[step]}
                onPick={(option) =>
                  setAnswers((all) => {
                    const next = [...all];
                    next[step] = option;
                    return next;
                  })
                }
              />
              <div className="flex justify-between gap-3 mt-6">
                {step > 0 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className={SECONDARY}>
                    {t('placement.back')}
                  </button>
                ) : (
                  <span />
                )}
                {step < TOTAL - 1 ? (
                  <button
                    type="button"
                    data-track={`placement-q${step + 1}`}
                    disabled={answers[step] === undefined}
                    onClick={() => setStep(step + 1)}
                    className={PRIMARY}
                  >
                    {t('placement.next')}
                  </button>
                ) : (
                  <button
                    type="button"
                    data-track="placement-submit"
                    disabled={answers[step] === undefined}
                    onClick={submit}
                    className={PRIMARY}
                  >
                    {t('placement.submit')}
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="flex flex-col gap-4">
              <div className="panel p-6 sm:p-8 text-center">
                <h1 className="m-0 mb-2 text-lg font-semibold">{t('placement.result.title')}</h1>
                <p className="m-0 mb-3 text-[48px] font-bold tracking-[-1px] leading-none">
                  {score}/{TOTAL}
                </p>
                <p className="m-0 text-[var(--text2)]">{t('placement.result.text')}</p>
              </div>
              {getStarted}
              <ol className="m-0 p-0 list-none flex flex-col gap-4">
                {PLACEMENT_QUESTIONS.map((question, i) => (
                  <Reviewed key={question.id} question={question} picked={answers[i] ?? -1} />
                ))}
              </ol>
              {getStarted}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
