import { useTranslation } from 'react-i18next';
import { Layers, Download, ListChecks } from 'lucide-react';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

const POINTS = [
  ['tabs', Layers],
  ['install', Download],
  ['feedback', ListChecks],
] as const;

// What makes starting out hard, in the visitor's own words, before the page
// says how CyberStars answers it
export function ProblemSection() {
  const { t } = useTranslation();
  return (
    <section className="max-w-[1120px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <Reveal>
        <SectionHeading title={t('landing.problem.title')} />
      </Reveal>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 m-0 p-0 list-none">
        {POINTS.map(([key, Icon], i) => (
          <li key={key}>
            <Reveal delay={i * 80} className="panel h-full p-5">
              <Icon
                size={20}
                strokeWidth={1.75}
                aria-hidden="true"
                className="text-[var(--text3)] mb-3"
              />
              <h3 className="text-[15px] font-semibold m-0 mb-1.5">
                {t(`landing.problem.${key}.title`)}
              </h3>
              <p className="text-[14px] text-[var(--text2)] leading-relaxed m-0">
                {t(`landing.problem.${key}.text`)}
              </p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
