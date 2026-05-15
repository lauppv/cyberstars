import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CurriculumProvider } from "./context/CurriculumContext";
import { ProgressProvider } from "./context/ProgressContext";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { CurriculumPage } from "./pages/CurriculumPage";
import { CoursesPage } from "./pages/CoursesPage";
import { ChallengesPage } from "./pages/ChallengesPage";
import { CourseLessonsPage } from "./pages/CourseLessonsPage";
import { LessonPage } from "./pages/LessonPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CurriculumProvider>
        <ProgressProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/getstarted" element={<AuthPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/course/:courseKey" element={<CourseLessonsPage />} />
          <Route path="/lesson/:category/:lesson" element={<LessonPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        </ProgressProvider>
        </CurriculumProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
