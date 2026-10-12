import { useTranslation } from 'react-i18next';
import { Verdict } from '../judge/Verdict';
import { CodeStill } from './CodeStill';

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

// A still of a lesson: the mission, the student's code in the editor, and the
// judge's verdict after Run Tests. Built from the app's own surfaces and its
// real Verdict, so it keeps looking like the app after a restyle.
export function HeroPreview() {
  const { t, i18n } = useTranslation();

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

      <CodeStill code={CODE[i18n.language === 'ro' ? 'ro' : 'en']} />

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
