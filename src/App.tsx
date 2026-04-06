import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SkillVerificationModal } from './components/SkillVerificationModal';
import { LandingPage } from './pages/LandingPage';
import { HackathonDashboard } from './pages/HackathonDashboard';
import { HackathonDetails } from './pages/HackathonDetails';
import { MatchingPage } from './pages/MatchingPage';
import { TeamPage } from './pages/TeamPage';
import { ProfilePage } from './pages/ProfilePage';
import Loading from './pages/loading';
import Profile from './pages/profile';
import Home from './pages/home';

type Page = 'landing' | 'loading' | 'home' | 'profile' | 'my-profile' | 'dashboard' | 'details' | 'matching' | 'team';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("1");
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const showNavbar = !["loading", "profile", "home"].includes(currentPage);

  const handleNavigate = (page: string, hackathonId?: string) => {
    setCurrentPage(page as Page);
    if (hackathonId) {
      setSelectedHackathonId(hackathonId);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020]">
      {showNavbar && (
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      )}

      {currentPage === "landing" && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === "loading" && (
        <Loading onDone={() => handleNavigate("profile")} durationMs={2600} />
      )}
      {currentPage === "profile" && (
        <Profile
          onComplete={() => handleNavigate("home")}
          onBack={() => handleNavigate("landing")}
        />
      )}
      {currentPage === "home" && <Home onNavigate={handleNavigate} />}
      
      {currentPage === "my-profile" && <ProfilePage />}

      {currentPage === "dashboard" && (
        <HackathonDashboard onNavigate={handleNavigate} />
      )}
      {currentPage === "details" && (
        <HackathonDetails
          hackathonId={selectedHackathonId}
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === "matching" && (
        <MatchingPage onNavigate={handleNavigate} />
      )}
      {currentPage === "team" && (
        <TeamPage
          onNavigate={handleNavigate}
          onOpenSkillModal={() => setIsSkillModalOpen(true)}
        />
      )}

      <SkillVerificationModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
      />
    </div>
  );
}

export default App;
