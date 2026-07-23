import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessagesContext';
import { Topbar } from '../components/layout/Topbar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ConversationList } from '../components/messages/ConversationList';
import { MessageThread } from '../components/messages/MessageThread';
import { canAccessFeature } from '../../shared/features';

export function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const { conversations, loading } = useMessages();
  const canAccess = canAccessFeature('messaging', user?.role, import.meta.env.PROD);

  // Deep-link from a DM notification: /messages with { openConversationId }.
  const deepLinkId =
    (location.state as { openConversationId?: number } | null)?.openConversationId ?? null;
  const [selectedId, setSelectedId] = useState<number | null>(deepLinkId);

  // Re-apply the deep-link on every navigation (location.key changes even when
  // the target conversation id is the same) — an initializer alone would ignore
  // clicks made while this page is already mounted.
  useEffect(() => {
    if (deepLinkId != null) setSelectedId(deepLinkId); // eslint-disable-line react-hooks/set-state-in-effect
  }, [deepLinkId, location.key]);

  // Client-side guard is UX only — /api/messages is server-authoritative.
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
      <main className="flex-1 min-h-0 max-w-[980px] w-full mx-auto px-0 sm:px-4 py-0 sm:py-4">
        <div className="h-full flex rounded-none sm:rounded-[var(--radius)] border-y sm:border border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-[var(--panel-blur)] overflow-hidden">
          {/* Conversation list — full width on mobile until one is picked. */}
          <div
            className={`w-full md:w-[300px] md:flex-shrink-0 flex-col border-r border-[var(--accent)]/20 ${
              selected ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="px-4 py-3 border-b border-[var(--accent)]/20 flex-shrink-0">
              <h1 className="text-[15px] font-bold">{t('messages.title')}</h1>
            </div>
            {loading && conversations.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner />
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
          <div className={`flex-1 min-w-0 ${selected ? 'flex' : 'hidden md:flex'} flex-col`}>
            {selected ? (
              <MessageThread
                key={selected.id}
                conversation={selected}
                currentUserId={user.id}
                onBack={() => setSelectedId(null)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-[13px] text-[var(--text3)] px-6 text-center">
                {t('messages.selectPrompt')}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
