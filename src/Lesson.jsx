import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { curriculum } from "./data/curriculum";

function Lesson() {
  const navigate = useNavigate();
  const { category, lesson } = useParams();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const outputRef = useRef(null); // ref pentru scroll

  const API_URL = "http://localhost:3000"; // backend-ul tău

  // Determină extensia/limbajul pentru CodeMirror
  const getCodeMirrorLang = () => {
    switch (category.toLowerCase()) {
      case "python": return [python()];
      case "c": return [cpp()];
      case "java": return [java()];
      default: return [];
    }
  };

  // Fetch teoria și codul lecției
  useEffect(() => {
    fetch(`${API_URL}/lessons/${category}/${lesson}`)
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setTitle(data.title);
          setContent(data.content);
        } else {
          setTitle("Lesson not found");
          setContent("");
        }
      })
      .catch(err => console.error(err));

    fetch(`${API_URL}/lesson-code/${category}/${lesson}-code.md`)
      .then(res => res.ok ? res.text() : Promise.reject("File not found"))
      .then(text => setUserCode(text))
      .catch(() => {
        // fallback cod inițial
        if (category.toLowerCase() === "c") setUserCode(`#include <stdio.h>\nint main(void) {\n\n}`);
        else if (category.toLowerCase() === "python") setUserCode(`# Python code goes here`);
        else if (category.toLowerCase() === "java") setUserCode(`public class Main {\n  public static void main(String[] args) {\n\n  }\n}`);
        else setUserCode("");
      });
  }, [category, lesson, API_URL]);

  // Scroll automat la final când output-ul se schimbă
  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  // Prev/Next
  // Găsește categoria curentă
  const categoryObj = curriculum.find(c => c.key.toLowerCase() === category.toLowerCase());

  // Lista de lecții pentru categoria curentă
  const lessonList = categoryObj ? categoryObj.lessons : [];

  // Indexul lecției curente (lowercase ca să nu conteze majusculele)
  const currentIndex = lessonList.findIndex(l => l.toLowerCase() === lesson.toLowerCase());

  // Lecția precedentă și lecția următoare
  const prevLesson = currentIndex > 0 ? lessonList[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessonList.length - 1 ? lessonList[currentIndex + 1] : null;


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
            <ReactMarkdown
              children={content}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={materialDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>{children}</code>
                  );
                }
              }}
            />
          </div>

          {/* Back + Prev/Next */}
          <div className="flex gap-4 mt-4">
            <button
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={() => navigate("/curriculum")}
            >
              Home
            </button>

            {prevLesson && (
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                onClick={() => navigate(`/lesson/${category}/${prevLesson}`)}
              >
                Previous
              </button>
            )}

            {nextLesson && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => navigate(`/lesson/${category}/${nextLesson}`)}
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Dreapta */}
        <div className="w-1/2 p-6 flex flex-col bg-gray-50">
          <div className="flex-1 mb-2 overflow-auto">
            <CodeMirror
              value={userCode}
              height="100%"
              extensions={getCodeMirrorLang()}
              onChange={value => setUserCode(value)}
            />
          </div>

          <button
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={async () => {
              try {
                const response = await fetch(`${API_URL}/api/run-code`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ code: userCode, language: category })
                });
                const data = await response.json();
                setOutput(data.output);
              } catch (err) {
                setOutput(prev => prev + "\nError connecting to server.");
                console.error(err);
              }
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
