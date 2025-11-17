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
      <h1 className="text-3xl font-bold text-green-600 mb-6">What you can learn:</h1>

  

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
