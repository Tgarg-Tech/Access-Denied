import { motion } from 'framer-motion';
import { Shield, Github, Linkedin, Mail, X, Check, Star } from 'lucide-react';
import { useState } from 'react';

interface MatchingPageProps {
  onNavigate: (page: string, id?: string) => void;
}

const teammates = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Full Stack Developer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    matchScore: 89,
    pastRating: 4.5,
    hackathonsCount: 5,
    lastRole: 'Backend Developer',
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    interests: ['AI/ML', 'Cloud Computing', 'DevOps'],
    matchReasons: ['Skill Match', 'Interest Match'],
    strengths: ['Teamwork', 'Backend', 'System Design'],
    bio: 'Passionate about building scalable web applications. Strong in teamwork and backend architecture.',
    github: 'sarahchen',
    linkedin: 'sarah-chen',
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'UI/UX Designer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    matchScore: 88,
    pastRating: 4.6,
    hackathonsCount: 8,
    lastRole: 'Product Designer',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    interests: ['Product Design', 'Mobile Apps', 'Accessibility'],
    matchReasons: ['Interest Match'],
    strengths: ['Visual Design', 'Collaboration'],
    bio: 'Award-winning designer with a focus on user-centered design principles.',
    github: 'marcusr',
    linkedin: 'marcus-rodriguez',
  },
  {
    id: '3',
    name: 'Emily Park',
    role: 'Data Scientist',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: false,
    matchScore: 85,
    pastRating: 4.2,
    hackathonsCount: 4,
    lastRole: 'ML Intern',
    skills: ['Python', 'TensorFlow', 'Data Analysis', 'SQL'],
    interests: ['Machine Learning', 'Data Visualization', 'AI'],
    matchReasons: ['Skill Match'],
    strengths: ['Data Modeling', 'Python'],
    bio: 'ML enthusiast with experience in predictive modeling and data pipelines.',
    github: 'emilypark',
    linkedin: 'emily-park',
  },
  {
    id: '4',
    name: 'Alex Kim',
    role: 'Backend Engineer',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    matchScore: 90,
    pastRating: 4.7,
    hackathonsCount: 15,
    lastRole: 'Backend Lead',
    skills: ['Java', 'Spring Boot', 'Docker', 'Kubernetes'],
    interests: ['Microservices', 'Cloud Architecture', 'DevOps'],
    matchReasons: ['Skill Match', 'Interest Match'],
    strengths: ['Cloud Infra', 'DevOps', 'Distributed Systems'],
    bio: 'Backend specialist focused on building robust, scalable systems.',
    github: 'alexkim',
    linkedin: 'alex-kim',
  },
];

function ProgressRing({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-48">
      <svg className="transform -rotate-90 w-48 h-48">
        <circle
          cx="96"
          cy="96"
          r={radius}
          className="stroke-[#E2E8F0] dark:stroke-[#1E293B]"
          strokeWidth="12"
          fill="none"
        />
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          className="stroke-palette-accent-primary"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-5xl font-bold text-palette-text-primary dark:text-palette-background"
        >
          {score}%
        </motion.div>
        <div className="text-sm text-palette-text-secondary dark:text-palette-text-secondary/80">Match Score</div>
      </div>
    </div>
  );
}

export function MatchingPage({ onNavigate }: MatchingPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const currentUser = teammates[currentIndex];

  const handleInvite = () => {
    setInvitedUsers([...invitedUsers, currentUser.id]);
    if (currentIndex < teammates.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    if (currentIndex < teammates.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-palette-background dark:bg-[#0B1020] pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-palette-text-primary dark:text-palette-background mb-4">
            No more matches available
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8] mb-8">
            You've reviewed all available teammates. Check your team page to manage invites.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('team')}
            className="px-8 py-4 bg-gradient-to-r from-palette-accent-primary to-palette-accent-secondary text-white font-semibold rounded-xl"
          >
            Go to Team Page
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-palette-background dark:bg-[#0B1020] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-palette-text-primary dark:text-palette-background mb-4">
            Find Your Perfect Teammates
          </h1>
          <p className="text-lg text-palette-text-secondary dark:text-palette-text-secondary/80 mb-8">
            Review recommended matches and build your winning team
          </p>

          <div className="flex justify-center mb-8">
            <ProgressRing score={currentUser.matchScore} />
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {teammates.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-palette-accent-primary'
                    : index < currentIndex
                    ? 'w-2 bg-green-500'
                    : 'w-2 bg-[#E2E8F0] dark:bg-[#1E293B]'
                }`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          key={currentUser.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="rounded-3xl bg-palette-card dark:bg-[#121A2B] border border-palette-border dark:border-white/10 overflow-hidden shadow-xl mb-8"
        >
          <div className="p-8">
            <div className="flex items-start gap-6 mb-8">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-2xl object-cover cursor-pointer hover:ring-4 hover:ring-palette-accent-primary/20 transition-all"
                  onClick={() => onNavigate('userProfileView', currentUser.id)}
                />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 
                    className="text-2xl font-bold text-palette-text-primary dark:text-palette-background cursor-pointer hover:text-palette-accent-primary transition-colors"
                    onClick={() => onNavigate('userProfileView', currentUser.id)}
                  >
                    {currentUser.name}
                  </h2>
                  {currentUser.verified && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-palette-accent-secondary/10 border border-palette-accent-secondary/20">
                      <Shield className="w-4 h-4 text-palette-accent-secondary" />
                      <span className="text-xs font-semibold text-palette-accent-secondary dark:text-palette-accent-secondary/80">
                        Verified
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-lg text-palette-accent-primary font-medium mb-3">{currentUser.role}</p>
                
                {/* Performance Stats Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-palette-section dark:bg-[#0B1020] p-3 rounded-xl border border-palette-border dark:border-white/5">
                    <p className="text-[10px] uppercase font-bold text-palette-text-secondary dark:text-palette-text-secondary/80 mb-1">Match Score</p>
                    <p className="text-palette-accent-primary font-extrabold text-lg">{currentUser.matchScore}%</p>
                  </div>
                  <div className="bg-palette-section dark:bg-[#0B1020] p-3 rounded-xl border border-palette-border dark:border-white/5">
                    <p className="text-[10px] uppercase font-bold text-palette-text-secondary dark:text-palette-text-secondary/80 mb-1">Authenticity</p>
                    <div className="flex items-center gap-1.5 text-palette-accent-secondary font-bold">
                      <Shield className="w-4 h-4" />
                      <span>{currentUser.verified ? 'Verified' : 'Pending'}</span>
                    </div>
                  </div>
                  <div className="bg-palette-section dark:bg-[#0B1020] p-3 rounded-xl border border-palette-border dark:border-white/5">
                    <p className="text-[10px] uppercase font-bold text-palette-text-secondary dark:text-palette-text-secondary/80 mb-1">Past Performance</p>
                    <div className="flex items-center gap-1.5 text-yellow-500 font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{currentUser.pastRating}/5</span>
                    </div>
                  </div>
                  <div className="bg-palette-section dark:bg-[#0B1020] p-3 rounded-xl border border-palette-border dark:border-white/5">
                    <p className="text-[10px] uppercase font-bold text-palette-text-secondary dark:text-palette-text-secondary/80 mb-1">Completed Hackathons</p>
                    <p className="text-palette-text-primary dark:text-palette-background font-bold text-lg">{currentUser.hackathonsCount}</p>
                  </div>
                  <div className="bg-palette-section dark:bg-[#0B1020] p-3 rounded-xl border border-palette-border dark:border-white/5 lg:col-span-2">
                    <p className="text-[10px] uppercase font-bold text-palette-text-secondary dark:text-palette-text-secondary/80 mb-1">Last Role</p>
                    <p className="text-palette-text-primary dark:text-palette-background font-bold">{currentUser.lastRole}</p>
                  </div>
                </div>

                <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-4">
                  {currentUser.bio}
                </p>

                <div className="flex gap-3">
                  <button className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 hover:border-violet-500 transition-colors group">
                    <Github className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8] group-hover:text-violet-500" />
                  </button>
                  <button className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 hover:border-violet-500 transition-colors group">
                    <Linkedin className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8] group-hover:text-violet-500" />
                  </button>
                  <button className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 hover:border-violet-500 transition-colors group">
                    <Mail className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8] group-hover:text-violet-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                Top Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.strengths?.map((strength: string) => (
                  <span
                    key={strength}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                Why Matched
              </h3>
              <div className="flex gap-2">
                {currentUser.matchReasons.map((reason) => (
                  <span
                    key={reason}
                    className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5"
                  >
                    <Star className="w-4 h-4" />
                    {reason}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-palette-accent-primary/10 text-sm font-medium text-palette-accent-primary dark:text-palette-accent-secondary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-sm font-medium text-blue-600 dark:text-blue-400"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSkip}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-[#121A2B] border-2 border-black/10 dark:border-white/10 text-[#64748B] dark:text-[#94A3B8] font-semibold hover:border-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
            Skip
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleInvite}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-palette-accent-primary to-palette-accent-secondary text-white font-semibold hover:shadow-lg hover:shadow-palette-accent-primary/50 transition-all"
          >
            <Check className="w-5 h-5" />
            Send Invite
          </motion.button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('team')}
            className="text-palette-accent-primary hover:text-palette-accent-primary/80 font-medium transition-colors"
          >
            View My Team ({invitedUsers.length} invites sent)
          </button>
        </div>
      </div>
    </div>
  );
}
