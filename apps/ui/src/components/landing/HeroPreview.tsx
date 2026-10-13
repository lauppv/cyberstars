import { useTranslation } from 'react-i18next';
import { Field } from '../judge/CaseFields';
import { CodeStill } from './CodeStill';

// An example from the Python lesson on lists and for (python/lists-for), word
// for word in each language, with the output the lesson prints under it. An
// example, not the mission: solutions are for signed-in students.
const EXAMPLE: Record<'en' | 'ro', { code: string; output: string }> = {
  en: {
    code: `names = ["Tommy", "Lance", "Cortez"]
for i in range(0, len(names)):
    print(f"Hero number {i + 1}: {names[i]}")`,
    output: 'Hero number 1: Tommy\nHero number 2: Lance\nHero number 3: Cortez',
  },
  ro: {
    code: `nume = ["Tommy", "Lance", "Cortez"]
for i in range(0, len(nume)):
    print(f"Erou numarul {i + 1}: {nume[i]}")`,
    output: 'Erou numarul 1: Tommy\nErou numarul 2: Lance\nErou numarul 3: Cortez',
  },
};

// A still of a lesson: the code in the editor and what it prints. Built from
// the app's own surfaces, so it keeps looking like the app after a restyle.
export function HeroPreview() {
  const { t, i18n } = useTranslation();
  const example = EXAMPLE[i18n.language === 'ro' ? 'ro' : 'en'];

  return (
    <div
      role="img"
      aria-label={t('landing.hero.preview.label')}
      className="panel overflow-hidden text-left"
    >
      <CodeStill code={example.code} />
      <div className="p-4 border-t border-[var(--border)]">
        <Field label={t('code.output')}>{example.output}</Field>
      </div>
    </div>
  );
}
