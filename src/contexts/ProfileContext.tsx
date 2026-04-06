import { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface ProfileContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const defaultProfile: UserProfile = {
  username: 'devgenius',
  fullName: 'Alex Johnson',
  email: 'contact@devgenius.com',
  college: 'Stanford University',
  collegeYear: '3rd Year',
  preferredRole: 'Frontend Developer',
  availability: 'Part Time',
  interest: 'Building scalable applications and exploring AI/ML.',
  technicalSkills: ['Core programming', 'Databases', 'Ui/Ux', 'Backend', 'Ai ML', 'Iot', 'Dsa'],
  softSkills: ['Leadership', 'Presentation', 'Teamwork', 'Time management', 'Problem solving', 'Adaptability', 'Decision making', 'Creativity', 'Innovation'],
  projectTypes: ['AI/ML', 'Software Development', 'Open Source'],
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
