import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Github, 
  ExternalLink, 
  FileText, 
  Linkedin, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Trophy, 
  Briefcase, 
  ArrowLeft,
  UserPlus,
  Loader2
} from "lucide-react";
import { fetchUserProfile, UserProfileData } from "../services/userService";

interface UserProfileViewPageProps {
  userId: string;
  onNavigate: (page: string) => void;
}

const UserProfileViewPage: React.FC<UserProfileViewPageProps> = ({ userId, onNavigate }) => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const data = await fetchUserProfile(userId);
      if (data) {
        setProfile(data);
      } else {
        setError(true);
      }
      setLoading(false);
    };

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-palette-background dark:bg-[#0B1020]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-palette-accent-primary animate-spin mx-auto mb-4" />
          <p className="text-palette-text-secondary dark:text-palette-text-secondary/80 font-medium">Fetching User Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-palette-background dark:bg-[#0B1020]">
        <div className="max-w-md w-full bg-palette-card dark:bg-[#121A2B] p-8 rounded-3xl border border-palette-border dark:border-white/10 shadow-xl text-center">
          <h2 className="text-2xl font-bold text-palette-text-primary dark:text-palette-background mb-4">User Not Found</h2>
          <p className="text-palette-text-secondary dark:text-palette-text-secondary/80 mb-6">
            We couldn't find the user you're looking for. They might have changed their profile or left the platform.
          </p>
          <button 
            onClick={() => onNavigate('matching')}
            className="w-full py-3 bg-palette-accent-primary text-white rounded-xl font-semibold hover:bg-palette-accent-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Matching
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-palette-background dark:bg-[#0B1020] pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Top Header/Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => onNavigate('matching')}
            className="p-2 rounded-xl bg-palette-card dark:bg-[#121A2B] border border-palette-border dark:border-white/10 text-palette-text-secondary dark:text-palette-text-secondary hover:text-palette-accent-primary transition-all flex items-center gap-2 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium pr-2">Back</span>
          </button>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-palette-card dark:bg-[#121A2B] border border-palette-border dark:border-white/10 rounded-xl text-palette-text-secondary dark:text-palette-text-secondary font-semibold hover:border-palette-accent-primary transition-all"
            >
              Contact
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-gradient-to-r from-palette-accent-primary to-palette-accent-secondary text-white rounded-xl font-semibold shadow-lg shadow-palette-accent-primary/20 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Invite to Team
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Profile Info & Header (Left Column/Main Span) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-8">
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1.5 px-4 py-1.5 bg-palette-accent-secondary/10 border border-palette-accent-secondary/20 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-theme-secondary text-palette-accent-secondary" />
                    <span className="text-xs font-bold text-palette-accent-secondary">
                      {profile.verified ? 'Verified' : 'Partially Verified'}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-yellow-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{profile.performanceScore}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                    <img 
                      src={profile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=random`} 
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-lg"></div>
                </div>

                <div className="flex-1 text-center md:text-left pt-4">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-palette-text-primary dark:text-palette-background tracking-tight mb-2">
                    {profile.fullName}
                  </h1>
                  <p className="text-lg font-medium text-palette-accent-primary mb-3">@{profile.username}</p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-palette-text-secondary dark:text-palette-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.institute}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Past Hackathons Section */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-palette-accent-primary/10 rounded-2xl">
                  <Trophy className="w-6 h-6 text-palette-accent-primary" />
                </div>
                <h3 className="text-xl font-bold text-palette-text-primary dark:text-palette-background">Past Hackathons</h3>
              </div>

              <div className="space-y-6">
                {profile.pastHackathons && profile.pastHackathons.length > 0 ? (
                  profile.pastHackathons.map((hack, idx) => (
                    <div key={idx} className="group relative bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-[2rem] p-6 hover:border-palette-accent-primary transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-lg text-palette-text-primary dark:text-palette-background leading-none">
                              {hack.name}
                            </h4>
                            <span className="px-3 py-1 bg-palette-accent-primary/10 text-[10px] font-bold uppercase rounded-full text-palette-accent-primary tracking-wider">
                              {hack.result}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-palette-text-secondary font-medium">
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="w-4 h-4" />
                              <span>{hack.role}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>{hack.rating}/5</span>
                            </div>
                          </div>
                        </div>
                        {hack.projectLink && (
                          <a 
                            href={hack.projectLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-palette-card dark:bg-[#1E293B] p-4 rounded-2xl border border-palette-border dark:border-white/10 text-palette-text-secondary hover:text-palette-accent-primary hover:border-palette-accent-primary transition-all group-hover:shadow-lg"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-palette-text-secondary">
                    No hackathon history recorded yet.
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar / Secondary Sections (Right Column) */}
          <div className="space-y-8">
            
            {/* Quick Links Section */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl"
            >
              <h3 className="text-lg font-bold text-palette-text-primary dark:text-palette-background mb-6">Professional Links</h3>
              <div className="flex flex-col gap-3">
                <a 
                  href={profile.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-palette-card dark:bg-[#121A2B] border border-palette-border dark:border-white/10 rounded-2xl hover:border-palette-accent-primary group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#F8FAFC] dark:bg-white/5 rounded-lg">
                      <Github className="w-5 h-5 text-[#333]" />
                    </div>
                    <span className="font-semibold text-palette-text-primary dark:text-palette-background">GitHub</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-palette-text-secondary" />
                </a>

                <a 
                  href={profile.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-palette-card dark:bg-[#121A2B] border border-palette-border dark:border-white/10 rounded-2xl hover:border-palette-accent-primary group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-palette-text-primary dark:text-palette-background">Resume / CV</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-palette-text-secondary" />
                </a>

                {profile.portfolioLink && (
                  <a 
                    href={profile.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-palette-card dark:bg-[#121A2B] border border-palette-border dark:border-white/10 rounded-2xl hover:border-palette-accent-primary group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                        <ExternalLink className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-semibold text-palette-text-primary dark:text-palette-background">Portfolio</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-palette-text-secondary" />
                  </a>
                )}
              </div>
            </motion.div>

            {/* Skills Card */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl"
            >
              <div className="mb-8">
                <h3 className="text-lg font-bold text-palette-text-primary dark:text-palette-background mb-4">Technical Arsenal</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.technicalSkills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-palette-accent-primary/10 text-palette-accent-primary text-sm font-bold rounded-2xl border border-palette-accent-primary/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-palette-text-primary dark:text-palette-background mb-4">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.softSkills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-green-500/10 text-green-600 text-sm font-bold rounded-2xl border border-green-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Interests Card */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl"
            >
              <h3 className="text-lg font-bold text-palette-text-primary dark:text-palette-background mb-4">Core Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <span key={i} className="px-4 py-2 bg-blue-500/10 text-blue-600 text-sm font-bold rounded-2xl border border-blue-500/20">
                    #{interest.toLowerCase().replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileViewPage;
