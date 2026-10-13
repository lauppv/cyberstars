import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Reveal } from './Reveal';
import { CONTENT_LICENSE_URL, LICENSE_URL } from './links';

const link = 'text-[var(--text)] underline underline-offset-2 hover:text-[var(--accent)]';

// Where Kenvo has its pricing: there's no price, so a band says what replaces
// it. The code and the lessons carry different licences, each named and linked.
export function FreeSection() {
  const { t } = useTranslation();
  const items = [
    t('landing.free.plan'),
    t('landing.free.card'),
    <a href={LICENSE_URL} target="_blank" rel="noreferrer" className={link}>
      BSD 3-Clause
    </a>,
    <a href={CONTENT_LICENSE_URL} target="_blank" rel="noreferrer" className={link}>
      CC BY-SA 4.0
    </a>,
  ];
  return (
    <section className="landing-wash">
      <Reveal className="max-w-[1120px] mx-auto px-4 sm:px-6 py-24 sm:py-28 text-center">
        <h2 className="text-[34px] sm:text-[48px] font-bold tracking-[-1px] leading-[1.05] m-0 mb-8 landing-gradient-text">
          {t('landing.free.title')}
        </h2>
        <ul className="m-0 p-0 list-none flex flex-wrap justify-center gap-x-8 gap-y-3 text-[15px] text-[var(--text2)]">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="text-[var(--accent)]"
              />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
