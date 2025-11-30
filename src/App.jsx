import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Lesson from "./Lesson";
import Curriculum from "./Curriculum";
import AuthPage from "./Auth";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/getstarted" element={<AuthPage />} />
        <Route path="/lesson/:category/:lesson" element={<Lesson />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
