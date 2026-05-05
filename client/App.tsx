import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { CurriculumPage } from "./pages/CurriculumPage";
import { LessonPage } from "./pages/LessonPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/getstarted" element={<AuthPage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/lesson/:category/:lesson" element={<LessonPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
