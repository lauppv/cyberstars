import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../hooks/useGamification";
import { Topbar } from "../components/layout/Topbar";
import { XPBar } from "../components/gamification/XPBar";
import { Badge } from "../components/gamification/Badge";
import { StreakWidget } from "../components/gamification/StreakWidget";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import * as supportService from "../services/supportService";
import type { SupportTicketDTO, TicketType, TicketStatus } from "../../shared/support";
import type { AuthenticatedUser } from "../../shared/auth";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading } = useAuth();
  const g = useGamification();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate("/getstarted");
  }, [isLoading, isLoggedIn, navigate]);

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

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar streak={g.streak} />
      <XPBar current={g.xpInLevel} max={g.xpForNextLevel} level={g.level} />

      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="w-full max-w-[520px]">
          {/* Header */}
          <div className="flex items-center gap-5 pb-5 border-b border-[var(--border)]">
            <div
              className="w-16 h-16 rounded-full bg-[var(--surface2)] flex items-center justify-center text-[32px] border-[3px] border-[var(--accent)] flex-shrink-0"
            >
              🚀
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[22px] font-bold tracking-[-0.3px]">{user.name}</h1>
              <p className="text-[12px] text-[var(--text3)] mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-3 border-b border-[var(--border)]">
            <div className="py-4 text-center">
              <div className="text-[24px] font-bold">{g.xp}</div>
              <div className="text-[11px] text-[var(--text3)] uppercase tracking-[0.5px] mt-0.5">Total XP</div>
            </div>
            <div className="py-4 text-center border-x border-[var(--border)]">
              <div className="text-[24px] font-bold">{g.streak}</div>
              <div className="text-[11px] text-[var(--text3)] uppercase tracking-[0.5px] mt-0.5">Day Streak</div>
            </div>
            <div className="py-4 text-center">
              <div className="text-[24px] font-bold">{g.badges.filter(b => b.earned).length}</div>
              <div className="text-[11px] text-[var(--text3)] uppercase tracking-[0.5px] mt-0.5">Badges</div>
            </div>
          </div>

          {/* XP section */}
          <div className="py-4 border-b border-[var(--border)]">
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-[var(--warning)] font-semibold">⭐ Level {g.level}</span>
              <span className="text-[var(--text3)]">{g.xpInLevel} / {g.xpForNextLevel} XP</span>
            </div>
            <div className="h-1.5 bg-[var(--bg3)] rounded-[3px] overflow-hidden">
              <div
                className="h-full rounded-[3px] transition-[width] duration-700"
                style={{
                  width: `${Math.min(100, (g.xpInLevel / g.xpForNextLevel) * 100)}%`,
                  background: "linear-gradient(90deg, var(--accent), #a855f7)",
                }}
              />
            </div>
            <div className="mt-3 flex justify-center">
              <StreakWidget days={g.streak} />
            </div>
          </div>

          {/* Support */}
          <SupportSection user={user} />

          {/* Badges */}
          <div className="py-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3.5">
              Badges
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2.5">
              {g.badges.map((b) => (
                <Badge key={b.label} icon={b.icon} label={b.label} earned={b.earned} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Support ── */

const TICKET_TYPES: { value: TicketType; label: string }[] = [
  { value: "BUG", label: "🐞 Bug report" },
  { value: "QUESTION", label: "❓ Question" },
  { value: "RULE_VIOLATION", label: "🚫 Rule violation" },
  { value: "FEEDBACK", label: "💡 Feedback / idea" },
  { value: "ACCOUNT", label: "👤 Account issue" },
  { value: "OTHER", label: "📋 Other" },
];

const STATUS_META: Record<TicketStatus, { label: string; color: string }> = {
  OPEN: { label: "Open", color: "var(--warning)" },
  IN_PROGRESS: { label: "In progress", color: "var(--accent)" },
  RESOLVED: { label: "Resolved", color: "var(--success)" },
  CLOSED: { label: "Closed", color: "var(--text3)" },
};

function ticketTypeLabel(t: TicketType): string {
  return TICKET_TYPES.find((o) => o.value === t)?.label ?? t;
}

const INPUT_CLS =
  "w-full bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text)] text-[13px] px-3 py-2 outline-none transition focus:border-[var(--accent)]";

function TicketRow({
  ticket,
  admin,
  onStatusChange,
}: {
  ticket: SupportTicketDTO;
  admin?: boolean;
  onStatusChange?: (status: TicketStatus) => void;
}) {
  const status = STATUS_META[ticket.status];
  return (
    <div className="p-3 bg-[var(--surface)] rounded-[var(--radius-sm)] border border-[var(--border)]">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[12px] font-semibold">{ticketTypeLabel(ticket.type)}</span>
        {admin && onStatusChange ? (
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange(e.target.value as TicketStatus)}
            className="text-[10px] font-semibold bg-[var(--bg2)] border border-[var(--border)] rounded px-1.5 py-0.5 outline-none cursor-pointer"
            style={{ color: status.color }}
          >
            {(Object.keys(STATUS_META) as TicketStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        ) : (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              color: status.color,
              background: `color-mix(in srgb, ${status.color} 16%, transparent)`,
            }}
          >
            {status.label}
          </span>
        )}
      </div>
      <div className="text-[13px] font-semibold mb-0.5">{ticket.subject}</div>
      <div className="text-[12px] text-[var(--text2)] whitespace-pre-wrap leading-relaxed">
        {ticket.message}
      </div>
      <div className="text-[10px] text-[var(--text3)] mt-1.5">
        {admin && ticket.authorName ? `${ticket.authorName} · ` : ""}
        {new Date(ticket.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

function SupportSection({ user }: { user: AuthenticatedUser }) {
  const isAdmin = user.role === "ADMIN";
  const [type, setType] = useState<TicketType>("BUG");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [myTickets, setMyTickets] = useState<SupportTicketDTO[]>([]);
  const [allTickets, setAllTickets] = useState<SupportTicketDTO[]>([]);

  const refresh = () => {
    supportService.getMyTickets().then(setMyTickets).catch(() => {});
    if (isAdmin) supportService.getAllTickets().then(setAllTickets).catch(() => {});
  };

  useEffect(() => {
    refresh();
  }, []);

  const submit = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await supportService.createTicket({
        type,
        subject: subject.trim(),
        message: message.trim(),
      });
      setSubject("");
      setMessage("");
      setType("BUG");
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

  return (
    <div className="py-5 border-b border-[var(--border)]">
      <h2 className="text-[13px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-1.5">
        Support
      </h2>
      <p className="text-[12px] text-[var(--text3)] mb-3.5">
        Found a bug, have a question, or need to report something? Open a ticket and the team
        will take a look.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="flex flex-col gap-2.5 mb-6"
      >
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TicketType)}
          className={INPUT_CLS + " cursor-pointer"}
        >
          {TICKET_TYPES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          maxLength={200}
          className={INPUT_CLS}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the issue or question in detail..."
          rows={4}
          className={INPUT_CLS + " resize-y"}
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || !subject.trim() || !message.trim()}
            className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold cursor-pointer border-none hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending..." : "Submit ticket"}
          </button>
          {sent && (
            <span className="text-[var(--success)] text-[12px] font-semibold">
              Ticket submitted!
            </span>
          )}
        </div>
      </form>

      <div className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-2">
        Your tickets
      </div>
      {myTickets.length === 0 ? (
        <p className="text-[12px] text-[var(--text3)]">You haven't opened any tickets yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {myTickets.map((t) => (
            <TicketRow key={t.id} ticket={t} />
          ))}
        </div>
      )}

      {isAdmin && (
        <div className="mt-6">
          <div className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--accent)] mb-2">
            All tickets · Admin
          </div>
          {allTickets.length === 0 ? (
            <p className="text-[12px] text-[var(--text3)]">No tickets from anyone yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {allTickets.map((t) => (
                <TicketRow
                  key={t.id}
                  ticket={t}
                  admin
                  onStatusChange={(s) => changeStatus(t.id, s)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
