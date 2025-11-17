import { useState } from "react";


function Lesson({ goHome }) {
  const [code, setCode] = useState(`// Scrie codul aici\nconsole.log("Hello World");`);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-600 text-white p-4">
        <h1 className="text-xl font-bold">FreeCodeCamp Clone - Lesson</h1>
      </nav>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Stânga: Teorie + exemple */}
        <div className="w-1/2 p-6 overflow-auto bg-white border-r border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Introducere în JavaScript</h2>
          <p className="mb-4 text-gray-700">
            JavaScript este limbajul de programare al web-ului. Poți folosi
            console.log() pentru a afișa mesaje în consolă.
          </p>
          <h3 className="text-xl font-semibold mb-2">Exemplu:</h3>
          <pre className="bg-gray-100 p-4 rounded mb-4">
{`console.log("Hello World");`}
          </pre>
          <p className="text-gray-600">
            În partea dreaptă poți scrie codul tău și să experimentezi.
          </p>
          <button className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition" onClick={() => goHome()}>
          Home
        </button>
        </div>

        {/* Dreapta: Playground */}
        <div className="w-1/2 p-6 bg-gray-50 flex flex-col">
          <h3 className="text-xl font-bold mb-2">Playground</h3>
          <textarea
            className="flex-1 p-4 border border-gray-300 rounded resize-none bg-white font-mono text-gray-800"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={() => {
              try {
                // eslint-disable-next-line no-eval
                eval(code);
              } catch (err) {
                console.error(err);
              }
            }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Run
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lesson;
