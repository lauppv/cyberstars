import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CurriculumProvider } from "./context/CurriculumContext";
import { ProgressProvider } from "./context/ProgressContext";
import { CosmosBackground } from "./components/ui/CosmosBackground";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { CoursesPage } from "./pages/CoursesPage";
import { AlgorithmsPage } from "./pages/AlgorithmsPage";
import { AlgorithmListPage } from "./pages/AlgorithmListPage";
import { LessonPage } from "./pages/LessonPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ForumPage } from "./pages/ForumPage";
import { AlmanacPage } from "./pages/AlmanacPage";

function GlobalBackground() {
  const { pathname } = useLocation();
  if (pathname === "/getstarted") return null;
  return <CosmosBackground />;
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CurriculumProvider>
        <ProgressProvider>
        <GlobalBackground />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/getstarted" element={<AuthPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/algorithms" element={<AlgorithmsPage />} />
          <Route path="/algorithms/:lang" element={<AlgorithmListPage />} />
          <Route path="/lesson/:category/:lesson" element={<LessonPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/almanac" element={<AlmanacPage />} />
        </Routes>
        </ProgressProvider>
        </CurriculumProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
