import './index.css';
import { useState } from "react";
import Lesson from "./Lesson"; 
import Curriculum from "./Curriculum";
import AuthPage from './Auth';



function App() {
    const [currentPage, setCurrentPage] = useState("home"); 
    const [selectedLesson, setSelectedLesson] = useState(null);
    
    function goToLesson(lesson) {
        setSelectedLesson(lesson);
        setCurrentPage("lesson");
    }

    if (currentPage === "lesson") {
    return (
        <Lesson 
            lesson={selectedLesson}
            goHome={() => setCurrentPage("home")}
        />
    );
}

    if (currentPage === "curriculum") {
        return (
            <Curriculum 
                goHome={() => setCurrentPage("home")} 
                goToLesson={goToLesson}
            />
        );
    }

    if (currentPage === "getstarted") {
        return (
            <AuthPage goHome={() => setCurrentPage("home")} />
        );
    }


    return (
        <div className="min-h-screen justify-center flex flex-col bg-black-100  items-center p-6">
        
        <header className="w-full max-w-4xl text-center mb-24">
            <h1 className="text-5xl font-bold text-green-600 mb-4">
            CyberStars
            </h1>
            <p className="text-gray-700 text-lg">
            Learn to code for free
            </p>
        </header>

        
        <div className="flex flex-row  sm:flex-row gap-4 mb-12">
            <button className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition" onClick={() => setCurrentPage("getstarted")}>
                Get Started
            </button>
            <button className="px-6 py-3 border border-green-600 text-green-600 rounded hover:bg-green-50 transition"  onClick={() => setCurrentPage("curriculum")}>
                Explore Curriculum
            </button>
        </div>

        
        
        </div>
    );
}

export default App;
