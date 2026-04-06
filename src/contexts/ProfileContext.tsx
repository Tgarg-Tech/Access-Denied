import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

export interface HackathonReview {
  technical: number;
  teamwork: number;
  communication: number;
  reliability: number;
  problemSolving: number;
  delivery: number;
  averageRating: number;
  summary: string;
}

export interface PastHackathon {
  id: string;
  name: string;
  date: string;
  rolePlayed: string;
  teamSize: number;
  skillsUsed: string[];
  projectTitle: string;
  projectLink?: string;
  githubLink?: string;
  demoLink?: string;
  certificateVerified: boolean;
  result: 'Winner' | 'Finalist' | 'Participant';
  review?: HackathonReview;
}

export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  college: string;
  collegeYear: string;
  preferredRole: string;
  availability: string;
  interest: string;
  technicalSkills: string[];
  softSkills: string[];
  projectTypes: string[];
  avatar: string;
  pastHackathons: PastHackathon[];
}

interface ProfileContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
}

const defaultProfile: UserProfile = {
  username: "devgenius",
  fullName: "Alex Johnson",
  email: "contact@devgenius.com",
  college: "Stanford University",
  collegeYear: "3rd Year",
  preferredRole: "Frontend Developer",
  availability: "Part Time",
  interest: "Building scalable applications and exploring AI/ML.",
  technicalSkills: [
    "Core programming",
    "Databases",
    "Ui/Ux",
    "Backend",
    "Ai ML",
    "Iot",
    "Dsa",
  ],
  softSkills: [
    "Leadership",
    "Presentation",
    "Teamwork",
    "Time management",
    "Problem solving",
    "Adaptability",
    "Decision making",
    "Creativity",
    "Innovation",
  ],
  projectTypes: ["AI/ML", "Software Development", "Open Source"],
  avatar:
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  pastHackathons: [
    {
      id: "h1",
      name: "Global AI Hackathon 2023",
      date: "Oct 2023",
      rolePlayed: "Frontend Lead",
      teamSize: 4,
      skillsUsed: ["React", "Python", "TailwindCSS"],
      projectTitle: "AI Health Assistant",
      githubLink: "https://github.com",
      demoLink: "https://youtube.com",
      certificateVerified: true,
      result: "Finalist",
      review: {
        technical: 5,
        teamwork: 4,
        communication: 5,
        reliability: 4,
        problemSolving: 5,
        delivery: 4,
        averageRating: 4.5,
        summary: "Excellent UI implementation and great team player."
      }
    }
  ]
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const logout = useCallback(() => {
    setProfile(defaultProfile);
  }, []);

  const value = useMemo(
    () => ({ profile, setProfile, updateProfile, logout }),
    [profile, updateProfile, logout],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
