import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificăm dacă utilizatorul e logat
  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          method: "GET",
          credentials: "include", // trimite cookie-ul
        });

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    }

    checkLogin();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen justify-center flex flex-col bg-black-100 items-center p-6">
      <header className="w-full max-w-4xl text-center mb-24">
        <h1 className="text-5xl font-bold text-green-600 mb-4">CyberStars</h1>
        <p className="text-gray-700 text-lg">Learn to code for free</p>
      </header>

      <div className="flex flex-row gap-4 mb-12">

        {/* Afișăm Get Started doar dacă userul nu e logat */}
        {!isLoggedIn && (
          <button
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => navigate("/getstarted")}
          >
            Get Started
          </button>
        )}

        {/* Explore Curriculum - mereu vizibil */}
        <button
          className="px-6 py-3 border border-green-600 text-green-600 rounded hover:bg-green-50 transition"
          onClick={() => navigate("/curriculum")}
        >
          Explore Curriculum
        </button>

        {/* Afișăm butonul Logout doar dacă userul e logat */}
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
