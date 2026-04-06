import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export interface HackathonEntry {
  name: string;
  role: string;
  result: string;
  rating: number | string;
  projectLink?: string;
}

export interface UserProfileData {
  id?: string;
  username: string;
  fullName: string;
  institute: string;
  profileImage: string;
  interests: string[];
  technicalSkills: string[];
  softSkills: string[];
  githubLink: string;
  resumeLink: string;
  portfolioLink: string;
  pastHackathons: HackathonEntry[];
  authenticityScore: number | string;
  performanceScore: number | string;
  verified?: boolean;
}

export const fetchUserProfile = async (userId: string): Promise<UserProfileData | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return { id: userDocSnap.id, ...userDocSnap.data() } as UserProfileData;
    }
    
    // Fallback look in 'profiles' collection if 'users' doesn't exist
    const profileDocRef = doc(db, "profiles", userId);
    const profileDocSnap = await getDoc(profileDocRef);
    if (profileDocSnap.exists()) {
      const data = profileDocSnap.data();
      return {
        id: profileDocSnap.id,
        username: data.username || "",
        fullName: data.fullName || "",
        institute: data.college || data.institute || "",
        profileImage: data.avatar || data.profileImage || "",
        interests: data.interests || data.projectTypes || [],
        technicalSkills: data.technicalSkills || [],
        softSkills: data.softSkills || [],
        githubLink: data.githubLink || "",
        resumeLink: data.resumeLink || "",
        portfolioLink: data.portfolioLink || "",
        pastHackathons: data.pastHackathons || [],
        authenticityScore: data.authenticityScore || (data.verified ? "Verified" : "Pending"),
        performanceScore: data.performanceScore || (data.pastRating ? `${data.pastRating}/5` : "0/5"),
        verified: data.verified || false
      } as UserProfileData;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
