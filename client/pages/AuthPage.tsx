import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { PageContainer } from "../components/layout/PageContainer";
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
    <PageContainer className="flex items-center justify-center p-6">
      <div className="bg-[#14181e] shadow-xl rounded-2xl p-8 w-full max-w-md border border-[#1e2a38]">
        <h2 className="text-3xl font-bold text-[#5aa0e0] text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              type="text"
              placeholder="How should we call you?"
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

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
          </Button>
        </form>

        {error && (
          <p className="text-[#c08888] mt-2 text-center font-bold">{error}</p>
        )}

        <p className="text-[#8890a0] text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-[#5aa0e0] font-semibold ml-2 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        <Button
          variant="outline"
          className="mt-6 w-full"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    </PageContainer>
  );
}
