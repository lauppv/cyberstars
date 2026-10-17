import { useTranslation } from 'react-i18next';
import type { Question } from './checks';

// What the student did with a question's choices: picked one, by its place, or skipped them
export type Reply = number | 'skip';

// The words under every kind of visual: the question with its answer, which stay up while the
// move they announce plays; the first step tells in a few words how the algorithm works. A
// question with choices keeps its answer back until the student replies, then says whether the
// pick was right, or which choice was
export function Words({
  frame,
  live,
  big,
  reply,
}: {
  frame: { ask: string | null; question?: Question | null; caption: string };
  live: boolean;
  big: boolean;
  reply?: Reply;
}) {
  const { t } = useTranslation();
  const { question } = frame;
  const waiting = !!question && reply === undefined;
  const right = question && typeof reply === 'number' ? reply === question.answer : null;
  return (
    <div
      aria-live={live ? 'polite' : undefined}
      className={`text-[var(--text)] ${big ? 'text-[19px] min-h-[3.4em]' : 'text-[15px] min-h-[3.2em]'}`}
    >
      {frame.ask && <p className="font-semibold">{frame.ask}</p>}
      {question && right !== null && (
        <p
          data-result={right ? 'right' : 'wrong'}
          className={`font-semibold ${right ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}
        >
          {right
            ? t('lesson.visualRight')
            : t('lesson.visualWrong', { answer: question.choices[question.answer] })}
        </p>
      )}
      {!waiting && <p className={frame.ask ? 'text-[var(--text2)]' : ''}>{frame.caption}</p>}
    </div>
  );
}
