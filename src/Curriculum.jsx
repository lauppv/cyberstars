import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Curriculum() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const curriculum = [
    {
      title: "C",
      description: "The Foundation of Programming",
      lessons: [
        "variables", "print", "types", "if", "else if", "else", "for", "while", "switch"
      ]
    },
    {
      title: "Java",
      description: "Object Oriented Programming",
      lessons: [
        "variables", "print", "if", "else if", "else", "for", "while", "Class", "Object"
      ]
    },
    {
      title: "Linux",
      description: "Terminal & Bash Scripting",
      lessons: [
        "TBC1", "TBC2", "TBC3", "TBC4"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

      <h1 className="text-3xl font-bold text-green-600 mb-6">Hmm... let's see</h1>

      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {curriculum.map((entry, i) => (
          <div key={i} className="p-6 bg-white rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">{entry.title}</h3>
            <p className="text-gray-600">{entry.description}</p>
            <button 
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
              onClick={() => setSelected(entry)}
            >
              What will I learn?
            </button>
          </div>
        ))}
      </section>

      {selected && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setSelected(null)}
        >

          <div 
            className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-green-600">{selected.title}</h2>
            <p className="text-gray-700 mb-4">{selected.description}</p>

            <ul className="list-disc pl-6 text-gray-800 space-y-1">
              {selected.lessons.map((lesson, i) => (
                <li 
                  key={i}
                  className="cursor-pointer hover:bg-green-100 px-2 py-1 rounded"
                  onClick={() => {
                    setSelected(null);
                    navigate("/lesson");
                  }}
                >
                  {lesson}
                </li>
              ))}
            </ul>

            <button 
              className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={() => setSelected(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

      <button 
        onClick={() => navigate("/")}
        className="mt-24 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Home	
      </button>

    </div>
  );
}

export default Curriculum;
