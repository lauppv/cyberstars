import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/layout/Topbar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import * as supportService from '../services/supportService';
import type {
  SupportTicketDTO,
  SupportMessageDTO,
  TicketType,
  TicketStatus,
} from '../../shared/support';
import { isAdmin as isAdminRole } from '../../shared/auth';
import { INPUT_CLS } from '../constants/styles';

const TICKET_TYPE_VALUES: TicketType[] = [
  'BUG',
  'QUESTION',
  'RULE_VIOLATION',
  'FEEDBACK',
  'ACCOUNT',
  'OTHER',
];

const STATUS_COLOR: Record<TicketStatus, string> = {
  OPEN: 'var(--warning)',
  IN_PROGRESS: 'var(--accent)',
  RESOLVED: 'var(--success)',
  CLOSED: 'var(--text3)',
};

export function SupportPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isLoggedIn, isLoading } = useAuth();
  const isAdmin = isAdminRole(user?.role);

  const [type, setType] = useState<TicketType>('BUG');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [myTickets, setMyTickets] = useState<SupportTicketDTO[]>([]);
  const [allTickets, setAllTickets] = useState<SupportTicketDTO[]>([]);
  const [openTicket, setOpenTicket] = useState<SupportTicketDTO | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate('/getstarted');
  }, [isLoading, isLoggedIn, navigate]);

  const refresh = useCallback(() => {
    supportService
      .getMyTickets()
      .then(setMyTickets)
      .catch(() => {});
    if (isAdmin)
      supportService
        .getAllTickets()
        .then(setAllTickets)
        .catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    if (isLoggedIn) refresh();
  }, [isLoggedIn, refresh]);

  const submit = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await supportService.createTicket({ type, subject: subject.trim(), message: message.trim() });
      setSubject('');
      setMessage('');
      setType('BUG');
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const changeStatus = async (id: number, status: TicketStatus) => {
    await supportService.updateTicketStatus(id, status);
    refresh();
  };

  if (isLoading || !user) {
    return (
      <div className="h-screen flex flex-col bg-transparent">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (openTicket) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
        <Topbar />
        <main className="flex-1 flex justify-center px-6 py-10">
          <TicketConversation
            ticket={openTicket}
            isAdmin={isAdmin}
            currentUserId={user.id}
            onBack={() => {
              setOpenTicket(null);
              refresh();
            }}
            onStatusChange={(s) => changeStatus(openTicket.id, s)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="w-full max-w-[560px]">
          <div className="text-backdrop mb-8">
            <h1 className="text-[24px] font-bold tracking-[-0.5px] mb-2">{t('support.title')}</h1>
            <p className="text-[13px] text-[var(--text3)]">{t('support.subtitle')}</p>
          </div>

          {/* New ticket form */}
          <div className="panel p-5 mb-8">
            <h2 className="text-[14px] font-semibold mb-4">{t('support.newTicket')}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
              className="flex flex-col gap-3"
            >
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TicketType)}
                className={INPUT_CLS + ' cursor-pointer'}
              >
                {TICKET_TYPE_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {t(`support.types.${v}`)}
                  </option>
                ))}
              </select>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('support.subjectPlaceholder')}
                maxLength={200}
                className={INPUT_CLS}
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('support.messagePlaceholder')}
                rows={4}
                className={INPUT_CLS + ' resize-y'}
              />
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting || !subject.trim() || !message.trim()}
                  className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold cursor-pointer border-none hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? t('support.sending') : t('support.submit')}
                </button>
                {sent && (
                  <span className="text-[var(--success)] text-[12px] font-semibold">
                    {t('support.submitted')}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* My tickets */}
          <div className="mb-8">
            <h2 className="text-[13px] font-semibold tracking-[1px] text-[var(--text3)] mb-3">
              {t('support.yourTickets')}
            </h2>
            {myTickets.length === 0 ? (
              <p className="panel p-4 text-[12px] text-[var(--text3)]">{t('support.noTickets')}</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {myTickets.map((tk) => (
                  <TicketRow key={tk.id} ticket={tk} onClick={() => setOpenTicket(tk)} />
                ))}
              </div>
            )}
          </div>

          {/* Admin view */}
          {isAdmin && (
            <div>
              <h2 className="text-[13px] font-semibold tracking-[1px] text-[var(--accent)] mb-3">
                {t('support.allTickets')}
              </h2>
              {allTickets.length === 0 ? (
                <p className="panel p-4 text-[12px] text-[var(--text3)]">
                  {t('support.noTicketsAdmin')}
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {allTickets.map((tk) => (
                    <TicketRow key={tk.id} ticket={tk} admin onClick={() => setOpenTicket(tk)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TicketRow({
  ticket,
  admin,
  onClick,
}: {
  ticket: SupportTicketDTO;
  admin?: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const color = STATUS_COLOR[ticket.status];
  return (
    <div
      className="panel p-4 cursor-pointer hover:border-[var(--accent)] transition"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[12px] font-semibold">{t(`support.types.${ticket.type}`)}</span>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            color,
            background: `color-mix(in srgb, ${color} 16%, transparent)`,
          }}
        >
          {t(`support.status.${ticket.status}`)}
        </span>
      </div>
      <div className="text-[13px] font-semibold mb-0.5">{ticket.subject}</div>
      <div className="text-[12px] text-[var(--text2)] line-clamp-2">{ticket.message}</div>
      <div className="text-[10px] text-[var(--text3)] mt-1.5">
        {admin && ticket.authorName ? `${ticket.authorName} · ` : ''}
        {new Date(ticket.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

function TicketConversation({
  ticket,
  isAdmin,
  currentUserId,
  onBack,
  onStatusChange,
}: {
  ticket: SupportTicketDTO;
  isAdmin: boolean;
  currentUserId: number;
  onBack: () => void;
  onStatusChange: (s: TicketStatus) => void;
}) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<SupportMessageDTO[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const statusColor = STATUS_COLOR[ticket.status];

  const loadMessages = useCallback(() => {
    supportService
      .getTicketMessages(ticket.id)
      .then(setMessages)
      .catch(() => {});
  }, [ticket.id]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await supportService.addTicketMessage(ticket.id, reply.trim());
      setReply('');
      loadMessages();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-[600px] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-[var(--text3)] hover:text-[var(--text)] bg-transparent border-none cursor-pointer text-[18px]"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-semibold truncate">{ticket.subject}</div>
          <div className="text-[11px] text-[var(--text3)]">
            {t(`support.types.${ticket.type}`)} · {new Date(ticket.createdAt).toLocaleDateString()}
            {ticket.authorName ? ` · ${ticket.authorName}` : ''}
          </div>
        </div>
        {isAdmin ? (
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange(e.target.value as TicketStatus)}
            className="text-[11px] font-semibold bg-[var(--bg2)] border border-[var(--border)] rounded px-2 py-1 outline-none cursor-pointer"
            style={{ color: statusColor }}
          >
            {(Object.keys(STATUS_COLOR) as TicketStatus[]).map((s) => (
              <option key={s} value={s}>
                {t(`support.status.${s}`)}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: statusColor,
                background: `color-mix(in srgb, ${statusColor} 16%, transparent)`,
              }}
            >
              {t(`support.status.${ticket.status}`)}
            </span>
            {ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED' && (
              <button
                onClick={() => onStatusChange('CLOSED')}
                className="text-[10px] font-semibold px-2 py-1 rounded bg-[#1a7a3a] text-white border-none cursor-pointer hover:brightness-110 transition"
              >
                {t('support.markSolved')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        className="panel flex-1 flex flex-col gap-3 p-4 overflow-y-auto"
        style={{ maxHeight: '60vh' }}
      >
        {/* Original message */}
        <MessageBubble
          authorName={ticket.authorName ?? t('support.you')}
          message={ticket.message}
          createdAt={ticket.createdAt}
          isOwn={!ticket.authorName}
          isAdmin={false}
        />

        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            authorName={m.authorName}
            message={m.message}
            createdAt={m.createdAt}
            isOwn={m.userId === currentUserId}
            isAdmin={m.isAdmin}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply input */}
      {ticket.status !== 'CLOSED' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendReply();
          }}
          className="flex gap-2"
        >
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={t('support.replyPlaceholder')}
            className={INPUT_CLS + ' flex-1'}
          />
          <button
            type="submit"
            disabled={sending || !reply.trim()}
            className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold cursor-pointer border-none hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {sending ? '...' : t('support.send')}
          </button>
        </form>
      )}
    </div>
  );
}

function MessageBubble({
  authorName,
  message,
  createdAt,
  isOwn,
  isAdmin,
}: {
  authorName: string;
  message: string;
  createdAt: string;
  isOwn: boolean;
  isAdmin: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className="text-[10px] text-[var(--text3)] mb-0.5 flex items-center gap-1.5">
        <span className="font-semibold">{authorName}</span>
        {isAdmin && <span className="text-[var(--accent)]">· {t('support.admin')}</span>}
      </div>
      <div
        className="max-w-[85%] px-3 py-2 rounded-lg text-[13px] leading-relaxed whitespace-pre-wrap"
        style={{
          background: isOwn ? 'rgba(108,92,231,0.18)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isOwn ? 'rgba(108,92,231,0.3)' : 'var(--border)'}`,
        }}
      >
        {message}
      </div>
      <div className="text-[9px] text-[var(--text3)] mt-0.5">
        {new Date(createdAt).toLocaleString()}
      </div>
    </div>
  );
}
