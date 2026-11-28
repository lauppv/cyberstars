import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../ui/Avatar';
import { UserLink } from '../ui/UserLink';
import { LoadError } from '../ui/LoadError';
import { useMessages } from '../../context/MessagesContext';
import * as blocksService from '../../services/blocksService';
import type { BlockedUser } from '@cyberstars/shared/blocks';

// Settings' list of the people the student blocked, each with Unblock. Unblocking
// brings their conversation back to the inbox.
export function BlockedPeople() {
  const { t } = useTranslation();
  const { refresh: refreshInbox } = useMessages();
  const [users, setUsers] = useState<BlockedUser[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    blocksService
      .getBlocked()
      .then((res) => {
        setUsers(res.users);
        setLoadFailed(false);
      })
      .catch(() => setLoadFailed(true));
  }, []);

  useEffect(load, [load]);

  const unblock = async (id: number) => {
    setBusyId(id);
    setError(null);
    try {
      await blocksService.unblock(id);
      setUsers((prev) => prev?.filter((u) => u.id !== id) ?? null);
      refreshInbox();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t('common.somethingWrong'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="rounded-[var(--radius)] panel px-6 py-5">
      <h2 className="section-label mb-1">{t('block.settingsTitle')}</h2>
      <p className="text-[11px] text-[var(--text3)] mb-3">{t('block.settingsHint')}</p>
      {loadFailed ? (
        <LoadError text={t('block.loadFailed')} onRetry={load} />
      ) : users === null ? null : users.length === 0 ? (
        <p className="text-[13px] text-[var(--text3)]">{t('block.none')}</p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-3 py-2">
              <UserLink userId={u.id} className="flex items-center gap-3 min-w-0">
                <Avatar url={u.avatarUrl} userId={u.id} size={28} />
                <span className="text-[13px] text-[var(--text)] truncate">{u.name}</span>
              </UserLink>
              <button
                onClick={() => unblock(u.id)}
                disabled={busyId === u.id}
                className="btn btn-secondary flex-shrink-0"
              >
                {t('block.unblock')}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="mt-2 text-[12px] text-[var(--error)]">
          {error}
        </p>
      )}
    </section>
  );
}
