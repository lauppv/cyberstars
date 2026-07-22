import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurriculumProvider } from './context/CurriculumContext';
import { ProgressProvider } from './context/ProgressContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserSocketProvider } from './context/UserSocketContext';
import { MessagesProvider } from './context/MessagesContext';
import { GuestSignupPromptProvider } from './context/GuestSignupPromptContext';
import { RadioProvider } from './context/RadioContext';
import { UsageProvider } from './context/UsageContext';
import { RadioPlayer } from './components/radio/RadioPlayer';
import { CosmosBackground } from './components/ui/CosmosBackground';
import { MinimalBackground } from './components/ui/MinimalBackground';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { useBackgroundPref } from './hooks/useBackgroundPref';
import { usePresence } from './hooks/usePresence';
import { HomePage } from './pages/HomePage';

// HomePage stays eager — it's the landing route, so splitting it would only add a
// spinner to the first paint. Every other route is code-split into its own chunk,
// fetched on navigation instead of shipping in the initial bundle. Pages use named
// exports, so each loader maps the named export onto the default lazy() expects.
const AuthPage = lazy(() => import('./pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const CoursesPage = lazy(() =>
  import('./pages/CoursesPage').then((m) => ({ default: m.CoursesPage })),
);
const AlgorithmsPage = lazy(() =>
  import('./pages/AlgorithmsPage').then((m) => ({ default: m.AlgorithmsPage })),
);
const AlgorithmListPage = lazy(() =>
  import('./pages/AlgorithmListPage').then((m) => ({ default: m.AlgorithmListPage })),
);
const LessonPage = lazy(() =>
  import('./pages/LessonPage').then((m) => ({ default: m.LessonPage })),
);
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const ForumPage = lazy(() => import('./pages/ForumPage').then((m) => ({ default: m.ForumPage })));
const AlmanacPage = lazy(() =>
  import('./pages/AlmanacPage').then((m) => ({ default: m.AlmanacPage })),
);
const LaniakeaExplorerPage = lazy(() =>
  import('./pages/LaniakeaExplorerPage').then((m) => ({ default: m.LaniakeaExplorerPage })),
);
const RulesPage = lazy(() => import('./pages/RulesPage').then((m) => ({ default: m.RulesPage })));
const UsagePage = lazy(() => import('./pages/UsagePage').then((m) => ({ default: m.UsagePage })));
const SupportPage = lazy(() =>
  import('./pages/SupportPage').then((m) => ({ default: m.SupportPage })),
);
const WelcomePage = lazy(() =>
  import('./pages/WelcomePage').then((m) => ({ default: m.WelcomePage })),
);
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));
const LeaderboardPage = lazy(() =>
  import('./pages/LeaderboardPage').then((m) => ({ default: m.LeaderboardPage })),
);
const MessagesPage = lazy(() =>
  import('./pages/MessagesPage').then((m) => ({ default: m.MessagesPage })),
);
const PublicProfilePage = lazy(() =>
  import('./pages/PublicProfilePage').then((m) => ({ default: m.PublicProfilePage })),
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const ConnectionsPage = lazy(() =>
  import('./pages/ConnectionsPage').then((m) => ({ default: m.ConnectionsPage })),
);

function GlobalBackground() {
  const { pathname } = useLocation();
  const [kind] = useBackgroundPref();
  if (pathname === '/getstarted' || pathname === '/welcome') return null;
  return kind === 'cosmos' ? <CosmosBackground /> : <MinimalBackground />;
}

// The radio chip lives at the app root so playback survives navigation, but the
// auth/welcome pages have their own immersive backgrounds and no chrome.
function GlobalRadio() {
  const { pathname } = useLocation();
  if (pathname === '/getstarted' || pathname === '/welcome') return null;
  return <RadioPlayer />;
}

function App() {
  usePresence();
  return (
    <HashRouter>
      <AuthProvider>
        <CurriculumProvider>
          <ProgressProvider>
            <UserSocketProvider>
              <NotificationProvider>
                <MessagesProvider>
                  <GuestSignupPromptProvider>
                    <RadioProvider>
                      <UsageProvider>
                        <GlobalBackground />
                        <GlobalRadio />
                        <Suspense
                          fallback={
                            <div className="h-screen flex items-center justify-center bg-transparent">
                              <LoadingSpinner />
                            </div>
                          }
                        >
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
                            <Route path="/laniakea" element={<LaniakeaExplorerPage />} />
                            <Route path="/rules" element={<RulesPage />} />
                            <Route path="/usage" element={<UsagePage />} />
                            <Route path="/support" element={<SupportPage />} />
                            <Route path="/welcome" element={<WelcomePage />} />
                            <Route path="/admin" element={<AdminPage />} />
                            <Route path="/leaderboard" element={<LeaderboardPage />} />
                            <Route path="/messages" element={<MessagesPage />} />
                            <Route path="/u/:userId" element={<PublicProfilePage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/connections" element={<ConnectionsPage />} />
                          </Routes>
                        </Suspense>
                      </UsageProvider>
                    </RadioProvider>
                  </GuestSignupPromptProvider>
                </MessagesProvider>
              </NotificationProvider>
            </UserSocketProvider>
          </ProgressProvider>
        </CurriculumProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
