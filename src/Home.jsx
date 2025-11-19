import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen justify-center flex flex-col bg-black-100 items-center p-6">
        
        <header className="w-full max-w-4xl text-center mb-24">
            <h1 className="text-5xl font-bold text-green-600 mb-4">
            CyberStars
            </h1>
            <p className="text-gray-700 text-lg">
            Learn to code for free
            </p>
        </header>

        <div className="flex flex-row gap-4 mb-12">
            <button 
                className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition" 
                onClick={() => navigate("/getstarted")}
            >
                Get Started
            </button>

            <button 
                className="px-6 py-3 border border-green-600 text-green-600 rounded hover:bg-green-50 transition"  
                onClick={() => navigate("/curriculum")}
            >
                Explore Curriculum
            </button>
        </div>
        </div>
    );
}

export default Home;
