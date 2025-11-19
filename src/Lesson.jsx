import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Lesson() {
  const navigate = useNavigate();
  const [code, setCode] = useState(`console.log("Hello World");`);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <nav className="bg-green-600 text-white p-4">
        <h1 className="text-xl font-bold text-center">CyberStars</h1>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        
        <div className="w-1/2 p-6 overflow-auto bg-white border-r border-gray-300">
          <button 
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition" 
              onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>

        {/* restul codului */}
      </div>
    </div>
  );
}

export default Lesson;
