import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PanelTabs } from '../judge/PanelTabs';
import { AnnouncementSection } from './AnnouncementSection';
import { PollSection } from './PollSection';

type Notice = 'announcements' | 'polls';

// Announcements and polls in one card, a tab each. Both stay on the page, only
// hidden, so one half written is still there after a look at the other
export function NoticesSection({ className }: { className: string }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Notice>('announcements');
  const tabs = [
    { key: 'announcements' as const, label: t('admin.notices.announcements') },
    { key: 'polls' as const, label: t('admin.notices.polls') },
  ];
  return (
    <section className={className}>
      <PanelTabs
        tabs={tabs}
        active={tab}
        onSelect={setTab}
        aria-label={t('admin.notices.label')}
        className="mb-4"
      />
      <div role="tabpanel" aria-label={tabs[0].label} hidden={tab !== 'announcements'}>
        <AnnouncementSection className="" />
      </div>
      <div role="tabpanel" aria-label={tabs[1].label} hidden={tab !== 'polls'}>
        <PollSection className="" />
      </div>
    </section>
  );
}
