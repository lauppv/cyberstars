import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { PageContainer } from "../components/layout/PageContainer";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export function HomePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <PageContainer className="flex items-center justify-center">
        <LoadingSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col items-center justify-center p-6">
      <header className="w-full max-w-4xl text-center mb-24">
        {isLoggedIn && user && (
          <h2 className="text-3xl text-[#8890a0] mb-4">
            Hey, <span className="text-[#5aa0e0]">{user.name}</span>!
          </h2>
        )}
        <h1 className="text-5xl font-bold text-[#5aa0e0] mb-4">CyberStars</h1>
        <p className="text-[#6090c5] text-lg">Learn to code for free</p>
      </header>

      <div className="flex flex-row gap-4 mb-12">
        {!isLoggedIn && (
          <Button onClick={() => navigate("/getstarted")}>
            Get Started
          </Button>
        )}

        <Button variant="outline" onClick={() => navigate("/curriculum")}>
          Explore Curriculum
        </Button>

        {isLoggedIn && (
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        )}
      </div>
    </PageContainer>
  );
}
