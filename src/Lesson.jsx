import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";

function Lesson() {
  const navigate = useNavigate();
  const { category, lesson } = useParams();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const outputRef = useRef(null); // ref pentru scroll

  useEffect(() => {
    // Fetch teoria din backend
    fetch(`http://localhost:3000/lessons/${category}/${lesson}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(err => console.error(err));

    fetch(`http://localhost:3000/lesson-code/${category}/${lesson}-code.md`)
      .then(res => res.text())
      .then(text => setUserCode(text))
      .catch(() => setUserCode(`#include <stdio.h>\nint main(void) {\n\n}`));
  }, [category, lesson]);

  // Scroll automat la final când output-ul se schimbă
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-green-600 text-white p-4">
        <h1 className="text-xl font-bold text-center">CyberStars</h1>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Stânga */}
        <div className="w-1/2 p-6 overflow-auto bg-white border-r border-gray-300">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="prose">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          <button
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition mt-4"
            onClick={() => navigate("/curriculum")}
          >
            Back
          </button>
        </div>

        {/* Dreapta */}
        <div className="w-1/2 p-6 overflow-hidden bg-gray-50 flex flex-col">
          <div className="flex-3 mb-2 overflow-auto">
            <CodeMirror
              value={userCode}
              height="100%"
              extensions={[cpp()]}
              onChange={(value) => setUserCode(value)}
            />
          </div>

          <button
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={async () => {
              const response = await fetch("http://localhost:3000/run-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: userCode })
              });

              // Backend-ul trimite output incremental sau complet
              // Păstrăm doar ultimele 200 linii ca să nu aglomereze memoria
              const data = await response.json();
              setOutput(prev =>
                (prev + data.output)
                  .split("\n")
                  .slice(-200)
                  .join("\n")
              );
            }}
          >
            Run Code
          </button>

              <div
                ref={outputRef}
                className="mt-2 p-4 bg-gray-800 text-white font-mono rounded overflow-auto whitespace-pre-wrap"
                style={{ height: "200px", minHeight: "200px", maxHeight: "200px" }}
              >
           {output || "Output will appear here..."}
        </div>

        </div>
      </div>
    </div>
  );
}

export default Lesson;
