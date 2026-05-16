import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Topbar } from "../components/layout/Topbar";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import * as supportService from "../services/supportService";
import type { SupportTicketDTO, TicketType, TicketStatus } from "../../shared/support";

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

export function SupportPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [type, setType] = useState<TicketType>("BUG");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [myTickets, setMyTickets] = useState<SupportTicketDTO[]>([]);
  const [allTickets, setAllTickets] = useState<SupportTicketDTO[]>([]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate("/getstarted");
  }, [isLoading, isLoggedIn, navigate]);

  const refresh = () => {
    supportService.getMyTickets().then(setMyTickets).catch(() => {});
    if (isAdmin) supportService.getAllTickets().then(setAllTickets).catch(() => {});
  };

  useEffect(() => {
    if (isLoggedIn) refresh();
  }, [isLoggedIn]);

  const submit = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await supportService.createTicket({ type, subject: subject.trim(), message: message.trim() });
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

  if (isLoading || !user) {
    return (
      <div className="h-screen flex flex-col bg-transparent">
        <Topbar />
        <div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="w-full max-w-[560px]">
          <div className="text-backdrop mb-8">
            <h1 className="text-[24px] font-bold tracking-[-0.5px] mb-2">Support</h1>
            <p className="text-[13px] text-[var(--text3)]">
              Found a bug, have a question, or need to report something? Open a ticket and the team will take a look.
            </p>
          </div>

          {/* New ticket form */}
          <div
            className="p-5 rounded-[var(--radius)] border border-[var(--border)] mb-8"
            style={{ background: "rgba(22,22,29,0.72)", backdropFilter: "blur(12px)" }}
          >
            <h2 className="text-[14px] font-semibold mb-4">New ticket</h2>
            <form
              onSubmit={(e) => { e.preventDefault(); void submit(); }}
              className="flex flex-col gap-3"
            >
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TicketType)}
                className={INPUT_CLS + " cursor-pointer"}
              >
                {TICKET_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
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
                  <span className="text-[var(--success)] text-[12px] font-semibold">Ticket submitted!</span>
                )}
              </div>
            </form>
          </div>

          {/* My tickets */}
          <div className="mb-8">
            <h2 className="text-[13px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3">
              Your tickets
            </h2>
            {myTickets.length === 0 ? (
              <p className="text-[12px] text-[var(--text3)]">You haven't opened any tickets yet.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {myTickets.map((t) => (
                  <TicketRow key={t.id} ticket={t} />
                ))}
              </div>
            )}
          </div>

          {/* Admin view */}
          {isAdmin && (
            <div>
              <h2 className="text-[13px] font-semibold uppercase tracking-[1px] text-[var(--accent)] mb-3">
                All tickets · Admin
              </h2>
              {allTickets.length === 0 ? (
                <p className="text-[12px] text-[var(--text3)]">No tickets from anyone yet.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {allTickets.map((t) => (
                    <TicketRow key={t.id} ticket={t} admin onStatusChange={(s) => changeStatus(t.id, s)} />
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

function TicketRow({ ticket, admin, onStatusChange }: { ticket: SupportTicketDTO; admin?: boolean; onStatusChange?: (status: TicketStatus) => void }) {
  const status = STATUS_META[ticket.status];
  return (
    <div
      className="p-4 rounded-[var(--radius)] border border-[var(--border)]"
      style={{ background: "rgba(22,22,29,0.72)", backdropFilter: "blur(12px)" }}
    >
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
              <option key={s} value={s}>{STATUS_META[s].label}</option>
            ))}
          </select>
        ) : (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: status.color, background: `color-mix(in srgb, ${status.color} 16%, transparent)` }}
          >
            {status.label}
          </span>
        )}
      </div>
      <div className="text-[13px] font-semibold mb-0.5">{ticket.subject}</div>
      <div className="text-[12px] text-[var(--text2)] whitespace-pre-wrap leading-relaxed">{ticket.message}</div>
      <div className="text-[10px] text-[var(--text3)] mt-1.5">
        {admin && ticket.authorName ? `${ticket.authorName} · ` : ""}
        {new Date(ticket.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
