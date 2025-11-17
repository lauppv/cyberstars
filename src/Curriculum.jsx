function Curriculum({ goHome }) {
  const topics = [
    "Variables",
    "Print",
    "Types",
    "if",
    "else if",
    "else",
    "for",
    "while",
    "switch",
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">C Curriculum</h1>

      {/* Lista de lecții */}
      <ul className="w-full max-w-md space-y-3">
        {topics.map((topic, index) => (
          <li
            key={index}
            className="p-4 bg-white rounded shadow hover:bg-green-50 cursor-pointer transition"
          >
            {topic}
          </li>
        ))}
      </ul>

      {/* Buton Home */}
      <button
        onClick={goHome}
        className="mt-8 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Home
      </button>
    </div>
  );
}

export default Curriculum;
