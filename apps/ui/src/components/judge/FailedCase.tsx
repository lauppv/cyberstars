import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TestCaseResult, TestComparator } from '@cyberstars/shared/tests';
import { CaseInput, Field } from './CaseFields';
import { caseLabel } from './format';
import { diffOutputs, type Piece } from './outputDiff';

// One output with its differing runs marked. A marked empty line (a blank line
// the other output lacks) still shows as a sliver.
function MarkedLines({ lines, mark }: { lines: Piece[][]; mark: string }) {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && '\n'}
      {line.map((piece, j) =>
        piece.marked ? (
          <mark key={j} className={`${mark} text-inherit rounded-[2px]`}>
            {piece.text || ' '}
          </mark>
        ) : (
          <Fragment key={j}>{piece.text}</Fragment>
        ),
      )}
    </Fragment>
  ));
}

// The test a run stopped on. A hidden test shows what went in and what came
// out, never what was expected, so it can't be read off and hardcoded.
// `comparator`: a visible test's outputs get their difference marked only when
// the lesson compares them as text; one that ignores numbers or line order
// would show a difference that didn't fail the test.
export function FailedCase({
  result,
  comparator,
}: {
  result: TestCaseResult;
  comparator?: TestComparator;
}) {
  const { t } = useTranslation();
  const { visible, expected, actual, error } = result;
  const diff = useMemo(
    () =>
      (comparator === 'trimmed' || comparator === 'exact') &&
      visible &&
      !error &&
      expected !== undefined &&
      actual !== undefined
        ? diffOutputs(expected, actual)
        : null,
    [comparator, visible, error, expected, actual],
  );

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] font-semibold text-[var(--text)] m-0">{caseLabel(result, t)}</h3>
      {result.load && (
        <p className="m-0 text-[13px] text-[var(--text3)]">{t('tests.loadTooLarge')}</p>
      )}
      <CaseInput result={result} />
      {error === 'timeout' ? (
        <p className="m-0 text-[13px] text-[var(--error)]">{t('tests.timeout')}</p>
      ) : error ? (
        <Field label={t('tests.runtimeError')} tone="text-[var(--error)]">
          {error}
        </Field>
      ) : (
        <>
          {visible && expected !== undefined && (
            <Field label={t('tests.expected')}>
              {diff ? (
                <MarkedLines lines={diff.expected} mark="bg-[var(--diff-missing)]" />
              ) : (
                expected
              )}
            </Field>
          )}
          {actual !== undefined && (
            <Field label={t('tests.actual')}>
              {diff && actual ? (
                <MarkedLines lines={diff.actual} mark="bg-[var(--diff-wrong)]" />
              ) : (
                actual || '∅'
              )}
            </Field>
          )}
        </>
      )}
    </section>
  );
}
