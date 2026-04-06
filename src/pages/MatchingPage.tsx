import { motion } from 'framer-motion';
import { Shield, Github, Linkedin, Mail, X, Check, Star } from 'lucide-react';
import { useState } from 'react';

interface MatchingPageProps {
  onNavigate: (page: string) => void;
}

const teammates = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Full Stack Developer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    matchScore: 92,
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    interests: ['AI/ML', 'Cloud Computing', 'DevOps'],
    matchReasons: ['Skill Match', 'Interest Match'],
    bio: 'Passionate about building scalable web applications. 5+ years experience.',
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
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    interests: ['Product Design', 'Mobile Apps', 'Accessibility'],
    matchReasons: ['Interest Match'],
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
    skills: ['Python', 'TensorFlow', 'Data Analysis', 'SQL'],
    interests: ['Machine Learning', 'Data Visualization', 'AI'],
    matchReasons: ['Skill Match'],
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
    skills: ['Java', 'Spring Boot', 'Docker', 'Kubernetes'],
    interests: ['Microservices', 'Cloud Architecture', 'DevOps'],
    matchReasons: ['Skill Match', 'Interest Match'],
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
          className="stroke-violet-500"
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
          className="text-5xl font-bold text-[#0F172A] dark:text-[#F8FAFC]"
        >
          {score}%
        </motion.div>
        <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Match Score</div>
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
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
            No more matches available
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8] mb-8">
            You've reviewed all available teammates. Check your team page to manage invites.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('team')}
            className="px-8 py-4 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold rounded-xl"
          >
            Go to Team Page
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
            Find Your Perfect Teammates
          </h1>
          <p className="text-lg text-[#64748B] dark:text-[#94A3B8] mb-8">
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
                    ? 'w-8 bg-violet-500'
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
          className="rounded-3xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 overflow-hidden shadow-xl mb-8"
        >
          <div className="p-8">
            <div className="flex items-start gap-6 mb-6">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {currentUser.name}
                  </h2>
                  {currentUser.verified && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        Verified
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-lg text-violet-500 font-medium mb-3">{currentUser.role}</p>
                <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-4">
                  {currentUser.bio}
                </p>

                <div className="flex gap-3">
                  <button className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 hover:border-violet-500 transition-colors">
                    <Github className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                  </button>
                  <button className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 hover:border-violet-500 transition-colors">
                    <Linkedin className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                  </button>
                  <button className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 hover:border-violet-500 transition-colors">
                    <Mail className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                  </button>
                </div>
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
                    className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-sm font-medium text-violet-600 dark:text-violet-400"
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
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/50 transition-all"
          >
            <Check className="w-5 h-5" />
            Send Invite
          </motion.button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('team')}
            className="text-violet-500 hover:text-violet-600 font-medium transition-colors"
          >
            View My Team ({invitedUsers.length} invites sent)
          </button>
        </div>
      </div>
    </div>
  );
}
