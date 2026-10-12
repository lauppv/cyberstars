import { useTranslation } from 'react-i18next';
import { Verdict } from '../judge/Verdict';

// The Flight Report mission (python/print-f) as a student would solve it, in
// each language's own lesson, and the size of its real test suite. The mission
// already spells out the three lines, so this gives nothing away.
const CODE: Record<'en' | 'ro', string> = {
  en: `pilot = "Shadow"
ship_name = "Orion"
fuel = 400
speed = 7.5

print(f"Pilot {pilot} is flying {ship_name}")
print(f"Fuel: {fuel} units")
print(f"Speed: {speed} km/s")`,
  ro: `pilot = "Shadow"
nume_nava = "Orion"
combustibil = 400
viteza = 7.5

print(f"Pilotul {pilot} piloteaza {nume_nava}")
print(f"Combustibil: {combustibil} unitati")
print(f"Viteza: {viteza} km/s")`,
};
const TESTS = 32;

// oneDark, the editor's own theme, so the picture reads like the real editor
// without loading CodeMirror on the landing page
const BUILTINS = new Set(['print']);
const TOKEN = /(f?"[^"]*")|(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|(\s+|.)/g;

function color(token: string, kind: 'string' | 'number' | 'word' | 'other'): string | undefined {
  if (kind === 'string') return '#98c379';
  if (kind === 'number') return '#d19a66';
  if (kind === 'word' && BUILTINS.has(token)) return '#61afef';
  return undefined;
}

function Line({ text }: { text: string }) {
  const parts = [...text.matchAll(TOKEN)].map((m, i) => {
    const kind = m[1] ? 'string' : m[2] ? 'number' : m[3] ? 'word' : 'other';
    const c = color(m[0], kind);
    return c ? (
      <span key={i} style={{ color: c }}>
        {m[0]}
      </span>
    ) : (
      m[0]
    );
  });
  return <>{parts}</>;
}

// A still of a lesson: the mission, the student's code in the editor, and the
// judge's verdict after Run Tests. Built from the app's own surfaces and its
// real Verdict, so it keeps looking like the app after a restyle.
export function HeroPreview() {
  const { t, i18n } = useTranslation();
  const lines = CODE[i18n.language === 'ro' ? 'ro' : 'en'].split('\n');

  return (
    <div
      role="img"
      aria-label={t('landing.hero.preview.label')}
      className="panel overflow-hidden text-left"
    >
      <div className="h-9 px-4 flex items-center border-b border-[var(--border)] text-[12px] text-[var(--text3)]">
        {t('landing.hero.preview.breadcrumb')}
      </div>

      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="text-[14px] font-semibold mb-1">{t('landing.hero.preview.mission')}</div>
        <p className="text-[12.5px] leading-relaxed text-[var(--text2)] m-0">
          {t('landing.hero.preview.task')}
        </p>
      </div>

      <pre className="m-0 py-3 overflow-x-auto font-mono text-[10.5px] min-[400px]:text-[11px] sm:text-[12px] leading-[1.6] text-[#abb2bf]">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="w-7 sm:w-9 pr-2 sm:pr-3 text-right text-[var(--text3)] select-none flex-shrink-0">
              {i + 1}
            </span>
            <span className="whitespace-pre">
              <Line text={line} />
            </span>
          </div>
        ))}
      </pre>

      <div className="p-4 border-t border-[var(--border)]">
        <Verdict
          status="passed"
          structureFailures={[]}
          failedCase={null}
          passedCount={TESTS}
          total={TESTS}
        />
      </div>
    </div>
  );
}
