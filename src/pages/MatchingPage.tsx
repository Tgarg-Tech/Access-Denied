import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Building2,
  Check,
  Clock,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface MatchingPageProps {
  onNavigate?: (page: string) => void;
}

interface ProfileRecord {
  id: string;
  username?: string;
  fullName?: string;
  email?: string;
  college: string;
  year: string;
  role: string;
  interest: string;
  projectTypes: string[];
  technicalSkills: string[];
  avatar?: string;
  verification?: {
    githubUrl?: string;
    linkedinUrl?: string;
    resumeUrl?: string;
    certificateLinks?: string[];
    status?: string;
  };
}

interface TeamRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderName?: string;
  receiverName?: string;
  senderAvatar?: string;
  status: "pending" | "accepted" | "declined";
  teamId?: string;
  createdAt?: Timestamp;
}

interface TeamRecord {
  members?: string[];
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
}

const DEFAULT_AVATAR =
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400";
const MAX_OUTGOING_PENDING_REQUESTS = 5;

const yearIndex: Record<string, number> = {
  "1st": 1,
  "2nd": 2,
  "3rd": 3,
  "4th": 4,
  Graduate: 5,
};

const normalizeIdentifier = (value?: string) =>
  (value || "").trim().toLowerCase();

const getUsernameFromEmail = (email?: string) =>
  (email || "").split("@")[0] || "";

const getDisplayName = (profile: ProfileRecord) =>
  profile.fullName || profile.username || profile.email || "Unknown User";

const getInitial = (profile: ProfileRecord) =>
  getDisplayName(profile).charAt(0).toUpperCase();

const getVerificationLinks = (profile: ProfileRecord) => {
  const links: Array<{ label: string; url: string }> = [];

  if (profile.verification?.githubUrl) {
    links.push({ label: "GitHub", url: profile.verification.githubUrl });
  }
  if (profile.verification?.linkedinUrl) {
    links.push({ label: "LinkedIn", url: profile.verification.linkedinUrl });
  }
  if (profile.verification?.resumeUrl) {
    links.push({ label: "Resume", url: profile.verification.resumeUrl });
  }
  (profile.verification?.certificateLinks || []).forEach((url, index) => {
    if (url?.trim()) {
      links.push({ label: `Certificate ${index + 1}`, url: url.trim() });
    }
  });

  return links;
};

const isProfileVerified = (profile: ProfileRecord) =>
  getVerificationLinks(profile).length > 0;

const roleBoost = (myRole: string, theirRole: string): number => {
  const complementary: Record<string, string[]> = {
    "Frontend Dev": [
      "ML Engineer",
      "Backend Engineer",
      "UI/UX Designer",
      "DevOps",
    ],
    "Backend Engineer": [
      "Frontend Dev",
      "UI/UX Designer",
      "ML Engineer",
      "DevOps",
    ],
    "ML Engineer": [
      "Frontend Dev",
      "Backend Engineer",
      "Full Stack",
      "UI/UX Designer",
    ],
    "UI/UX Designer": [
      "Frontend Dev",
      "Backend Engineer",
      "Full Stack",
      "ML Engineer",
    ],
    "Full Stack": ["ML Engineer", "UI/UX Designer", "DevOps"],
    DevOps: ["Frontend Dev", "Backend Engineer", "ML Engineer", "Full Stack"],
  };
  if (myRole === theirRole) return 0;
  const list = complementary[myRole] ?? [];
  return list.includes(theirRole) ? 15 : 8;
};

function computeRating(
  me: ProfileRecord,
  candidate: ProfileRecord,
): RatingBreakdown {
  const mySkillSet = new Set(me.technicalSkills);
  const theirSkillSet = new Set(candidate.technicalSkills);
  const myInterestSet = new Set(me.projectTypes);

  const complement = candidate.technicalSkills.filter(
    (s) => !mySkillSet.has(s),
  );
  const skillComplement = Math.min(complement.length, 5);

  const shared = candidate.projectTypes.filter((i) => myInterestSet.has(i));
  const commonInterests = Math.min(shared.length, 5);

  const reverse = me.technicalSkills.filter((s) => !theirSkillSet.has(s));
  const reverseComplement = Math.min(reverse.length, 5);

  const myYr = yearIndex[me.year] ?? 3;
  const theirYr = yearIndex[candidate.year] ?? 3;
  const diff = Math.abs(myYr - theirYr);
  const expScore = diff === 0 ? 3 : diff === 1 ? 2 : diff === 2 ? 1 : 0;

  const collegeBonus =
    normalizeIdentifier(me.college) === normalizeIdentifier(candidate.college)
      ? 1
      : 0;

  const extraSkills = Math.min(complement.length, 5);
  const projBoost = roleBoost(me.role, candidate.role);

  const raw =
    skillComplement * 12 +
    commonInterests * 10 +
    reverseComplement * 5 +
    expScore * 8 +
    collegeBonus * 3 +
    extraSkills * 2 +
    projBoost;

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
  };
}

function scoreColor(score: number) {
  if (score >= 80) return { text: "#10B981", bg: "#ECFDF5", ring: "#10B981" };
  if (score >= 60) return { text: "#6366F1", bg: "#EEF2FF", ring: "#6366F1" };
  return { text: "#F59E0B", bg: "#FFFBEB", ring: "#F59E0B" };
}

function ScoreRing({ score }: { score: number }) {
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const col = scoreColor(score);

  const size = 110; // SVG size (diameter + stroke)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth="10"
        />
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

export function MatchingPage({ onNavigate = () => {} }: MatchingPageProps) {
  const { user } = useAuth();
  const [reviewedCandidateIds, setReviewedCandidateIds] = useState<Set<string>>(
    new Set(),
  );
  const [profiles, setProfiles] = useState<ProfileRecord[]>([]);
  const [myProfile, setMyProfile] = useState<ProfileRecord | null>(null);
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [myTeamMemberIds, setMyTeamMemberIds] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyRequestFor, setBusyRequestFor] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);
  const [showVerificationLinks, setShowVerificationLinks] = useState(false);

  const ownEmail = normalizeIdentifier(user?.email);
  const ownUsername = normalizeIdentifier(getUsernameFromEmail(user?.email));

  const isCurrentUserProfile = (profile: ProfileRecord) => {
    if (user?.uid && profile.id === user.uid) return true;
    if (ownEmail && normalizeIdentifier(profile.email) === ownEmail)
      return true;
    if (ownUsername && normalizeIdentifier(profile.username) === ownUsername) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!db || !user?.uid) {
      setLoading(false);
      if (!db) {
        setError("Matching is unavailable because Firebase is not configured.");
      }
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      collection(db, "profiles"),
      (snapshot) => {
        const allProfiles: ProfileRecord[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Record<string, unknown>;
          return {
            id: docSnap.id,
            username: (data.username as string) || "",
            fullName: (data.fullName as string) || "",
            email: (data.email as string) || "",
            college: (data.college as string) || "",
            year: (data.collegeYear as string) || "",
            role: (data.preferredRole as string) || "",
            interest: (data.interest as string) || "",
            projectTypes: Array.isArray(data.projectTypes)
              ? (data.projectTypes as string[])
              : [],
            technicalSkills: Array.isArray(data.technicalSkills)
              ? (data.technicalSkills as string[])
              : [],
            avatar: (data.avatar as string) || "",
            verification:
              data.verification && typeof data.verification === "object"
                ? {
                    githubUrl:
                      ((data.verification as Record<string, unknown>)
                        .githubUrl as string) || "",
                    linkedinUrl:
                      ((data.verification as Record<string, unknown>)
                        .linkedinUrl as string) || "",
                    resumeUrl:
                      ((data.verification as Record<string, unknown>)
                        .resumeUrl as string) || "",
                    certificateLinks: Array.isArray(
                      (data.verification as Record<string, unknown>)
                        .certificateLinks,
                    )
                      ? ((data.verification as Record<string, unknown>)
                          .certificateLinks as string[]) || []
                      : [],
                    status:
                      ((data.verification as Record<string, unknown>)
                        .status as string) || "",
                  }
                : undefined,
          };
        });

        const mine = allProfiles.find((p) => isCurrentUserProfile(p)) || null;
        setMyProfile(mine);
        setProfiles(allProfiles.filter((p) => !isCurrentUserProfile(p)));
        setLoading(false);
      },
      (snapshotError) => {
        console.error("Failed to subscribe profiles:", snapshotError);
        setError("Could not load matching users right now.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [ownEmail, ownUsername, user?.uid]);

  useEffect(() => {
    if (!db || !user?.uid) return;

    const senderUnsub = onSnapshot(
      collection(db, "teamRequests"),
      (snapshot) => {
        const requests = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<TeamRequest, "id">),
          }))
          .filter(
            (req) => req.senderId === user.uid || req.receiverId === user.uid,
          );
        setTeamRequests(requests);
      },
      (snapshotError) => {
        console.error("Failed to subscribe team requests:", snapshotError);
      },
    );

    return senderUnsub;
  }, [user?.uid]);

  useEffect(() => {
    if (!db || !user?.uid) return;

    const teamQuery = query(
      collection(db, "teams"),
      where("members", "array-contains", user.uid),
    );

    const unsubscribe = onSnapshot(
      teamQuery,
      (snapshot) => {
        const memberIds = new Set<string>();

        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data() as TeamRecord;
          (data.members || []).forEach((memberId) => {
            if (memberId !== user.uid) {
              memberIds.add(memberId);
            }
          });
        });

        setMyTeamMemberIds(memberIds);
      },
      (snapshotError) => {
        console.error("Failed to subscribe teams:", snapshotError);
      },
    );

    return unsubscribe;
  }, [user?.uid]);

  const excludedCandidateIds = useMemo(() => {
    const excluded = new Set<string>();

    if (user?.uid) {
      excluded.add(user.uid);
    }

    myTeamMemberIds.forEach((memberId) => excluded.add(memberId));

    teamRequests.forEach((request) => {
      if (request.status === "pending") {
        if (request.senderId === user?.uid) excluded.add(request.receiverId);
        if (request.receiverId === user?.uid) excluded.add(request.senderId);
      }
    });

    return excluded;
  }, [myTeamMemberIds, teamRequests, user?.uid]);

  const rankedCandidates = useMemo(() => {
    if (!myProfile) return [];
    const myInterests = new Set(
      (myProfile.projectTypes || []).map((item) => normalizeIdentifier(item)),
    );

    const withScores = profiles
      .filter((candidate) => !isCurrentUserProfile(candidate))
      .filter((candidate) => !excludedCandidateIds.has(candidate.id))
      .map((candidate) => {
        const sharedInterests = candidate.projectTypes.filter((tag) =>
          myInterests.has(normalizeIdentifier(tag)),
        );
        return {
          candidate,
          breakdown: computeRating(myProfile, candidate),
          sharedInterests,
        };
      })
      .filter(({ sharedInterests }) => {
        if (myInterests.size === 0) return true;
        return sharedInterests.length > 0;
      })
      .sort((a, b) => b.breakdown.score - a.breakdown.score);

    return withScores;
  }, [
    excludedCandidateIds,
    myProfile,
    ownEmail,
    ownUsername,
    profiles,
    user?.uid,
  ]);

  const currentEntry = rankedCandidates.find(
    (entry) => !reviewedCandidateIds.has(entry.candidate.id),
  );
  const currentUser = currentEntry?.candidate;
  const verificationLinks = currentUser
    ? getVerificationLinks(currentUser)
    : [];
  const currentUserIsVerified = currentUser
    ? isProfileVerified(currentUser)
    : false;
  const breakdown = currentEntry?.breakdown;
  const col = breakdown ? scoreColor(breakdown.score) : null;
  const currentIndex = currentUser
    ? rankedCandidates.findIndex(
        (entry) => entry.candidate.id === currentUser.id,
      )
    : rankedCandidates.length;

  const requestWithCurrent = currentUser
    ? teamRequests.find(
        (req) =>
          (req.senderId === user?.uid && req.receiverId === currentUser.id) ||
          (req.senderId === currentUser.id && req.receiverId === user?.uid),
      )
    : null;

  const outgoingPendingRequestsCount = useMemo(
    () =>
      teamRequests.filter(
        (req) => req.senderId === user?.uid && req.status === "pending",
      ).length,
    [teamRequests, user?.uid],
  );

  const hasReachedOutgoingPendingLimit =
    outgoingPendingRequestsCount >= MAX_OUTGOING_PENDING_REQUESTS;

  const advance = (isPass: boolean) => {
    setDirection(isPass ? 1 : -1);
    setShowVerificationLinks(false);
    if (currentUser) {
      setReviewedCandidateIds((prev) => {
        if (prev.has(currentUser.id)) return prev;
        const next = new Set(prev);
        next.add(currentUser.id);
        return next;
      });
    }
  };

  const sendRequest = async (receiver: ProfileRecord) => {
    if (!db || !user?.uid || !myProfile) return;
    if (requestWithCurrent && requestWithCurrent.status !== "declined") return;
    if (hasReachedOutgoingPendingLimit) return;

    try {
      setBusyRequestFor(receiver.id);
      await addDoc(collection(db, "teamRequests"), {
        senderId: user.uid,
        receiverId: receiver.id,
        senderName: getDisplayName(myProfile),
        senderAvatar: myProfile.avatar || DEFAULT_AVATAR,
        receiverName: getDisplayName(receiver),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      // After sending, move to the next candidate immediately.
      advance(false);
    } catch (sendError) {
      console.error("Failed to send request:", sendError);
    } finally {
      setBusyRequestFor(null);
    }
  };

  const cancelRequest = async (requestId: string) => {
    if (!db) return;
    try {
      setBusyRequestFor(currentUser?.id || null);
      await deleteDoc(doc(db, "teamRequests", requestId));
    } catch (cancelError) {
      console.error("Failed to cancel request:", cancelError);
    } finally {
      setBusyRequestFor(null);
    }
  };

  const acceptIncomingRequest = async (request: TeamRequest) => {
    if (!db || !user?.uid) return;

    try {
      setBusyRequestFor(request.senderId);
      await runTransaction(db, async (transaction) => {
        const requestRef = doc(db, "teamRequests", request.id);
        const snapshot = await transaction.get(requestRef);

        if (!snapshot.exists()) return;

        const fresh = snapshot.data() as TeamRequest;
        if (fresh.status !== "pending") return;

        const teamRef = doc(collection(db, "teams"));
        const now = serverTimestamp();

        transaction.set(teamRef, {
          teamNumber: Math.floor(Math.random() * 1000000),
          createdFromRequestId: request.id,
          members: [fresh.senderId, fresh.receiverId],
          memberDetails: [
            {
              uid: fresh.senderId,
              name: fresh.senderName || "Unknown User",
              avatar: fresh.senderAvatar || null,
              joinedAt: now,
            },
            {
              uid: fresh.receiverId,
              name: fresh.receiverName || user.email || "Unknown User",
              avatar: myProfile?.avatar || null,
              joinedAt: now,
            },
          ],
          status: "active",
          createdAt: now,
        });

        transaction.update(requestRef, {
          status: "accepted",
          teamId: teamRef.id,
          acceptedAt: now,
        });
      });
    } catch (acceptError) {
      console.error("Failed to accept request:", acceptError);
    } finally {
      setBusyRequestFor(null);
    }
  };

  const declineIncomingRequest = async (
    requestId: string,
    senderId: string,
  ) => {
    if (!db) return;
    try {
      setBusyRequestFor(senderId);
      await deleteDoc(doc(db, "teamRequests", requestId));
    } catch (declineError) {
      console.error("Failed to decline request:", declineError);
    } finally {
      setBusyRequestFor(null);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Loading matching users...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-white text-red-600 dark:bg-slate-950 dark:text-red-300 px-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {error}
      </div>
    );
  }

  if (!myProfile) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <h2 className="text-2xl font-bold mb-2">Complete your profile first</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-sm">
          Add your interests and technical skills to get meaningful teammate
          matches.
        </p>
        <button
          onClick={() => onNavigate?.("my-profile")}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  if (!currentUser || !breakdown || !col) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-indigo-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          All caught up!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-xs">
          No more interest-based profiles are available right now.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setDirection(1);
              setReviewedCandidateIds(new Set());
            }}
            disabled={rankedCandidates.length === 0}
            className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Match Again
          </button>
          <button
            onClick={() => onNavigate?.("team")}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            Go to My Team →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 pt-24 pb-20"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Find Teammates
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-400 mt-0.5">
            {
              rankedCandidates.filter(
                (entry) => !reviewedCandidateIds.has(entry.candidate.id),
              ).length
            }{" "}
            profiles left · realtime requests enabled
          </p>
        </div>

        <div className="flex gap-1.5 mb-6">
          {rankedCandidates.map((_, i) => (
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
            <div className="h-16 bg-gradient-to-br from-slate-50 to-indigo-50 relative dark:from-slate-900 dark:to-slate-950">
              <div
                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: col.bg, color: col.text }}
              >
                {breakdown.score >= 80
                  ? "🔥 Hot Match"
                  : breakdown.score >= 60
                    ? "✨ Good Match"
                    : "👀 Explore"}
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="flex items-end justify-between -mt-8 mb-4">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={getDisplayName(currentUser)}
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-white shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl ring-2 ring-white shadow-sm bg-indigo-500 text-white flex items-center justify-center font-bold text-xl">
                    {getInitial(currentUser)}
                  </div>
                )}
                <ScoreRing score={breakdown.score} />
              </div>

              <div className="flex items-start justify-between gap-2 mb-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {getDisplayName(currentUser)}
                </h2>
                <span
                  className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${
                    currentUserIsVerified
                      ? "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/25"
                      : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/25"
                  }`}
                >
                  {currentUserIsVerified ? (
                    <ShieldCheck className="w-3 h-3" />
                  ) : (
                    <ShieldAlert className="w-3 h-3" />
                  )}
                  {currentUserIsVerified ? "Verified" : "Unverified"}
                </span>
              </div>
              <p className="text-sm font-semibold text-indigo-500 mb-1">
                {currentUser.role || "Role not added"}
              </p>

              {currentUserIsVerified && (
                <div className="mb-2">
                  <button
                    onClick={() => setShowVerificationLinks((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm shadow-green-600/25"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {showVerificationLinks
                      ? "Hide Verification Links"
                      : "View Verification Links"}
                  </button>
                </div>
              )}

              <p className="text-sm text-slate-500 dark:text-slate-300 mb-3">
                <span className="font-semibold" style={{ color: col.text }}>
                  {breakdown.score}/100
                </span>{" "}
                match score
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-400 mb-3">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {currentUser.college}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {currentUser.year || "Year not added"}
                </span>
                {normalizeIdentifier(myProfile.college) ===
                  normalizeIdentifier(currentUser.college) && (
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-semibold">
                    Same college ✓
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed mb-5">
                {currentUser.interest || "No bio/interest added."}
              </p>

              <div className="mb-4">
                {currentUserIsVerified && showVerificationLinks && (
                  <div className="mt-2 p-3 rounded-xl bg-green-50/90 dark:bg-green-900/20 border border-green-300/70 dark:border-green-500/35 ring-1 ring-green-400/30 dark:ring-green-500/30 shadow-[0_8px_24px_-18px_rgba(22,163,74,0.9)]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-700 dark:text-green-300 mb-2">
                      Uploaded Links
                    </div>
                    <div className="space-y-1.5">
                      {verificationLinks.map((item) => (
                        <a
                          key={`${currentUser.id}-${item.label}-${item.url}`}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-green-100 hover:bg-green-100/80 dark:hover:bg-green-800/35 inline-flex items-center gap-1.5 break-all px-2 py-1 rounded-lg border border-green-200/80 dark:border-green-600/35 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                  Why matched
                </p>
                <div className="flex flex-wrap gap-2">
                  {breakdown.skillComplement > 0 && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      <Zap className="w-3 h-3" /> {breakdown.skillComplement}{" "}
                      new skill{breakdown.skillComplement > 1 ? "s" : ""}
                    </span>
                  )}
                  {breakdown.commonInterests > 0 && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold">
                      <Star className="w-3 h-3" /> {breakdown.commonInterests}{" "}
                      shared interest{breakdown.commonInterests > 1 ? "s" : ""}
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

              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                  Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(currentUser.technicalSkills || []).map((skill) => {
                    const isComplement = !(
                      myProfile.technicalSkills || []
                    ).includes(skill);
                    return (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{
                          background: isComplement ? "#EEF2FF" : "#F8FAFC",
                          color: isComplement ? "#4F46E5" : "#64748B",
                          border: isComplement
                            ? "1px solid #C7D2FE"
                            : "1px solid #E2E8F0",
                        }}
                      >
                        {skill}
                        {isComplement && (
                          <span className="ml-1 text-[9px] text-indigo-400 font-bold">
                            NEW
                          </span>
                        )}
                      </span>
                    );
                  })}
                  {currentUser.technicalSkills.length === 0 && (
                    <span className="text-xs text-slate-400">
                      No skills added
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                  Interests
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(currentUser.projectTypes || []).map((interest) => {
                    const shared = (myProfile.projectTypes || []).includes(
                      interest,
                    );
                    return (
                      <span
                        key={interest}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{
                          background: shared ? "#F0FDF4" : "#F8FAFC",
                          color: shared ? "#15803D" : "#64748B",
                          border: shared
                            ? "1px solid #BBF7D0"
                            : "1px solid #E2E8F0",
                        }}
                      >
                        {interest}
                        {shared && <span className="ml-1">✓</span>}
                      </span>
                    );
                  })}
                  {currentUser.projectTypes.length === 0 && (
                    <span className="text-xs text-slate-400">
                      No interests added
                    </span>
                  )}
                </div>
              </div>

              {requestWithCurrent?.status === "pending" &&
                requestWithCurrent.receiverId === user?.uid && (
                  <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                    Incoming request from{" "}
                    {requestWithCurrent.senderName || "this user"}
                  </div>
                )}

              {requestWithCurrent?.status === "accepted" && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                  Team created in Firestore{" "}
                  {requestWithCurrent.teamId
                    ? `(#${requestWithCurrent.teamId})`
                    : ""}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => advance(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-slate-100 text-slate-500 font-semibold text-sm hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <X className="w-4 h-4" />
            Pass
          </motion.button>

          {requestWithCurrent?.status === "pending" &&
          requestWithCurrent.receiverId === user?.uid ? (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={busyRequestFor === currentUser.id}
                onClick={() =>
                  declineIncomingRequest(requestWithCurrent.id, currentUser.id)
                }
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors shadow-sm disabled:opacity-70"
              >
                <X className="w-4 h-4" />
                Decline
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={busyRequestFor === currentUser.id}
                onClick={() => acceptIncomingRequest(requestWithCurrent)}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-70"
              >
                <Check className="w-4 h-4" />
                Accept
              </motion.button>
            </>
          ) : requestWithCurrent?.status === "pending" &&
            requestWithCurrent.senderId === user?.uid ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={busyRequestFor === currentUser.id}
              onClick={() => cancelRequest(requestWithCurrent.id)}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-rose-100 text-rose-700 font-semibold text-sm hover:bg-rose-200 transition-colors disabled:opacity-70"
            >
              <Clock className="w-4 h-4" />
              Withdraw Request
            </motion.button>
          ) : requestWithCurrent?.status === "accepted" ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate?.("team")}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Users className="w-4 h-4" />
              View Team
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={
                busyRequestFor === currentUser.id ||
                hasReachedOutgoingPendingLimit
              }
              onClick={() => sendRequest(currentUser)}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70"
              style={{ boxShadow: "0 4px 14px 0 rgba(99,102,241,0.3)" }}
            >
              <Check className="w-4 h-4" />
              {busyRequestFor === currentUser.id
                ? "Sending..."
                : hasReachedOutgoingPendingLimit
                  ? `Limit Reached (${MAX_OUTGOING_PENDING_REQUESTS}/${MAX_OUTGOING_PENDING_REQUESTS})`
                  : "Send Request"}
            </motion.button>
          )}
        </div>

        <div className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          Pending requests: {outgoingPendingRequestsCount}/
          {MAX_OUTGOING_PENDING_REQUESTS}
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={() => onNavigate?.("team")}
            className="text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
          >
            View My Team
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            Requests and acceptances sync in realtime via Firestore.
          </span>
        </div>
      </div>
    </div>
  );
}
