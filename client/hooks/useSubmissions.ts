import { useCallback, useState } from 'react';
import * as testsService from '../services/testsService';
import type { SubmissionSummary } from '../../shared/tests';

// The server keeps this many attempts per lesson, newest first.
const HISTORY_CAP = 20;

interface State {
  key: string;
  list: SubmissionSummary[] | null;
  failed: boolean;
}

// A lesson's submission history, fetched once when first asked for and then
// kept current by adding each new run's stored attempt on top. State is
// tagged with its lesson, so a reply that lands after a lesson switch is
// never shown on the next lesson.
export function useSubmissions(courseKey: string, lessonSlug: string) {
  const key = `${courseKey}/${lessonSlug}`;
  const [state, setState] = useState<State>({ key, list: null, failed: false });
  const current = state.key === key ? state : { key, list: null, failed: false };

  const load = useCallback(() => {
    testsService.listSubmissions(courseKey, lessonSlug).then(
      (list) => setState({ key, list, failed: false }),
      () => setState({ key, list: null, failed: true }),
    );
  }, [courseKey, lessonSlug, key]);

  // Clears the failure; whoever shows the list then asks for it again.
  const retry = useCallback(() => setState({ key, list: null, failed: false }), [key]);

  const add = useCallback(
    (submission: SubmissionSummary) =>
      setState((prev) =>
        prev.key === key && prev.list
          ? {
              ...prev,
              list: [submission, ...prev.list.filter((s) => s.id !== submission.id)].slice(
                0,
                HISTORY_CAP,
              ),
            }
          : prev,
      ),
    [key],
  );

  return { list: current.list, failed: current.failed, load, retry, add };
}
