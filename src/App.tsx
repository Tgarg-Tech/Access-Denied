// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { SkillVerificationModal } from "./components/SkillVerificationModal";
import { LandingPage } from "./pages/LandingPage";
import { HackathonDashboard } from "./pages/HackathonDashboard";
import { HackathonDetails } from "./pages/HackathonDetails";
import { MatchingPage } from "./pages/MatchingPage";
import { TeamPage } from "./pages/TeamPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AuthPage } from "./pages/AuthPage";
// @ts-ignore
import Loading from "./pages/loading";
// @ts-ignore
import Profile from "./pages/profile";
// @ts-ignore
import Home from "./pages/home";
import { useProfile } from "./contexts/ProfileContext";
import { useAuth } from "./contexts/AuthContext";
import { db } from "./firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

type Page =
  | "landing"
  | "loading"
  | "profile"
  | "auth-signup"
  | "auth-login"
  | "home"
  | "my-profile"
  | "dashboard"
  | "details"
  | "matching"
  | "team";

const PROTECTED_PAGES: Page[] = [
  "loading",
  "profile",
  "home",
  "my-profile",
  "dashboard",
  "details",
  "matching",
  "team",
];

const DEFAULT_AVATAR =
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400";

function App() {
  const { user, isAuthReady } = useAuth();
  const { setProfile, updateProfile } = useProfile();

  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("1");
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isProfileLookupReady, setIsProfileLookupReady] = useState(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const showNavbar = !(
    ["loading", "profile", "home"] as (Page | string)[]
  ).includes(currentPage);

  useEffect(() => {
    if (!isAuthReady) return;

    if (!user) {
      setIsProfileLookupReady(true);
      setHasCompletedProfile(false);
      if (PROTECTED_PAGES.includes(currentPage)) {
        setCurrentPage("landing");
      }
      return;
    }

    let cancelled = false;

    const loadUserProfile = async () => {
      try {
        setIsProfileLookupReady(false);

        const profileRef = doc(db, "profiles", user.uid);
        const snapshot = await getDoc(profileRef);

        if (cancelled) return;

        if (snapshot.exists()) {
          const saved = snapshot.data();
          setProfile({
            username: saved.username || user.email?.split("@")[0] || "",
            fullName: saved.fullName || user.displayName || "",
            email: saved.email || user.email || "",
            college: saved.college || "",
            collegeYear: saved.collegeYear || "",
            preferredRole: saved.preferredRole || "",
            availability: saved.availability || "",
            interest: saved.interest || "",
            technicalSkills: Array.isArray(saved.technicalSkills)
              ? saved.technicalSkills
              : [],
            softSkills: Array.isArray(saved.softSkills) ? saved.softSkills : [],
            projectTypes: Array.isArray(saved.projectTypes)
              ? saved.projectTypes
              : [],
            avatar: saved.avatar || user.photoURL || DEFAULT_AVATAR,
            pastHackathons: Array.isArray(saved.pastHackathons)
              ? saved.pastHackathons
              : [],
          });
          setHasCompletedProfile(true);
        } else {
          updateProfile({
            fullName: user.displayName || "",
            email: user.email || "",
            username: user.email?.split("@")[0] || "",
            avatar: user.photoURL || DEFAULT_AVATAR,
          });
          setHasCompletedProfile(false);
        }
      } catch {
        if (!cancelled) {
          setHasCompletedProfile(false);
        }
      } finally {
        if (!cancelled) {
          setIsProfileLookupReady(true);
        }
      }
    };

    loadUserProfile();

    return () => {
      cancelled = true;
    };
  }, [isAuthReady, setProfile, updateProfile, user]);

  useEffect(() => {
    if (!user || !isProfileLookupReady) return;

    if (currentPage === "auth-signup" || currentPage === "auth-login") {
      setCurrentPage(hasCompletedProfile ? "dashboard" : "profile");
    }
  }, [currentPage, hasCompletedProfile, isProfileLookupReady, user]);

  useEffect(() => {
    if (!user || !isProfileLookupReady || hasCompletedProfile) return;

    const onboardingPages: Page[] = [
      "profile",
      "loading",
      "auth-signup",
      "auth-login",
    ];

    if (!onboardingPages.includes(currentPage)) {
      setCurrentPage("profile");
    }
  }, [currentPage, hasCompletedProfile, isProfileLookupReady, user]);

  // Sync current page with URL hash so navigation updates the browser URL
  useEffect(() => {
    const syncFromHash = () => {
      const raw = window.location.hash ? window.location.hash.slice(1) : "";
      if (!raw) {
        setCurrentPage("landing");
        return;
      }
      const [pagePart, idPart] = raw.split("/");
      setCurrentPage(pagePart as Page);
      if (idPart) setSelectedHackathonId(idPart);
    };

    // Initialize from current hash
    syncFromHash();

    const onPop = () => syncFromHash();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleNavigate = useCallback((page: string, hackathonId?: string) => {
    setCurrentPage(page as Page);
    if (hackathonId) {
      setSelectedHackathonId(hackathonId);
    }

    // update URL hash so the browser shows the current page and back/forward works
    try {
      const url = hackathonId ? `#${page}/${hackathonId}` : `#${page}`;
      window.history.pushState({ page, hackathonId }, "", url);
    } catch {}

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLoadingDone = useCallback(() => {
    handleNavigate(hasCompletedProfile ? "dashboard" : "profile");
  }, [handleNavigate, hasCompletedProfile]);

  const handleStart = () => {
    if (!user) {
      handleNavigate("auth-signup");
      return;
    }
    if (hasCompletedProfile) {
      handleNavigate("dashboard");
      return;
    }
    handleNavigate("loading");
  };

  const handleProfileComplete = async (form: {
    name: string;
    email: string;
    college: string;
    year: string;
    role: string;
    skills: string[];
    softSkills: string[];
    interests: string[];
    availability: string;
  }) => {
    if (!user) return;

    const payload = {
      username: user.email?.split("@")[0] || "",
      fullName: form.name,
      email: form.email,
      college: form.college,
      collegeYear: form.year,
      preferredRole: form.role,
      availability: form.availability,
      interest: `Interested in ${form.interests.join(", ") || "hackathon projects"}.`,
      technicalSkills: form.skills,
      softSkills: form.softSkills,
      projectTypes: form.interests,
      avatar: user.photoURL || DEFAULT_AVATAR,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "profiles", user.uid), payload, { merge: true });

    updateProfile({
      username: payload.username,
      fullName: payload.fullName,
      email: payload.email,
      college: payload.college,
      collegeYear: payload.collegeYear,
      preferredRole: payload.preferredRole,
      availability: payload.availability,
      interest: payload.interest,
      technicalSkills: payload.technicalSkills,
      softSkills: payload.softSkills,
      projectTypes: payload.projectTypes,
      avatar: payload.avatar,
    });

    setHasCompletedProfile(true);
    handleNavigate("dashboard");
  };

  if (!isAuthReady || (user && !isProfileLookupReady)) {
    return (
      <div className="min-h-screen bg-palette-background dark:bg-[#0B1020] flex items-center justify-center text-palette-text-secondary dark:text-[#94A3B8]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-palette-background dark:bg-[#0B1020]">
      {showNavbar && (
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      )}

      {currentPage === "landing" && (
        <LandingPage
          onNavigate={(page) => {
            if (page === "loading") {
              handleStart();
              return;
            }
            handleNavigate(page);
          }}
        />
      )}
      {currentPage === "auth-signup" && (
        <AuthPage
          mode="signup"
          onModeChange={(mode) =>
            handleNavigate(mode === "signup" ? "auth-signup" : "auth-login")
          }
          onSuccess={() => undefined}
        />
      )}
      {currentPage === "auth-login" && (
        <AuthPage
          mode="login"
          onModeChange={(mode) =>
            handleNavigate(mode === "signup" ? "auth-signup" : "auth-login")
          }
          onSuccess={() => undefined}
        />
      )}
      {currentPage === "loading" && (
        <Loading onDone={handleLoadingDone} durationMs={2600} />
      )}
      {currentPage === "profile" && (
        <Profile
          onComplete={handleProfileComplete}
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
