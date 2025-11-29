import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { curriculum } from "./data/curriculum";
import CodeCell from "./CodeCell.jsx";
import theme from "./theme.js"; // tema synthwave

function Lesson() {
  const navigate = useNavigate();
  const { category, lesson } = useParams();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const outputRef = useRef(null);

  const API_URL = "http://localhost:3000";

  const getCodeMirrorLang = () => {
    switch (category.toLowerCase()) {
      case "python": return [python()];
      case "c": return [cpp()];
      case "java": return [java()];
      default: return [];
    }
  };

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
        if (category.toLowerCase() === "c") setUserCode(`#include <stdio.h>\nint main(void) {\n\n}`);
        else if (category.toLowerCase() === "python") setUserCode(`# Python code goes here`);
        else if (category.toLowerCase() === "java") setUserCode(`public class Main {\n  public static void main(String[] args) {\n\n  }\n}`);
        else setUserCode("");
      });
  }, [category, lesson, API_URL]);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  const categoryObj = curriculum.find(c => c.key.toLowerCase() === category.toLowerCase());
  const lessonList = categoryObj ? categoryObj.lessons : [];
  const currentIndex = lessonList.findIndex(l => l.toLowerCase() === lesson.toLowerCase());
  const prevLesson = currentIndex > 0 ? lessonList[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessonList.length - 1 ? lessonList[currentIndex + 1] : null;

  return (
    <div className="h-screen flex flex-col bg-[#0d0b1f] text-cyan-300">
      <nav className="bg-[#111026] text-cyan-300 p-4 shadow-lg shadow-blue-500/20">
        <h1
          className="text-xl font-bold text-center text-[#00eaff] drop-shadow-[0_0_6px_#00eaff]"
          style={{ fontFamily: "cursive", fontSize: "140%" }}
        >
          CyberStars
        </h1>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Stânga */}
        <div className="w-1/2 p-6 overflow-auto bg-[#111026] border-r border-blue-600/30 h-full shadow-inner">
          <h2 className="text-2xl font-bold mb-4 text-[#00eaff] drop-shadow-[0_0_4px_#00eaff]">{title}</h2>

          <div className="prose text-[#bde5ff]">
            <ReactMarkdown
              children={content}
              components={{
                strong({ children }) {
                  return (
                    <strong style={{ color: "#ff77ff", textShadow: "0 0 6px #ff77ff" }}>
                      {children}
                    </strong>
                  );
                },
                code({ inline, className, children }) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!inline && match) {
                    return (
                      <CodeCell
                        initialCode={String(children).trim()}
                        language={match[1].toLowerCase()}
                        theme={theme} // tema synthwave
                      />
                    );
                  }
                  return (
                    <code
                      className={className}
                      style={{ background: "#1a1836", padding: "4px 6px", borderRadius: "4px" }}
                    >
                      {children}
                    </code>
                  );
                }
              }}
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              className="px-6 py-3 bg-pink-400 text-white rounded hover:bg-cyan-300 transition shadow-md shadow-pink-500/30"
              onClick={() => navigate("/curriculum")}
            >
              Curriculum
            </button>

            {prevLesson && (
              <button
                className="px-4 py-2 bg-[#333159] text-white rounded hover:bg-[#3f3d6d] transition"
                onClick={() => navigate(`/lesson/${category}/${prevLesson}`)}
              >
                Previous
              </button>
            )}

            {nextLesson && (
              <button
                className="px-4 py-2 bg-pink-400 text-white rounded hover:bg-cyan-300 transition shadow-md shadow-pink-500/30"
                onClick={() => navigate(`/lesson/${category}/${nextLesson}`)}
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Dreapta */}
        <div className="w-1/2 flex flex-col p-6 bg-[#111026] h-full overflow-hidden shadow-inner">
          <div className="flex-1 overflow-auto mb-2">
            <CodeMirror
              value={userCode}
              height="100%"
              theme={theme}  // tema synthwave
              extensions={getCodeMirrorLang()}
              onChange={(value) => setUserCode(value)}
            />
          </div>

          <button
            className="mt-2 px-4 py-2 bg-pink-400 text-white rounded hover:bg-cyan-300 transition shadow-md shadow-pink-500/40"
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
            className="mt-2 p-4 bg-[#0d0b1f] text-[#bde5ff] font-mono rounded overflow-auto whitespace-pre-wrap border border-blue-900/40 shadow-inner"
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
