import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Topbar } from "../components/layout/Topbar";
import { ApiClientError } from "../services/apiClient";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await signup({ name, email, password });
      }
      navigate("/");
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
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Topbar />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div
          className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] p-8 w-full max-w-md relative overflow-hidden"
          style={{ boxShadow: "0 0 40px var(--accent-glow)" }}
        >
          <div
            className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-25 blur-3xl pointer-events-none"
            style={{ background: "var(--accent)" }}
          />

          <div className="text-center mb-6 relative">
            <span
              className="inline-block text-3xl text-[var(--accent)] mb-3"
              style={{ filter: "drop-shadow(0 0 6px var(--accent-glow))" }}
            >
              ⬡
            </span>
            <h2 className="text-2xl font-bold tracking-[-0.5px]">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-[var(--text2)] mt-1">
              {isLogin ? "Sign in to track your progress" : "Start your coding journey"}
            </p>
          </div>

          <div className="flex p-1 mb-5 bg-[var(--bg3)] rounded-[var(--radius-sm)] relative">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[var(--radius-sm)] transition cursor-pointer bg-transparent border-none ${
                isLogin ? "bg-[var(--bg2)] text-[var(--text)] shadow-sm" : "text-[var(--text3)] hover:text-[var(--text2)]"
              }`}
              style={isLogin ? { background: "var(--bg2)" } : undefined}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[var(--radius-sm)] transition cursor-pointer bg-transparent border-none ${
                !isLogin ? "text-[var(--text)]" : "text-[var(--text3)] hover:text-[var(--text2)]"
              }`}
              style={!isLogin ? { background: "var(--bg2)" } : undefined}
            >
              Sign up
            </button>
          </div>

          <form className="flex flex-col gap-3 relative" onSubmit={handleSubmit}>
            {!isLogin && (
              <Input
                type="text"
                placeholder="What should we call you?"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div>
              <Input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!isLogin && (
                <p className="text-[11px] text-[var(--text3)] mt-1.5 ml-1">
                  Must be at least 6 characters.
                </p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? "Processing..." : isLogin ? "Sign in" : "Create account"}
            </Button>
          </form>

          {error && (
            <p className="text-[var(--error)] mt-3 text-center text-sm font-semibold relative">{error}</p>
          )}

          <p className="text-[var(--text2)] text-center mt-5 text-sm relative">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              className="text-[var(--accent)] font-semibold ml-2 hover:underline cursor-pointer bg-transparent border-none"
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
