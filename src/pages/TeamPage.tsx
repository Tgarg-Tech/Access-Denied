import { motion } from 'framer-motion';
import { Users, Shield, Clock, AlertCircle, Plus, Mail, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface TeamPageProps {
  onNavigate: (page: string, id?: string) => void;
  onOpenSkillModal: () => void;
}

const currentMembers = [
  {
    id: '1',
    name: 'You',
    role: 'Full Stack Developer',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: false,
    skills: ['React', 'Node.js', 'MongoDB'],
    status: 'Leader',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Full Stack Developer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    skills: ['React', 'Python', 'AWS'],
    status: 'Confirmed',
  },
];

const pendingInvites = [
  {
    id: '3',
    name: 'Marcus Rodriguez',
    role: 'UI/UX Designer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    sentAt: '2 hours ago',
  },
  {
    id: '4',
    name: 'Alex Kim',
    role: 'Backend Engineer',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    skills: ['Java', 'Spring Boot', 'Docker'],
    sentAt: '1 day ago',
  },
];

const missingRoles = [
  {
    role: 'Data Scientist',
    description: 'ML/AI expertise needed',
    priority: 'High',
  },
  {
    role: 'Mobile Developer',
    description: 'React Native or Flutter',
    priority: 'Medium',
  },
];

function TeamReadinessRing({ score }: { score: number }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-56 h-56">
      <svg className="transform -rotate-90 w-56 h-56">
        <circle
          cx="112"
          cy="112"
          r={radius}
          className="stroke-[#E2E8F0] dark:stroke-[#1E293B]"
          strokeWidth="16"
          fill="none"
        />
        <motion.circle
          cx="112"
          cy="112"
          r={radius}
          className="stroke-gradient"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            stroke: 'url(#gradient)',
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-6xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent"
        >
          {score}%
        </motion.div>
        <div className="text-sm text-[#64748B] dark:text-[#94A3B8] font-medium">
          Team Readiness
        </div>
      </div>
    </div>
  );
}

export function TeamPage({ onNavigate, onOpenSkillModal }: TeamPageProps) {
  const [removedInvites, setRemovedInvites] = useState<string[]>([]);
  const teamReadiness = 65;

  const handleCancelInvite = (id: string) => {
    setRemovedInvites([...removedInvites, id]);
  };

  const activePendingInvites = pendingInvites.filter(
    (invite) => !removedInvites.includes(invite.id)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
            My Team
          </h1>
          <p className="text-lg text-[#64748B] dark:text-[#94A3B8]">
            Manage your team and track readiness for TechCrunch Disrupt 2024
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-violet-500 to-blue-500 text-center"
        >
          <div className="flex justify-center mb-6">
            <TeamReadinessRing score={teamReadiness} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Team is Getting Ready!</h2>
          <p className="text-white/90 mb-6">
            Add more members and verify skills to improve your readiness score
          </p>
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('matching')}
              className="px-6 py-3 bg-white text-violet-600 font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              Find More Members
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSkillModal}
              className="px-6 py-3 bg-white/10 backdrop-blur text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              Verify Your Skills
            </motion.button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center">
                <Users className="w-6 h-6 mr-3 text-violet-500" />
                Current Members
              </h2>
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-semibold">
                {currentMembers.length} / 4
              </span>
            </div>

            <div className="space-y-4">
              {currentMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/5 dark:border-white/5"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-violet-500 transition-all"
                      onClick={() => member.id !== '1' && onNavigate('userProfileView', member.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 
                          className={`font-semibold ${member.id !== '1' ? 'cursor-pointer hover:text-violet-500' : ''} text-[#0F172A] dark:text-[#F8FAFC] transition-colors`}
                          onClick={() => member.id !== '1' && onNavigate('userProfileView', member.id)}
                        >
                          {member.name}
                        </h3>
                        {member.verified && (
                          <Shield className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold">
                          {member.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-2">
                        {member.role}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded bg-violet-500/10 text-xs text-violet-600 dark:text-violet-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {!member.verified && member.id === '1' && (
                    <button
                      onClick={onOpenSkillModal}
                      className="mt-3 w-full px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm font-medium hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Verify Your Skills
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center">
                <Clock className="w-6 h-6 mr-3 text-blue-500" />
                Pending Invites
              </h2>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                {activePendingInvites.length}
              </span>
            </div>

            {activePendingInvites.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 mx-auto mb-3 text-[#64748B] dark:text-[#94A3B8]" />
                <p className="text-[#64748B] dark:text-[#94A3B8] mb-4">
                  No pending invites
                </p>
                <button
                  onClick={() => onNavigate('matching')}
                  className="text-violet-500 hover:text-violet-600 font-medium transition-colors"
                >
                  Find teammates
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activePendingInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/5 dark:border-white/5"
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <img
                        src={invite.avatar}
                        alt={invite.name}
                        className="w-16 h-16 rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                        onClick={() => onNavigate('userProfileView', invite.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 
                            className="font-semibold cursor-pointer hover:text-blue-500 text-[#0F172A] dark:text-[#F8FAFC] transition-colors"
                            onClick={() => onNavigate('userProfileView', invite.id)}
                          >
                            {invite.name}
                          </h3>
                          {invite.verified && (
                            <Shield className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-2">
                          {invite.role}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {invite.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded bg-blue-500/10 text-xs text-blue-600 dark:text-blue-400"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5">
                      <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                        Sent {invite.sentAt}
                      </span>
                      <button
                        onClick={() => handleCancelInvite(invite.id)}
                        className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                      >
                        Cancel Invite
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center">
              <AlertCircle className="w-6 h-6 mr-3 text-orange-500" />
              Missing Roles
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {missingRoles.map((role) => (
              <div
                key={role.role}
                className="p-6 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/5 dark:border-white/5"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    {role.role}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      role.priority === 'High'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    }`}
                  >
                    {role.priority}
                  </span>
                </div>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                  {role.description}
                </p>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('matching')}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Find Suggested Members
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
