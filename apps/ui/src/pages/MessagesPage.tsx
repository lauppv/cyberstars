import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessagesContext';
import { Topbar } from '../components/layout/Topbar';
import { PageHeader } from '../components/layout/PageHeader';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { LoadError } from '../components/ui/LoadError';
import { ConversationList } from '../components/messages/ConversationList';
import { MessageThread } from '../components/messages/MessageThread';
import { canAccessFeature } from '@cyberstars/shared/features';
import { MessageSquare } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';

export function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const { conversations, loading, loadFailed, refresh } = useMessages();
  const canAccess = canAccessFeature('messaging', user?.role, import.meta.env.PROD);

  // Deep-link from a DM notification: /messages with { openConversationId }.
  const deepLinkId =
    (location.state as { openConversationId?: number } | null)?.openConversationId ?? null;
  const [selectedId, setSelectedId] = useState<number | null>(deepLinkId);

  // Re-apply the deep-link on every navigation (location.key changes even when
  // the target conversation id is the same), since an initializer alone would ignore
  // clicks made while this page is already mounted.
  useEffect(() => {
    if (deepLinkId != null) setSelectedId(deepLinkId); // eslint-disable-line react-hooks/set-state-in-effect
  }, [deepLinkId, location.key]);

  // Client-side guard is UX only; /api/messages is server-authoritative.
  useEffect(() => {
    if (authLoading) return;
    if (!canAccess) navigate('/');
  }, [authLoading, canAccess, navigate]);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  if (authLoading || !canAccess || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 min-h-0 max-w-[1040px] w-full mx-auto px-0 sm:px-7 pt-0 sm:pt-8 pb-0 sm:pb-6 flex flex-col">
        {/* The page's title above the inbox, as on every page; a phone keeps
            the room for the conversations */}
        <div className="hidden sm:block">
          <PageHeader title={t('messages.title')} subtitle={t('pages.messages')} />
        </div>
        <div className="panel flex-1 min-h-0 flex rounded-none sm:rounded-[var(--radius-lg)] border-x-0 sm:border-x overflow-hidden">
          {/* Conversation list, full width on mobile until one is picked. */}
          <div
            className={`w-full @2xl:w-[300px] @2xl:flex-shrink-0 flex-col border-r border-[var(--border)] ${
              selected ? 'hidden @2xl:flex' : 'flex'
            }`}
          >
            <div className="px-4 py-3 border-b border-[var(--border)] flex-shrink-0">
              <h2 className="m-0 section-label">{t('messages.conversations')}</h2>
            </div>
            {loading && conversations.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : loadFailed && conversations.length === 0 ? (
              <div className="p-3">
                <LoadError text={t('messages.loadFailed')} onRetry={refresh} />
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                currentUserId={user.id}
                onSelect={setSelectedId}
              />
            )}
          </div>

          {/* Thread pane. */}
          <div className={`flex-1 min-w-0 ${selected ? 'flex' : 'hidden @2xl:flex'} flex-col`}>
            {selected ? (
              <MessageThread
                key={selected.id}
                conversation={selected}
                currentUserId={user.id}
                onBack={() => setSelectedId(null)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState icon={MessageSquare} title={t('messages.selectPrompt')} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
