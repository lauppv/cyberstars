import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { curriculum } from "./data/curriculum.js";

function Curriculum() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6">Hmm... let's see</h1>

      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {curriculum.map((entry, i) => (
          <div key={i} className="p-6 bg-gray-800 rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2 text-pink-300">{entry.title}</h3>
            <p className="text-cyan-200">{entry.description}</p>
            <button
              className="mt-4 px-4 py-2 bg-pink-400 text-white rounded-lg shadow hover:bg-cyan-300 hover:text-white transition"
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
            className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">{selected.title}</h2>
            <p className="text-cyan-200 mb-4">{selected.description}</p>

            <ul className="list-disc pl-6 text-cyan-200 space-y-1">
              {selected.lessons.map((lesson, i) => (
                <li
                  key={i}
                  className="cursor-pointer hover:bg-cyan-300/20 px-2 py-1 rounded"
                  onClick={() => {
                    setSelected(null);
                    const category = selected.title.toLowerCase();
                    const lessonSlug = lesson.toLowerCase();
                    navigate(`/lesson/${category}/${lessonSlug}`);
                  }}
                >
                  {lesson}
                </li>
              ))}
            </ul>

            <button
              className="mt-6 px-4 py-2 bg-pink-400 text-white rounded-lg hover:bg-cyan-300 hover:text-white transition"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-24 px-6 py-3 bg-pink-400 text-white rounded hover:bg-cyan-300 hover:text-white transition"
      >
        Home
      </button>
    </div>
  );
}

export default Curriculum;
