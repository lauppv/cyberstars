import { useNavigate } from "react-router-dom";
import { Topbar } from "../components/layout/Topbar";
import { useGamification } from "../hooks/useGamification";
import { useAuth } from "../context/AuthContext";
import { XPBar } from "../components/gamification/XPBar";
import { ALGO_COURSE_KEYS } from "../../shared/constants";
import { courseMeta } from "../constants/courses";

const ALGO_DESC: Record<string, string> = {
  "algo-python":
    "Classic algorithms with strings, lists, loops, and dictionaries. Great for building problem-solving skills.",
  "algo-java":
    "OOP-focused challenges — classes, objects, inheritance, and collections. Practice designing with objects.",
  "algo-c":
    "Low-level challenges with arrays, pointers, structs, and memory. Think close to the hardware.",
};

const LANGS = ALGO_COURSE_KEYS.map((key) => {
  const m = courseMeta(key);
  return { key, icon: m.icon, name: m.label, color: m.color, desc: ALGO_DESC[key] };
});

export function AlgorithmsPage() {
  const navigate = useNavigate();
  const g = useGamification();
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar streak={g.streak} />

      {isLoggedIn && (
        <XPBar
          current={g.xpInLevel}
          max={g.xpForNextLevel}
          level={g.level}
        />
      )}

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
          <div className="text-center mb-10 text-backdrop">
            <h1 className="text-[32px] font-bold tracking-[-0.5px] mb-2">Algorithms</h1>  
            <p className="text-[var(--text2)] text-sm">
              Pick a language and solve challenges that combine what you learned in the courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {LANGS.map((lang) => (
              <button
                key={lang.key}
                onClick={() => navigate(`/algorithms/${lang.key.replace("algo-", "")}`)}
                className="text-left p-6 bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] border border-[var(--accent)]/30 rounded-xl hover:border-[var(--accent)] transition cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: lang.color + "20" }}
                  >
                    {lang.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1.5 group-hover:text-[var(--accent)] transition">
                  {lang.name}
                </h3>
                <p className="text-[13px] text-[var(--text2)] leading-relaxed">
                  {lang.desc}
                </p>
              </button>
            ))}
          </div>
      </main>
    </div>
  );
}
