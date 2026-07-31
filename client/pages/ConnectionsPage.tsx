import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/layout/Topbar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { canAccessFeature } from '../../shared/features';
import * as connectionsService from '../services/connectionsService';
import type {
  AcceptedConnection,
  ConnectionsOverview,
  PendingConnection,
} from '../../shared/connections';

function Avatar({ url }: { url: string | null }) {
  return url ? (
    <img
      src={url}
      alt=""
      className="w-10 h-10 rounded-full object-cover border-2 border-[var(--accent)] flex-shrink-0"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-[var(--surface2)] flex items-center justify-center text-[18px] border-2 border-[var(--accent)] flex-shrink-0">
      🚀
    </div>
  );
}

function Row({
  userId,
  name,
  avatarUrl,
  onProfile,
  children,
}: {
  userId: number;
  name: string;
  avatarUrl: string | null;
  onProfile: (id: number) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <button
        onClick={() => onProfile(userId)}
        className="flex items-center gap-3 flex-1 min-w-0 bg-transparent border-none cursor-pointer text-left p-0"
      >
        <Avatar url={avatarUrl} />
        <span className="text-[14px] font-semibold text-[var(--text)] truncate">{name}</span>
      </button>
      {children}
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius)] panel px-6 py-5">
      <h2 className="text-[13px] font-semibold tracking-[1px] text-[var(--text3)] mb-2">
        {title} <span className="text-[var(--accent)] tabular-nums">({count})</span>
      </h2>
      <div className="divide-y divide-[var(--accent)]/10">{children}</div>
    </section>
  );
}

export function ConnectionsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const canAccess = canAccessFeature('connections', user?.role, import.meta.env.PROD);

  const [data, setData] = useState<ConnectionsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(() => {
    return connectionsService
      .getOverview()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!canAccess) {
      navigate('/');
      return;
    }
    load().finally(() => setLoading(false));
  }, [authLoading, canAccess, navigate, load]);

  const act = async (id: number, fn: (id: number) => Promise<unknown>) => {
    setBusy(id);
    try {
      await fn(id);
      await load();
    } finally {
      setBusy(null);
    }
  };

  const goToProfile = (id: number) => navigate(`/u/${id}`);

  const incoming = data?.incoming ?? [];
  const outgoing = data?.outgoing ?? [];
  const connections = data?.connections ?? [];
  const isEmpty = !incoming.length && !outgoing.length && !connections.length;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="w-full max-w-[520px] flex flex-col gap-5">
          <div className="text-backdrop">
            <h1 className="text-2xl font-bold">{t('connections.title')}</h1>
            <p className="text-[var(--text2)] text-sm">{t('connections.subtitle')}</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : isEmpty ? (
            <div className="text-center text-[var(--text3)] py-16 text-backdrop">
              {t('connections.empty')}
            </div>
          ) : (
            <>
              {incoming.length > 0 && (
                <Section title={t('connections.incoming')} count={incoming.length}>
                  {incoming.map((c: PendingConnection) => (
                    <Row
                      key={c.id}
                      userId={c.user.id}
                      name={c.user.name}
                      avatarUrl={c.user.avatarUrl}
                      onProfile={goToProfile}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          disabled={busy === c.id}
                          onClick={() => act(c.id, connectionsService.accept)}
                          className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[12px] font-semibold cursor-pointer border-none hover:brightness-110 transition disabled:opacity-50"
                        >
                          {t('connections.accept')}
                        </button>
                        <button
                          disabled={busy === c.id}
                          onClick={() => act(c.id, connectionsService.decline)}
                          className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--accent)]/40 bg-transparent text-[var(--text3)] text-[12px] font-semibold cursor-pointer hover:text-[var(--error)] transition disabled:opacity-50"
                        >
                          {t('connections.decline')}
                        </button>
                      </div>
                    </Row>
                  ))}
                </Section>
              )}

              {connections.length > 0 && (
                <Section title={t('connections.mine')} count={connections.length}>
                  {connections.map((c: AcceptedConnection) => (
                    <Row
                      key={c.id}
                      userId={c.user.id}
                      name={c.user.name}
                      avatarUrl={c.user.avatarUrl}
                      onProfile={goToProfile}
                    >
                      <button
                        disabled={busy === c.id}
                        onClick={() => act(c.id, connectionsService.remove)}
                        className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--accent)]/40 bg-transparent text-[var(--text3)] text-[12px] font-semibold cursor-pointer hover:text-[var(--error)] transition disabled:opacity-50"
                      >
                        {t('connections.remove')}
                      </button>
                    </Row>
                  ))}
                </Section>
              )}

              {outgoing.length > 0 && (
                <Section title={t('connections.outgoing')} count={outgoing.length}>
                  {outgoing.map((c: PendingConnection) => (
                    <Row
                      key={c.id}
                      userId={c.user.id}
                      name={c.user.name}
                      avatarUrl={c.user.avatarUrl}
                      onProfile={goToProfile}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[var(--text3)]">
                          {t('connections.pending')}
                        </span>
                        <button
                          disabled={busy === c.id}
                          onClick={() => act(c.id, connectionsService.remove)}
                          className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--accent)]/40 bg-transparent text-[var(--text3)] text-[12px] font-semibold cursor-pointer hover:text-[var(--error)] transition disabled:opacity-50"
                        >
                          {t('connections.cancel')}
                        </button>
                      </div>
                    </Row>
                  ))}
                </Section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
