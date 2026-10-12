import { useTranslation } from 'react-i18next';
import { Topbar } from '../components/layout/Topbar';

export function RulesPage() {
  const { t } = useTranslation();
  const rules = t('rules.items', { returnObjects: true }) as { title: string; desc: string }[];
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="w-full max-w-[600px]">
          <div className="flex flex-col gap-4">
            {rules.map((rule, i) => (
              <div key={i} className="panel flex gap-4 p-4">
                <div className="w-7 h-7 rounded-full bg-[var(--surface2)] flex items-center justify-center text-[12px] font-bold text-[var(--accent)] flex-shrink-0 border border-[var(--border)]">
                  {i + 1}
                </div>
                <div>
                  <div className="text-[14px] font-semibold mb-0.5">{rule.title}</div>
                  <div className="text-[12px] text-[var(--text2)] leading-relaxed">{rule.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="panel mt-6 p-4">
            <div className="text-[14px] font-semibold mb-1">{t('rules.radioPrivacyTitle')}</div>
            <div className="text-[12px] text-[var(--text2)] leading-relaxed">
              {t('rules.radioPrivacyDesc')}
            </div>
          </div>
          <div className="panel mt-4 p-4">
            <div className="text-[14px] font-semibold mb-1">{t('rules.aiPrivacyTitle')}</div>
            <div className="text-[12px] text-[var(--text2)] leading-relaxed">
              {t('rules.aiPrivacyDesc')}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
