import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, CircleCheck, CircleX } from 'lucide-react';
import type { SubmissionDetail, SubmissionSummary } from '../../../shared/tests';
import * as testsService from '../../services/testsService';
import { CodeEditor } from '../code/CodeEditor';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Verdict } from './Verdict';
import { FailedCase } from './FailedCase';
import { Runtime } from './Runtime';
import { formatMs, timeAgo } from './format';

// Fixed widths so every row lines up with the header above it.
// The runtime column only shows on algorithm lessons.
const columns = (showRuntime: boolean) =>
  `${showRuntime ? 'grid-cols-[1fr_4rem_4.5rem_5.5rem]' : 'grid-cols-[1fr_4rem_5.5rem]'} gap-x-3`;

interface SubmissionsPanelProps {
  // Language key for the read-only editor (the lesson's course key).
  language: string;
  // Algorithm lessons show runtimes; course lessons only have to work.
  showRuntime: boolean;
  // Null until the history has been fetched.
  list: SubmissionSummary[] | null;
  failed: boolean;
  onLoad: () => void;
  onRetry: () => void;
  onLoadCode: (code: string) => void;
}

// The signed-in student's attempts on this lesson: a list, newest first, and
// one attempt opened with the code that was judged.
export function SubmissionsPanel({
  language,
  showRuntime,
  list,
  failed,
  onLoad,
  onRetry,
  onLoadCode,
}: SubmissionsPanelProps) {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<number | null>(null);

  // Fetch on first open; afterwards the page keeps the list current.
  useEffect(() => {
    if (list === null && !failed) onLoad();
  }, [list, failed, onLoad]);

  if (openId !== null) {
    return (
      <SubmissionView
        key={openId}
        id={openId}
        language={language}
        showRuntime={showRuntime}
        onBack={() => setOpenId(null)}
        onLoadCode={onLoadCode}
      />
    );
  }

  if (failed) {
    return (
      <div className="px-6 py-6 text-[13px] text-[var(--text2)]">
        <p>{t('tests.submissions.loadError')}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[13px] font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition cursor-pointer"
        >
          {t('tests.submissions.retry')}
        </button>
      </div>
    );
  }

  if (list === null) return <LoadingSpinner />;

  if (list.length === 0) {
    return (
      <p className="px-6 py-6 text-[13px] text-[var(--text2)]">{t('tests.submissions.empty')}</p>
    );
  }

  return (
    <div className="px-3 py-4">
      <div className={`grid ${columns(showRuntime)} px-3 pb-2 text-[12px] text-[var(--text3)]`}>
        <span>{t('tests.submissions.status')}</span>
        <span className="text-right">{t('tests.submissions.passed')}</span>
        {showRuntime && <span className="text-right">{t('tests.submissions.runtime')}</span>}
        <span className="text-right">{t('tests.submissions.when')}</span>
      </div>
      <ul className="flex flex-col list-none m-0 p-0">
        {list.map((s) => (
          <li key={s.id}>
            <SubmissionRow
              submission={s}
              showRuntime={showRuntime}
              onOpen={() => setOpenId(s.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusLabel({ status }: { status: 'passed' | 'failed' }) {
  const { t } = useTranslation();
  const passed = status === 'passed';
  const Icon = passed ? CircleCheck : CircleX;
  return (
    <span
      className={`flex items-center gap-1.5 font-semibold ${passed ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}
    >
      <Icon size={15} strokeWidth={2} aria-hidden="true" />
      {t(passed ? 'tests.verdict.accepted' : 'tests.verdict.failed')}
    </span>
  );
}

function SubmissionRow({
  submission: s,
  showRuntime,
  onOpen,
}: {
  submission: SubmissionSummary;
  showRuntime: boolean;
  onOpen: () => void;
}) {
  const { t, i18n } = useTranslation();
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`w-full grid ${columns(showRuntime)} items-center px-3 py-2.5 rounded-[var(--radius-sm)] text-left text-[13px] bg-transparent border-none hover:bg-[var(--glass)] transition cursor-pointer`}
    >
      <StatusLabel status={s.status} />
      <span className="text-right text-[var(--text)] tabular-nums">
        {s.passedCount} / {s.total}
      </span>
      {showRuntime && (
        <span className="text-right text-[var(--text2)] tabular-nums">
          {s.runtimeMs === null ? '—' : `${formatMs(s.runtimeMs, i18n.language)} ms`}
        </span>
      )}
      <span className="text-right text-[var(--text3)] tabular-nums">{timeAgo(s.createdAt, t)}</span>
    </button>
  );
}

function SubmissionView({
  id,
  language,
  showRuntime,
  onBack,
  onLoadCode,
}: {
  id: number;
  language: string;
  showRuntime: boolean;
  onBack: () => void;
  onLoadCode: (code: string) => void;
}) {
  const { t } = useTranslation();
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    testsService.getSubmission(id).then(setDetail, () => setFailed(true));
  }, [id]);

  return (
    <div className="px-6 py-5 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="-ml-2 flex items-center gap-1 px-2 py-1 rounded-[var(--radius-sm)] text-[13px] text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--glass)] bg-transparent border-none transition cursor-pointer"
        >
          <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
          {t('tests.submissions.back')}
        </button>
        {detail && (
          <span className="text-[12px] text-[var(--text3)]">{timeAgo(detail.createdAt, t)}</span>
        )}
      </div>

      {failed ? (
        <p className="text-[13px] text-[var(--text2)]">{t('tests.submissions.loadError')}</p>
      ) : !detail ? (
        <LoadingSpinner />
      ) : (
        <>
          <Verdict
            status={detail.status}
            syntaxError={detail.syntaxError}
            structureFailures={detail.structureFailures}
            failedCase={detail.failedCase}
            passedCount={detail.passedCount}
            total={detail.total}
          />
          {detail.failedCase && <FailedCase result={detail.failedCase} />}
          {showRuntime && <Runtime runtimeMs={detail.runtimeMs} referenceMs={detail.referenceMs} />}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[14px] font-semibold text-[var(--text)]">
                {t('tests.submissions.code')}
              </h3>
              <button
                type="button"
                onClick={() => onLoadCode(detail.code)}
                className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[13px] font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition cursor-pointer"
              >
                {t('tests.submissions.loadCode')}
              </button>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[rgba(13,17,23,0.3)] overflow-auto">
              <CodeEditor value={detail.code} language={language} fontSize="13px" readOnly />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
