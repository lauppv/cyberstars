import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#14181e] text-[#b0b8c5] p-4 shadow-lg shadow-[#0d1117]/50">
      <h1
        className="text-xl font-bold text-center text-[#5aa0e0] drop-shadow-[0_0_8px_rgba(90,160,224,0.3)] cursor-pointer"
        style={{ fontFamily: "cursive", fontSize: "140%" }}
        onClick={() => navigate("/")}
      >
        CyberStars
      </h1>
    </nav>
  );
}
