import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificăm dacă utilizatorul e logat
  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch("auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) setIsLoggedIn(true);
        else setIsLoggedIn(false);
      } catch {
        setIsLoggedIn(false);
      }
    }

    checkLogin();
  }, []);

  const handleLogout = async () => {
    await fetch("/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <header className="w-full max-w-4xl text-center mb-24">
        <h1 className="text-5xl font-bold text-pink-300 mb-4">CyberStars</h1>
        <p className="text-cyan-200 text-lg">Learn to code for free</p>
      </header>

      <div className="flex flex-row gap-4 mb-12">
        {!isLoggedIn && (
          <button
            className="px-6 py-3 bg-pink-400 text-white rounded hover:bg-cyan-300 hover:text-white transition"
            onClick={() => navigate("/getstarted")}
          >
            Get Started
          </button>
        )}

        <button
          className="px-6 py-3 border border-pink-400 text-white rounded hover:bg-pink-400 hover:text-cyan-300 transition"
          onClick={() => navigate("/curriculum")}
        >
          Explore Curriculum
        </button>

        {isLoggedIn && (
          <button
            className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
