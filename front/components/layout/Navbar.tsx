import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#221b33] text-[#c8bdd6] p-4 shadow-lg shadow-[#1a1428]/50">
      <h1
        className="text-xl font-bold text-center text-[#d4789c] drop-shadow-[0_0_8px_rgba(212,120,156,0.3)] cursor-pointer"
        style={{ fontFamily: "cursive", fontSize: "140%" }}
        onClick={() => navigate("/")}
      >
        CyberStars
      </h1>
    </nav>
  );
}
