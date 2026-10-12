import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

const FAQ_KEYS = ['account', 'free', 'start', 'install', 'phone', 'romanian'] as const;

// One question open at a time. Each question is a real button carrying its
// expanded state, so the keyboard and screen readers work with nothing extra.
export function Faq() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="max-w-[760px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <Reveal>
        <SectionHeading title={t('landing.faq.title')} />
      </Reveal>
      <Reveal>
        <ul className="m-0 p-0 list-none border-t border-[var(--border)]">
          {FAQ_KEYS.map((key) => {
            const expanded = open === key;
            return (
              <li key={key} className="border-b border-[var(--border)]">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`faq-${key}`}
                    aria-expanded={expanded}
                    aria-controls={`faq-${key}-answer`}
                    onClick={() => setOpen(expanded ? null : key)}
                    className="w-full flex items-center justify-between gap-4 py-4 bg-transparent border-none text-left text-[15px] font-semibold text-[var(--text)] cursor-pointer hover:text-[var(--accent)]"
                  >
                    {t(`landing.faq.${key}.q`)}
                    <ChevronDown
                      size={18}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className={`flex-shrink-0 text-[var(--text3)] transition-transform motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-${key}-answer`}
                  role="region"
                  aria-labelledby={`faq-${key}`}
                  hidden={!expanded}
                  className="pb-4 pr-8 text-[14px] text-[var(--text2)] leading-relaxed"
                >
                  {t(`landing.faq.${key}.a`)}
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
