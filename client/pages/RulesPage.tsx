import { Topbar } from "../components/layout/Topbar";

const RULES = [
  { title: "Be respectful", desc: "Treat everyone with kindness. No harassment, bullying, hate speech, or personal attacks." },
  { title: "Keep it appropriate", desc: "No spam, advertising in the forum, or anywhere on the platform." },
  { title: "No exploiting bugs", desc: "If you find a bug or exploit, report it via Support instead of abusing it for XP or other gains." },
  { title: "English", desc: "This is an English-speaking community. Using other languages is not allowed." },
];

export function RulesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="w-full max-w-[600px]">
          <div className="text-backdrop mb-8">
            <h1 className="text-[24px] font-bold tracking-[-0.5px] mb-2">Community Rules</h1>
            <p className="text-[13px] text-[var(--text3)]">These rules help keep CyberStars a positive learning environment for everyone.</p>
          </div>
          <div className="flex flex-col gap-4">
            {RULES.map((rule, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-[var(--radius)] border border-[var(--border)]"
                style={{ background: "rgba(22,22,29,0.72)", backdropFilter: "blur(12px)" }}
              >
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
        </div>
      </main>
    </div>
  );
}
