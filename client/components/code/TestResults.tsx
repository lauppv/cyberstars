import type { SubmitResult } from '../../../shared/tests';

interface TestResultsProps {
  result: SubmitResult;
}

export function TestResults({ result }: TestResultsProps) {
  return (
    <div
      className="p-4 bg-[#0d1117] rounded border border-[#1e2a38] shadow-inner overflow-auto"
      style={{ maxHeight: '300px' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-lg">
          {result.allPassed ? (
            <span className="text-green-400">All tests passed!</span>
          ) : (
            <span className="text-red-400">
              Tests: {result.passed}/{result.total}
            </span>
          )}
        </span>
        <span
          className={`text-sm font-mono px-2 py-1 rounded ${result.allPassed ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}
        >
          {result.passed}/{result.total}
        </span>
      </div>

      <div className="space-y-2">
        {result.results.map((test, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 p-2 rounded text-sm font-mono ${
              test.passed
                ? 'bg-green-900/20 border border-green-800/30'
                : 'bg-red-900/20 border border-red-800/30'
            }`}
          >
            <span className="mt-0.5">{test.passed ? '✅' : '❌'}</span>
            <div className="flex-1 min-w-0">
              <div className={test.passed ? 'text-green-300' : 'text-red-300'}>{test.name}</div>
              {!test.passed && (
                <div className="mt-1 text-xs text-[#6a7a8a]">
                  <div>
                    Expected: <span className="text-yellow-300/70">{test.expected}</span>
                  </div>
                  <div>
                    Got: <span className="text-red-300/70">{test.actual}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
