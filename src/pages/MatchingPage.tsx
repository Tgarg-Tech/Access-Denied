/**
 * MatchingPage.tsx — Enhanced with smart rating system + white Figma-like UI
 *
 * ─── RATING FORMULA ───────────────────────────────────────────────────────────
 *
 * score = (skillComplement * 12) + (commonInterests * 10) + (reverseComplement * 5)
 *       + (experienceMatch * 8) + (sameCollege * 3) + (extraSkills * 2) + projectBoost
 *
 * Where:
 *  skillComplement  = skills candidate has that YOU don't (complementary value)
 *                     e.g. You: [React, Node] | Them: [Figma, Python, React]
 *                     complement = [Figma, Python] → count = 2 → 2*12 = 24
 *
 *  commonInterests  = shared project interest tags (AI/ML, Web3, etc.)
 *                     e.g. You: [AI/ML, Web3] | Them: [AI/ML, Gaming, Web3]
 *                     common = [AI/ML, Web3] → count = 2 → 2*10 = 20
 *
 *  reverseComplement = your skills they DON'T have (you add value to THEM too)
 *                      e.g. You: [React] | Them: [] → reverseComplement = 1 → 1*5 = 5
 *
 *  experienceMatch  = abs(yourYearIndex - theirYearIndex) mapped to 0–3
 *                     same year = 3, 1 year apart = 2, 2 years = 1, 3+ = 0 → *8
 *                     e.g. both 3rd year → 3*8 = 24
 *
 *  sameCollege      = 1 if same college, 0 otherwise → *3
 *                     e.g. both IIT Delhi → 1*3 = 3
 *
 *  extraSkills      = total unique skills they bring beyond the complement threshold
 *                     (raw breadth bonus, capped at 5) → *2
 *                     e.g. they have 7 skills, your overlap = 1 → extra = min(6, 5) = 5 → 5*2 = 10
 *
 *  projectBoost     = flat bonus (0–15) for role complementarity
 *                     Designer + Developer = 15, same role = 0, partial = 8
 *
 * Raw max ≈ (5*12)+(5*10)+(5*5)+(3*8)+(1*3)+(5*2)+15 = 60+50+25+24+3+10+15 = 187
 * Normalised to 0–100: finalScore = Math.min(100, Math.round((raw / 187) * 100))
 *
 * ─── MATH EXAMPLE ────────────────────────────────────────────────────────────
 * You:  skills=[React, Node.js], interests=[AI/ML, Web3], role=Frontend, year=3rd, college=IIT Delhi
 * Them: skills=[Figma, Python, React, TensorFlow], interests=[AI/ML, AR/VR, Web3], role=ML Engineer, year=3rd, college=IIT Delhi
 *
 *  skillComplement  = [Figma, Python, TensorFlow] → 3 → 3*12 = 36
 *  commonInterests  = [AI/ML, Web3] → 2 → 2*10 = 20
 *  reverseComplement= [Node.js] → 1 → 1*5 = 5
 *  experienceMatch  = same year (3) → 3*8 = 24
 *  sameCollege      = 1 → 1*3 = 3
 *  extraSkills      = min(3, 5) → 3 → 3*2 = 6
 *  projectBoost     = Frontend + ML = 15
 *
 *  raw = 36+20+5+24+3+6+15 = 109
 *  score = Math.min(100, Math.round((109/187)*100)) = Math.round(58.3) = 58? No wait…
 *  Actually raw/187 * 100 = 58 — but since real candidates rarely hit all maxes,
 *  we scale by 1.4 to keep scores in realistic 60–95 range:
 *  finalScore = Math.min(100, Math.round((raw / 187) * 100 * 1.4)) = min(100, 82) = 82 ✓
 */

import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Github,
  Linkedin,
  Mail,
  X,
  Check,
  Star,
  ChevronRight,
  BookOpen,
  Zap,
  Users,
  Building2,
  Award,
  Info,
} from "lucide-react";
import { useState } from "react";

interface MatchingPageProps {
  onNavigate?: (page: string) => void;
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface Teammate {
  id: string;
  name: string;
  role: string;
  avatar: string;
  verified: boolean;
  skills: string[];
  interests: string[];
  bio: string;
  github: string;
  linkedin: string;
  college: string;
  year: string;
}

interface RatingBreakdown {
  skillComplement: number;
  commonInterests: number;
  reverseComplement: number;
  experienceMatch: number;
  sameCollege: number;
  extraSkills: number;
  projectBoost: number;
  raw: number;
  score: number;
  labels: { key: string; value: number; max: number; contribution: number }[];
}

// ─── Current User (your profile) ─────────────────────────────────────────────
const ME = {
  skills: ["React", "Node.js", "TypeScript"],
  interests: ["AI/ML", "Web3", "FinTech"],
  role: "Frontend Dev",
  year: "3rd",
  college: "IIT Delhi",
};

// ─── Candidates ──────────────────────────────────────────────────────────────
const teammates: Teammate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "ML Engineer",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    verified: true,
    skills: ["Python", "TensorFlow", "React", "FastAPI", "SQL"],
    interests: ["AI/ML", "HealthTech", "Web3"],
    bio: "ML researcher turned engineer. Love building end-to-end AI products.",
    github: "sarahchen",
    linkedin: "sarah-chen",
    college: "IIT Delhi",
    year: "3rd",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "UI/UX Designer",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    verified: true,
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Framer"],
    interests: ["EdTech", "Social Impact", "AR/VR"],
    bio: "Award-winning designer obsessed with user-centered products.",
    github: "marcusr",
    linkedin: "marcus-rodriguez",
    college: "NIT Trichy",
    year: "4th",
  },
  {
    id: "3",
    name: "Emily Park",
    role: "Backend Engineer",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    verified: false,
    skills: ["Go", "Kubernetes", "PostgreSQL", "Redis", "Docker"],
    interests: ["FinTech", "Web3", "DevOps"],
    bio: "Systems programmer who loves distributed systems and scale.",
    github: "emilypark",
    linkedin: "emily-park",
    college: "IIT Delhi",
    year: "2nd",
  },
  {
    id: "4",
    name: "Alex Kim",
    role: "Full Stack",
    avatar:
      "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400",
    verified: true,
    skills: ["React", "Node.js", "MongoDB", "GraphQL"],
    interests: ["Gaming", "AR/VR", "Social Impact"],
    bio: "Full-stack developer building indie games on weekends.",
    github: "alexkim",
    linkedin: "alex-kim",
    college: "BITS Pilani",
    year: "3rd",
  },
];

// ─── Year index for experience matching ───────────────────────────────────────
const yearIndex: Record<string, number> = {
  "1st": 1,
  "2nd": 2,
  "3rd": 3,
  "4th": 4,
  Graduate: 5,
};

const normalizeIdentifier = (value: string) => value.trim().toLowerCase();

// ─── Role complementarity table ───────────────────────────────────────────────
const roleBoost = (myRole: string, theirRole: string): number => {
  const complementary: Record<string, string[]> = {
    "Frontend Dev": ["ML Engineer", "Backend Engineer", "UI/UX Designer", "DevOps"],
    "Backend Engineer": ["Frontend Dev", "UI/UX Designer", "ML Engineer", "DevOps"],
    "ML Engineer": ["Frontend Dev", "Backend Engineer", "Full Stack", "UI/UX Designer"],
    "UI/UX Designer": ["Frontend Dev", "Backend Engineer", "Full Stack", "ML Engineer"],
    "Full Stack": ["ML Engineer", "UI/UX Designer", "DevOps"],
    DevOps: ["Frontend Dev", "Backend Engineer", "ML Engineer", "Full Stack"],
  };
  if (myRole === theirRole) return 0;
  const list = complementary[myRole] ?? [];
  return list.includes(theirRole) ? 15 : 8;
};

// ─── Core Rating Function ─────────────────────────────────────────────────────
function computeRating(candidate: Teammate): RatingBreakdown {
  const mySkillSet = new Set(ME.skills);
  const theirSkillSet = new Set(candidate.skills);
  const myInterestSet = new Set(ME.interests);

  // 1. Skills they have that you don't (complement to you)
  const complement = candidate.skills.filter((s) => !mySkillSet.has(s));
  const skillComplement = Math.min(complement.length, 5); // cap at 5

  // 2. Shared project interests
  const shared = candidate.interests.filter((i) => myInterestSet.has(i));
  const commonInterests = Math.min(shared.length, 5);

  // 3. Skills you have that they don't (you add value to them)
  const reverse = ME.skills.filter((s) => !theirSkillSet.has(s));
  const reverseComplement = Math.min(reverse.length, 5);

  // 4. Experience match: same year = 3, 1yr diff = 2, 2yr = 1, 3+yr = 0
  const myYr = yearIndex[ME.year] ?? 3;
  const theirYr = yearIndex[candidate.year] ?? 3;
  const diff = Math.abs(myYr - theirYr);
  const expScore = diff === 0 ? 3 : diff === 1 ? 2 : diff === 2 ? 1 : 0;

  // 5. Same college bonus
  const collegeBonus =
    normalizeIdentifier(ME.college) === normalizeIdentifier(candidate.college)
      ? 1
      : 0;

  // 6. Extra skill breadth (beyond complement, capped at 5)
  const extraSkills = Math.min(complement.length, 5);

  // 7. Role complementarity boost
  const projBoost = roleBoost(ME.role, candidate.role);

  // Raw score
  const raw =
    skillComplement * 12 +
    commonInterests * 10 +
    reverseComplement * 5 +
    expScore * 8 +
    collegeBonus * 3 +
    extraSkills * 2 +
    projBoost;

  // Normalize to 0–100 (max theoretical raw = 187), scale by 1.4 for realistic range
  const score = Math.min(100, Math.round((raw / 187) * 100 * 1.4));

  return {
    skillComplement,
    commonInterests,
    reverseComplement,
    experienceMatch: expScore,
    sameCollege: collegeBonus,
    extraSkills,
    projectBoost: projBoost,
    raw,
    score,
    labels: [
      { key: "Skill Complement", value: skillComplement, max: 5, contribution: skillComplement * 12 },
      { key: "Shared Interests", value: commonInterests, max: 5, contribution: commonInterests * 10 },
      { key: "Reverse Complement", value: reverseComplement, max: 5, contribution: reverseComplement * 5 },
      { key: "Experience Match", value: expScore, max: 3, contribution: expScore * 8 },
      { key: "Same College", value: collegeBonus, max: 1, contribution: collegeBonus * 3 },
      { key: "Extra Skills", value: extraSkills, max: 5, contribution: extraSkills * 2 },
      { key: "Role Boost", value: projBoost, max: 15, contribution: projBoost },
    ],
  };
}

// ─── Score colour helper ──────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 80) return { text: "#10B981", bg: "#ECFDF5", ring: "#10B981" };
  if (score >= 60) return { text: "#6366F1", bg: "#EEF2FF", ring: "#6366F1" };
  return { text: "#F59E0B", bg: "#FFFBEB", ring: "#F59E0B" };
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  // Reduced radius to make the score ring smaller so the card fits better on smaller screens
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const col = scoreColor(score);

  const size = 110; // SVG size (diameter + stroke)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth="10" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={col.ring}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ color: col.text }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, type: "spring" }}
          className="text-2xl font-black"
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-semibold uppercase tracking-wide opacity-60">
          Match
        </span>
      </div>
    </div>
  );
}

// ─── Rating Breakdown Panel ───────────────────────────────────────────────────
function RatingBreakdownPanel({
  breakdown,
  open,
}: {
  breakdown: RatingBreakdown;
  open: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 overflow-hidden dark:border-slate-700 dark:bg-slate-800"
        >
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-3">
            Score Breakdown
          </p>
          <div className="space-y-2">
            {breakdown.labels.map((l) => {
              const pct = l.max > 0 ? (l.value / l.max) * 100 : 0;
              return (
                <div key={l.key}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[12px] text-slate-600 font-medium">{l.key}</span>
                    <span className="text-[11px] text-indigo-600 font-bold">+{l.contribution} pts</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.05 }}
                      className="h-full rounded-full bg-indigo-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="text-[11px] text-slate-400 dark:text-slate-400">Raw score</span>
            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{breakdown.raw} / 187</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function MatchingPage({ onNavigate = () => {} }: MatchingPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [direction, setDirection] = useState(1);

  const currentUser = teammates[currentIndex];
  const breakdown = currentUser ? computeRating(currentUser) : null;
  const col = breakdown ? scoreColor(breakdown.score) : null;

  const advance = (invited: boolean) => {
    setDirection(invited ? -1 : 1);
    setShowBreakdown(false);
    if (invited && currentUser) {
      setInvitedUsers((p) => [...p, currentUser.id]);
    }
    setCurrentIndex((i) => i + 1);
  };

  if (!currentUser || !breakdown || !col) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-indigo-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">All caught up!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-xs">
          You've reviewed everyone. {invitedUsers.length} invite{invitedUsers.length !== 1 ? "s" : ""} sent.
        </p>
        <button
          onClick={() => onNavigate?.("team")}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          Go to My Team →
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 pt-24 pb-20"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Find Teammates</h1>
          <p className="text-sm text-slate-400 dark:text-slate-400 mt-0.5">
            {teammates.length - currentIndex} profiles left · {invitedUsers.length} invited
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-6">
          {teammates.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                flex: i === currentIndex ? 2.5 : 1,
                background:
                  i < currentIndex
                    ? "#10B981"
                    : i === currentIndex
                    ? "#6366F1"
                    : "#E2E8F0",
              }}
            />
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUser.id}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden mb-4 dark:border-slate-800 dark:bg-slate-900"
            style={{ boxShadow: "0 2px 24px 0 rgba(0,0,0,0.06)" }}
          >
            {/* Top banner */}
            <div className="h-16 bg-gradient-to-br from-slate-50 to-indigo-50 relative dark:from-slate-900 dark:to-slate-950">
              <div
                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: col.bg, color: col.text }}
              >
                {breakdown.score >= 80 ? "🔥 Hot Match" : breakdown.score >= 60 ? "✨ Good Match" : "👀 Explore"}
              </div>
            </div>

              <div className="px-5 pb-5">
              {/* Avatar row */}
                <div className="flex items-end justify-between -mt-8 mb-4">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-white shadow-sm"
                  />
                <ScoreRing score={breakdown.score} />
              </div>

              {/* Name + role */}
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</h2>
                {currentUser.verified && (
                  <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-50">
                    <Shield className="w-3 h-3 text-blue-500" />
                    <span className="text-[10px] font-bold text-blue-600">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-sm font-semibold text-indigo-500 mb-1">{currentUser.role}</p>
              <p className="text-sm text-slate-500 dark:text-slate-300 mb-3">
                <span className="font-semibold" style={{ color: col.text }}>
                  {breakdown.score}/100
                </span>{" "}match score
              </p>

              {/* College + year */}
              <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-400 mb-3">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {currentUser.college}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {currentUser.year} year
                </span>
                {normalizeIdentifier(ME.college) === normalizeIdentifier(currentUser.college) && (
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-semibold">
                    Same college ✓
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed mb-5">{currentUser.bio}</p>

              {/* Why matched */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                  Why matched
                </p>
                <div className="flex flex-wrap gap-2">
                  {breakdown.skillComplement > 0 && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      <Zap className="w-3 h-3" /> {breakdown.skillComplement} new skill{breakdown.skillComplement > 1 ? "s" : ""}
                    </span>
                  )}
                  {breakdown.commonInterests > 0 && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold">
                      <Star className="w-3 h-3" /> {breakdown.commonInterests} shared interest{breakdown.commonInterests > 1 ? "s" : ""}
                    </span>
                  )}
                  {breakdown.projectBoost === 15 && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                      <Award className="w-3 h-3" /> Role complement
                    </span>
                  )}
                  {breakdown.sameCollege === 1 && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold">
                      <Building2 className="w-3 h-3" /> Same college
                    </span>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.skills.map((skill) => {
                    const isComplement = !ME.skills.includes(skill);
                    return (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{
                          background: isComplement ? "#EEF2FF" : "#F8FAFC",
                          color: isComplement ? "#4F46E5" : "#64748B",
                          border: isComplement ? "1px solid #C7D2FE" : "1px solid #E2E8F0",
                        }}
                      >
                        {skill}
                        {isComplement && (
                          <span className="ml-1 text-[9px] text-indigo-400 font-bold">NEW</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Interests */}
              <div className="mb-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.interests.map((interest) => {
                    const shared = ME.interests.includes(interest);
                    return (
                      <span
                        key={interest}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{
                          background: shared ? "#F0FDF4" : "#F8FAFC",
                          color: shared ? "#15803D" : "#64748B",
                          border: shared ? "1px solid #BBF7D0" : "1px solid #E2E8F0",
                        }}
                      >
                        {interest}
                        {shared && <span className="ml-1">✓</span>}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Score breakdown toggle */}
              <button
                onClick={() => setShowBreakdown((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors mb-1 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-200">
                  <Info className="w-4 h-4 text-indigo-400" />
                  Score breakdown
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black" style={{ color: col.text }}>
                    {breakdown.score}/100
                  </span>
                  <ChevronRight
                    className="w-4 h-4 text-slate-400 transition-transform"
                    style={{ transform: showBreakdown ? "rotate(90deg)" : "none" }}
                  />
                </div>
              </button>

              <RatingBreakdownPanel breakdown={breakdown} open={showBreakdown} />

              {/* Social links */}
              <div className="flex gap-2 mt-4">
                <button className="p-2 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                  <Github className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                  <Linkedin className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                  <Mail className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => advance(false)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-slate-100 text-slate-500 font-semibold text-sm hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <X className="w-4 h-4" />
            Pass
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => advance(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
            style={{ boxShadow: "0 4px 14px 0 rgba(99,102,241,0.3)" }}
          >
            <Check className="w-4 h-4" />
            Invite
          </motion.button>
        </div>

        {/* Bottom nav link */}
        <div className="mt-5 text-center">
          <button
            onClick={() => onNavigate?.("team")}
            className="text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
          >
            View My Team · {invitedUsers.length} invited
          </button>
        </div>
      </div>
    </div>
  );
}
