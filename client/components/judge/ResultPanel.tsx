import type { RunTestsResponse } from '../../../shared/tests';
import { Verdict } from './Verdict';
import { FailedCase } from './FailedCase';
import { Runtime } from './Runtime';

// The latest Run Tests verdict, shown in the lesson panel's Result tab. The
// judge stops at the first failing test, so that test is the one to show.
// `showRuntime`: only algorithm lessons are about speed; a course lesson only
// has to work, so it gets no timings.
export function ResultPanel({
  results,
  showRuntime,
}: {
  results: RunTestsResponse;
  showRuntime: boolean;
}) {
  const failedCase = results.cases.find((c) => !c.passed) ?? null;

  return (
    <div className="px-6 py-6 flex flex-col gap-7">
      <Verdict
        status={results.status}
        syntaxError={results.syntaxError}
        structureFailures={results.structureFailures}
        failedCase={failedCase}
        passedCount={results.passedCount}
        total={results.total}
      />
      {failedCase && <FailedCase result={failedCase} />}
      {showRuntime && (
        <Runtime
          cases={results.cases}
          runtimeMs={results.runtimeMs}
          referenceMs={results.referenceMs}
        />
      )}
    </div>
  );
}
