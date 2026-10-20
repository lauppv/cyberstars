import { api } from './apiClient';
import type {
  RunTestsResponse,
  SubmissionDetail,
  SubmissionSummary,
} from '@cyberstars/shared/tests';
import type { CodeLanguage } from '@cyberstars/shared/constants';

// `language` is the one on screen on a multi-language course. `runId` names
// the run, so the page can ask whether it's waiting for a sandbox.
export function runTests(
  courseKey: string,
  lessonSlug: string,
  code: string,
  lang: string,
  language?: CodeLanguage,
  runId?: string,
): Promise<RunTestsResponse> {
  return api.post<RunTestsResponse>(
    `/api/tests/${courseKey}/${lessonSlug}/run`,
    { code, lang, ...(language && { language }) },
    runId ? { headers: { 'X-Run-Id': runId } } : undefined,
  );
}

/** The signed-in student's judge attempts on a lesson, newest first. */
export function listSubmissions(
  courseKey: string,
  lessonSlug: string,
): Promise<SubmissionSummary[]> {
  return api.get<SubmissionSummary[]>(`/api/tests/${courseKey}/${lessonSlug}/submissions`);
}

/** One stored attempt with its code; only its owner can read it. */
export function getSubmission(id: number): Promise<SubmissionDetail> {
  return api.get<SubmissionDetail>(`/api/tests/submissions/${id}`);
}
