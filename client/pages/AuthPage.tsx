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
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] p-8 w-full max-w-md">
          <div className="text-center mb-6">
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

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
            <Input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? "Processing..." : isLogin ? "Sign in" : "Create account"}
            </Button>
          </form>

          {error && (
            <p className="text-[var(--error)] mt-3 text-center text-sm font-semibold">{error}</p>
          )}

          <p className="text-[var(--text2)] text-center mt-5 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              className="text-[var(--accent)] font-semibold ml-2 hover:underline cursor-pointer bg-transparent border-none"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
