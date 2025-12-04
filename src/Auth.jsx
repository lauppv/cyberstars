import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // URL-ul backend-ului se alege automat după mediu
  const API_BASE = import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_API_URL
    : import.meta.env.VITE_PROD_API_URL;


 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const url = isLogin
    ? `${API_BASE}/auth/login`
    : `${API_BASE}/auth/signup`;

  const body = isLogin
    ? { email, password }
    : { name, email, password };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let errorMsg = "Something went wrong";

      try {
        const errData = await res.json();
        errorMsg = errData.message || errorMsg;
      } catch {
          const text = await res.text();
          errorMsg = text || errorMsg;
        }

      setError(errorMsg);
      return;
    }


    const data = await res.json(); // parsează doar dacă res.ok
    navigate("/");
  } catch (err) {
    setError("Server error, try again later");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-cyan-300 text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="How should we call you?"
              required
              className="border border-cyan-300 p-3 rounded bg-gray-700 text-cyan-300 focus:outline-none focus:border-pink-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            required
            className="border border-cyan-300 p-3 rounded bg-gray-700 text-cyan-300 focus:outline-none focus:border-pink-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="border border-cyan-300 p-3 rounded bg-gray-700 text-cyan-300 focus:outline-none focus:border-pink-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pink-400 text-white rounded hover:bg-cyan-300 hover:text-white transition disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        {error && (
          <p className="text-pink-400 mt-2 text-center font-bold">{error}</p>
        )}

        <p className="text-cyan-300 text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-pink-400 font-semibold ml-2 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        <button
          className="mt-6 w-full py-2 border border-pink-400 text-white rounded hover:bg-pink-400 hover:text-white transition"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
