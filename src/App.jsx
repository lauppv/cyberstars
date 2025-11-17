import './index.css';
import { useState } from "react";
import Lesson from "./Lesson"; 
import Curriculum from "./Curriculum";

function App() {
  const [currentPage, setCurrentPage] = useState("home"); // "home" sau "lesson"

  if (currentPage === "lesson") {
    return <Lesson goHome={() => setCurrentPage("home")} />;
  }
  if (currentPage === "curriculum") {
    return <Curriculum goHome={() => setCurrentPage("home")} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <header className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-5xl font-bold text-green-600 mb-4">
          CyberStars
        </h1>
        <p className="text-gray-700 text-lg">
          Learn to code for free
        </p>
      </header>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <button className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition" onClick={() => setCurrentPage("lesson")}>
          Get Started
        </button>
        <button className="px-6 py-3 border border-green-600 text-green-600 rounded hover:bg-green-50 transition"  onClick={() => setCurrentPage("curriculum")}>
          Explore Curriculum
        </button>
      </div>

      {/* Features */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-white rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Learn C</h3>
          <p className="text-gray-600">The Foundation of Programming</p>
        </div>
        <div className="p-6 bg-white rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Learn Java</h3>
          <p className="text-gray-600">Object Oriented Programming</p>
        </div>
        <div className="p-6 bg-white rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Learn Linux</h3>
          <p className="text-gray-600">Terminal & Bash Scripting</p>
        </div>
      
      </section>
    </div>
  );
}

export default App;
