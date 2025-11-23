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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const url = isLogin ? "http://localhost:3000/auth/login" : "http://localhost:3000/auth/signup";


        const body = isLogin ? { email, password } : { name, email, password };

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", 
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong");
            } else {
                navigate("/curriculum");
            }
        } catch (err) {
            setError("Server error, try again later");
            console.error(err);
        } finally {
            setLoading(false);
        }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-600 text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="How should we call you?"
              required
              className="border border-gray-300 p-3 rounded focus:outline-none focus:border-green-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            required
            className="border border-gray-300 p-3 rounded focus:outline-none focus:border-green-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="border border-gray-300 p-3 rounded focus:outline-none focus:border-green-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        <p className="text-center text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-green-600 font-semibold ml-2 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        <button
          className="mt-6 w-full py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
