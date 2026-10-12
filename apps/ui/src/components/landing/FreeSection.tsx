import { useTranslation, Trans } from 'react-i18next';
import { Gift, CreditCard, Code } from 'lucide-react';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { CONTENT_LICENSE_URL, LICENSE_URL } from './links';

const link = 'text-[var(--text)] underline underline-offset-2 hover:text-[var(--accent)]';

// Where Kenvo has its pricing: there's no price, so the slot says what
// replaces it. The code and the lessons carry different licences, and each is
// named and linked on its own.
export function FreeSection() {
  const { t } = useTranslation();
  const points = [
    ['plan', Gift, t('landing.free.plan.text')],
    ['card', CreditCard, t('landing.free.card.text')],
    [
      'open',
      Code,
      <Trans
        key="open"
        i18nKey="landing.free.open.text"
        components={{
          code: <a href={LICENSE_URL} target="_blank" rel="noreferrer" className={link} />,
          content: (
            <a href={CONTENT_LICENSE_URL} target="_blank" rel="noreferrer" className={link} />
          ),
        }}
      />,
    ],
  ] as const;

  return (
    <section className="max-w-[1120px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <Reveal>
        <SectionHeading title={t('landing.free.title')}>
          {t('landing.free.subtitle')}
        </SectionHeading>
      </Reveal>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 m-0 p-0 list-none">
        {points.map(([key, Icon, text], i) => (
          <li key={key}>
            <Reveal delay={i * 80} className="panel h-full p-5">
              <Icon
                size={20}
                strokeWidth={1.75}
                aria-hidden="true"
                className="text-[var(--text3)] mb-3"
              />
              <h3 className="text-[15px] font-semibold m-0 mb-1.5">
                {t(`landing.free.${key}.title`)}
              </h3>
              <p className="text-[14px] text-[var(--text2)] leading-relaxed m-0">{text}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
