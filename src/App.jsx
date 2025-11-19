import './index.css';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Lesson from "./Lesson"; 
import Curriculum from "./Curriculum";
import AuthPage from './Auth';
import Home from "./Home";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lesson" element={<Lesson />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/getstarted" element={<AuthPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
