import { useCallback, useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { SkillVerificationModal } from "./components/SkillVerificationModal";
import { LandingPage } from "./pages/LandingPage";
import { HackathonDashboard } from "./pages/HackathonDashboard";
import { HackathonDetails } from "./pages/HackathonDetails.tsx";
import { MatchingPage } from "./pages/MatchingPage";
import { TeamPage } from "./pages/TeamPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ExplorePage } from "./pages/ExplorePage.tsx";
import { AuthPage } from "./pages/AuthPage";
import Loading from "./pages/loading.jsx";
import Profile from "./pages/profile.jsx";
import Home from "./pages/home.jsx";
import { useProfile } from "./contexts/ProfileContext";
import { useAuth } from "./contexts/AuthContext";
import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

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
  | "explore"
  | "team";

const PROTECTED_PAGES: Page[] = [
  "loading",
  "profile",
  "home",
  "my-profile",
  "dashboard",
  "details",
  "matching",
  "explore",
  "team",
];

const DEFAULT_AVATAR =
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400";

const PROFILE_COMPLETION_STORAGE_PREFIX = "hackmate_profile_completed_";

const getProfileCompletionKey = (uid: string) =>
  `${PROFILE_COMPLETION_STORAGE_PREFIX}${uid}`;

const readProfileCompletionCache = (uid: string) => {
  try {
    return localStorage.getItem(getProfileCompletionKey(uid)) === "true";
  } catch {
    return false;
  }
};

const writeProfileCompletionCache = (uid: string, completed: boolean) => {
  try {
    localStorage.setItem(
      getProfileCompletionKey(uid),
      completed ? "true" : "false",
    );
  } catch {
    // Ignore localStorage errors (private mode/quota) and continue.
  }
};

function App() {
  const { user, isAuthReady } = useAuth();
  const { setProfile, updateProfile } = useProfile();

  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("1");
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isProfileLookupReady, setIsProfileLookupReady] = useState(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const showNavbar = !["loading", "profile", "home"].includes(currentPage);

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

        let savedProfile: Record<string, unknown> | null = null;

        if (snapshot.exists()) {
          savedProfile = snapshot.data() as Record<string, unknown>;
        } else if (user.email) {
          // Backward compatibility: support older profile docs not stored with uid as doc id.
          const emailQuery = query(
            collection(db, "profiles"),
            where("email", "==", user.email),
          );
          const emailMatches = await getDocs(emailQuery);

          if (!cancelled && !emailMatches.empty) {
            savedProfile = emailMatches.docs[0].data() as Record<
              string,
              unknown
            >;

            await setDoc(
              profileRef,
              {
                ...savedProfile,
                email: (savedProfile.email as string) || user.email,
                avatar:
                  (savedProfile.avatar as string) ||
                  user.photoURL ||
                  DEFAULT_AVATAR,
                updatedAt: serverTimestamp(),
              },
              { merge: true },
            );
          }
        }

        if (savedProfile) {
          setProfile({
            username:
              (savedProfile.username as string) ||
              user.email?.split("@")[0] ||
              "",
            fullName:
              (savedProfile.fullName as string) || user.displayName || "",
            email: (savedProfile.email as string) || user.email || "",
            college: (savedProfile.college as string) || "",
            collegeYear: (savedProfile.collegeYear as string) || "",
            preferredRole: (savedProfile.preferredRole as string) || "",
            availability: (savedProfile.availability as string) || "",
            interest: (savedProfile.interest as string) || "",
            technicalSkills: Array.isArray(savedProfile.technicalSkills)
              ? (savedProfile.technicalSkills as string[])
              : [],
            softSkills: Array.isArray(savedProfile.softSkills)
              ? (savedProfile.softSkills as string[])
              : [],
            projectTypes: Array.isArray(savedProfile.projectTypes)
              ? (savedProfile.projectTypes as string[])
              : [],
            avatar:
              (savedProfile.avatar as string) ||
              user.photoURL ||
              DEFAULT_AVATAR,
          });
          setHasCompletedProfile(true);
          writeProfileCompletionCache(user.uid, true);
        } else {
          updateProfile({
            fullName: user.displayName || "",
            email: user.email || "",
            username: user.email?.split("@")[0] || "",
            avatar: user.photoURL || DEFAULT_AVATAR,
          });
          const cachedCompletion = readProfileCompletionCache(user.uid);
          setHasCompletedProfile(cachedCompletion);
        }
      } catch {
        if (!cancelled) {
          const cachedCompletion = readProfileCompletionCache(user.uid);
          setHasCompletedProfile(cachedCompletion);
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
        setSelectedHackathonId("");
        return;
      }
      const [pagePart, idPart] = raw.split("/");
      setCurrentPage(pagePart as Page);
      setSelectedHackathonId(idPart || "");
    };

    // Initialize from current hash
    syncFromHash();

    const onPop = () => syncFromHash();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleNavigate = useCallback((page: string, hackathonId?: string) => {
    setCurrentPage(page as Page);
    setSelectedHackathonId(hackathonId || "");

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
    writeProfileCompletionCache(user.uid, true);
    handleNavigate("dashboard");
  };

  if (!isAuthReady || (user && !isProfileLookupReady)) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020]">
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
      {currentPage === "my-profile" && (
        <ProfilePage
          autoOpenVerification={selectedHackathonId === "verify-links"}
        />
      )}
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
      {currentPage === "explore" && <ExplorePage />}
      {currentPage === "team" && <TeamPage onNavigate={handleNavigate} />}

      <SkillVerificationModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
      />
    </div>
  );
}

export default App;
