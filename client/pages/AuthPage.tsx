import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiClientError } from "../services/apiClient";

const codeSnippets = [
  "def hello():\n  print(\"Hi!\")\n  return True\n\nfor i in range(5):\n  hello()\n\nx = 42\ny = x * 2",
  "import os\n\ndef read_file(path):\n  with open(path) as f:\n    return f.read()\n\ndata = read_file(\"in.txt\")\nprint(len(data))",
  "class Node:\n  def __init__(self, val):\n    self.val = val\n    self.next = None\n\nhead = Node(1)\nhead.next = Node(2)",
  "def fib(n):\n  if n <= 1:\n    return n\n  return fib(n-1) + fib(n-2)\n\nfor i in range(10):\n  print(fib(i))",
  "nums = [3,1,4,1,5]\nnums.sort()\n\ndef binary_search(a, t):\n  lo, hi = 0, len(a)-1\n  while lo <= hi:\n    mid = (lo+hi)//2\n    if a[mid] == t:\n      return mid",
  "from collections import Counter\n\nwords = \"hello world hello\".split()\nc = Counter(words)\n\nfor w, n in c.items():\n  print(f\"{w}: {n}\")",
];

function getPasswordStrength(pw: string): number {
  if (pw.length < 4) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-3
}

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const strength = getPasswordStrength(password);
  const strengthColors = ["var(--error)", "var(--error)", "var(--warning)", "var(--success)"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login({ email, password });
        navigate("/");
      } else {
        await signup({ name, email, password });
        setSignupSuccess(true);
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Server error, try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes rain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-fade-in {
          animation: fadeIn 0.35s ease-out;
        }
      `}</style>

      <div className="flex h-screen bg-[var(--bg)] text-[var(--text)]">
        {/* Left branding panel */}
        <div
          className="hidden min-[900px]:flex flex-1 flex-col justify-center items-center relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0F0F14 0%, #1a1040 50%, #0F0F14 100%)",
          }}
        >
          {/* Radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 40%, var(--accent-glow) 0%, transparent 60%)",
              opacity: 0.15,
            }}
          />

          {/* Code rain columns */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {codeSnippets.map((snippet, i) => (
              <pre
                key={i}
                className="absolute whitespace-pre font-[var(--mono)] text-[11px] text-[var(--accent)]"
                style={{
                  left: `${10 + i * 15}%`,
                  opacity: 0.06,
                  animation: `rain ${18 + i * 1.4}s linear infinite`,
                  animationDelay: `${-i * 3}s`,
                }}
              >
                {snippet}
              </pre>
            ))}
          </div>

          {/* Branding content */}
          <div className="relative z-10 max-w-md px-8">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-4xl text-[var(--accent)]"
                style={{ filter: "drop-shadow(0 0 8px var(--accent-glow))" }}
              >
                ⬡
              </span>
              <span className="text-3xl font-bold tracking-tight">CyberStars</span>
            </div>
            <p className="text-lg text-[var(--text2)] mb-8">
              Learn to code through interactive lessons. Write real code, earn XP, and level up your skills.
            </p>
            <div className="flex flex-col gap-4 text-sm text-[var(--text2)]">
              {[
                { icon: "⌨️", bold: "Live code editor", rest: " — write & run code instantly" },
                { icon: "🐍", bold: "Python, C & Java", rest: " — structured curriculum" },
                { icon: "🏆", bold: "XP & badges", rest: " — gamified progress tracking" },
                { icon: "✨", bold: "AI-powered hints", rest: " — never get stuck" },
              ].map((f) => (
                <div key={f.bold} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-base flex-shrink-0">
                    {f.icon}
                  </div>
                  <span><strong className="text-[var(--text)]">{f.bold}</strong>{f.rest}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="w-full min-[900px]:w-[460px] min-[900px]:min-w-[460px] bg-[var(--bg2)] border-l border-[var(--border)] flex flex-col justify-center px-10 py-12 overflow-y-auto">
          {signupSuccess ? (
            <div className="auth-fade-in text-center flex flex-col items-center gap-4">
              <span className="text-5xl">🚀</span>
              <h2 className="text-2xl font-bold">Welcome to CyberStars!</h2>
              <p className="text-[var(--text2)] text-sm">
                Your account has been created successfully.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 w-full py-2.5 rounded-[var(--radius-sm)] font-semibold text-white text-sm cursor-pointer border-none"
                style={{ background: "var(--accent)" }}
              >
                Go to Dashboard &rarr;
              </button>
            </div>
          ) : (
            <div className="auth-fade-in max-w-sm w-full mx-auto">
              {/* Mobile logo */}
              <div className="min-[900px]:hidden flex items-center gap-2 mb-8 justify-center">
                <span
                  className="text-3xl text-[var(--accent)]"
                  style={{ filter: "drop-shadow(0 0 6px var(--accent-glow))" }}
                >
                  ⬡
                </span>
                <span className="text-2xl font-bold tracking-tight">CyberStars</span>
              </div>

              <h2 className="text-xl font-bold mb-1">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-[var(--text2)] mb-6">
                {isLogin ? "Sign in to track your progress" : "Start your coding journey"}
              </p>

              {/* Tabs */}
              <div className="flex p-1 mb-6 bg-[var(--bg3)] rounded-[var(--radius-sm)]">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setError(""); }}
                  className={`flex-1 py-2 text-[13px] font-semibold rounded-[var(--radius-sm)] transition-all cursor-pointer bg-transparent border-none ${
                    isLogin ? "text-white shadow-sm" : "text-[var(--text3)] hover:text-[var(--text2)]"
                  }`}
                  style={isLogin ? { background: "var(--accent)" } : undefined}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setError(""); }}
                  className={`flex-1 py-2 text-[13px] font-semibold rounded-[var(--radius-sm)] transition-all cursor-pointer bg-transparent border-none ${
                    !isLogin ? "text-white shadow-sm" : "text-[var(--text3)] hover:text-[var(--text2)]"
                  }`}
                  style={!isLogin ? { background: "var(--accent)" } : undefined}
                >
                  Sign Up
                </button>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-medium text-[var(--text2)] mb-1.5">Display Name</label>
                    <input
                      type="text"
                      placeholder="What should we call you?"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[var(--bg3)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text)] text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent placeholder:text-[var(--text3)]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[var(--text2)] mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[var(--bg3)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text)] text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent placeholder:text-[var(--text3)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text2)] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 bg-[var(--bg3)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text)] text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent placeholder:text-[var(--text3)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-base leading-none p-0"
                      tabIndex={-1}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>

                  {/* Password strength meter (signup only) */}
                  {!isLogin && password.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className="flex-1 h-1 rounded-full transition-all"
                          style={{
                            background: strength >= level ? strengthColors[strength] : "var(--bg3)",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {isLogin && (
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text2)]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-[var(--accent)]"
                    />
                    Remember me
                  </label>
                )}

                {error && (
                  <p className="text-[var(--error)] text-center text-sm font-semibold m-0">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-[var(--radius-sm)] font-semibold text-white text-sm cursor-pointer border-none transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "var(--accent)" }}
                >
                  {loading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {loading ? "Processing..." : isLogin ? "Sign in" : "Create account"}
                </button>
              </form>

              <p className="text-[var(--text2)] text-center mt-6 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  className="text-[var(--accent)] font-semibold ml-1.5 hover:underline cursor-pointer bg-transparent border-none"
                  onClick={() => { setIsLogin(!isLogin); setError(""); }}
                >
                  {isLogin ? "Sign up free" : "Log in"}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
