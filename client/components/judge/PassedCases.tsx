import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import type { TestCaseResult } from '../../../shared/tests';
import { CaseInput, Field } from './CaseFields';
import { caseLabel } from './format';

function Disclosure({
  title,
  strong,
  children,
}: {
  title: string;
  strong?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`-ml-1 flex items-center gap-1.5 px-1 py-1 rounded-[var(--radius-sm)] bg-transparent border-none text-left cursor-pointer hover:bg-[var(--glass)] transition ${strong ? 'text-[14px] font-semibold text-[var(--text)]' : 'text-[13px] text-[var(--text2)]'}`}
      >
        <ChevronRight
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={`shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
        />
        {title}
      </button>
      {open && <div className="pl-6 pt-2">{children}</div>}
    </div>
  );
}

// The tests a run passed, folded: one list, and each test opens on its input,
// the expected output and the student's.
export function PassedCases({ cases }: { cases: TestCaseResult[] }) {
  const { t } = useTranslation();
  const passed = cases.filter((c) => c.passed);
  if (passed.length === 0) return null;

  return (
    <section>
      <Disclosure title={t('tests.passedCases', { count: passed.length })} strong>
        <ul className="flex flex-col gap-1 list-none m-0 p-0">
          {passed.map((c) => (
            <li key={c.index}>
              <Disclosure title={caseLabel(c, t)}>
                <div className="flex flex-col gap-3 pb-2">
                  {c.load && (
                    <p className="m-0 text-[13px] text-[var(--text3)]">{t('tests.loadTooLarge')}</p>
                  )}
                  <CaseInput result={c} />
                  {c.expected !== undefined && (
                    <Field label={t('tests.expected')}>{c.expected || '∅'}</Field>
                  )}
                  {c.actual !== undefined && (
                    <Field label={t('tests.actual')}>{c.actual || '∅'}</Field>
                  )}
                </div>
              </Disclosure>
            </li>
          ))}
        </ul>
      </Disclosure>
    </section>
  );
}
