import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"; // pentru a reda Markdown

function Lesson() {
  const navigate = useNavigate();
  const { slug } = useParams(); // /lesson/:slug
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/lessons/${slug}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(err => console.error(err));
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-green-600 text-white p-4">
        <h1 className="text-xl font-bold text-center">CyberStars</h1>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Partea stanga: continutul lecției */}
        <div className="w-1/2 p-6 overflow-auto bg-white border-r border-gray-300">
         

          <h2 className="text-2xl font-bold mb-4">{title}</h2>

         <div className="prose">
            <ReactMarkdown>{content}</ReactMarkdown>
         </div>
          <button 
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition mb-4 mt-4" 
            onClick={() => navigate("/")}
          >
          Home
          </button>
        </div>



        {/* Partea dreapta: gol momentan */}
        <div className="w-1/2 p-6 overflow-auto bg-gray-50">
          {/* aici poti adauga cod editor / exercitii mai tarziu */}
        </div>

      </div>
    </div>
  );
}

export default Lesson;
