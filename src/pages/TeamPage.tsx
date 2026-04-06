import { motion } from "framer-motion";
import { AlertCircle, Check, Clock, Mail, Plus, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface TeamPageProps {
  onNavigate: (page: string) => void;
  onOpenSkillModal: () => void;
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

interface ProfileRecord {
  id: string;
  username?: string;
  fullName?: string;
  email?: string;
  preferredRole?: string;
  technicalSkills?: string[];
  avatar?: string;
}

interface TeamDocument {
  id: string;
  members?: string[];
  memberDetails?: Array<{
    uid?: string;
    name?: string;
    avatar?: string | null;
  }>;
  status?: string;
  createdAt?: Timestamp;
}

const TEAM_TARGET_SIZE = 5;
const DEFAULT_AVATAR =
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400";

const toMillis = (value?: Timestamp) => value?.toMillis?.() || 0;

const getProfileName = (profile?: ProfileRecord | null) =>
  profile?.fullName || profile?.username || profile?.email || "Unknown User";

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
          className="stroke-[#D8E1EE] dark:stroke-[#22304A]"
          strokeWidth="16"
          fill="none"
        />
        <motion.circle
          cx="112"
          cy="112"
          r={radius}
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ stroke: "url(#team-readiness-gradient)" }}
        />
        <defs>
          <linearGradient
            id="team-readiness-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-950/90 border border-white/70 dark:border-slate-700 shadow-lg text-5xl font-black text-[#4F46E5] dark:text-[#8EA2FF]"
        >
          {score}%
        </motion.div>
        <div className="mt-2 text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] tracking-wide">
          Team Readiness
        </div>
      </div>
    </div>
  );
}

export function TeamPage({ onNavigate, onOpenSkillModal }: TeamPageProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [profilesMap, setProfilesMap] = useState<Map<string, ProfileRecord>>(
    new Map(),
  );
  const [myTeams, setMyTeams] = useState<TeamDocument[]>([]);
  const [actionRequestId, setActionRequestId] = useState<string | null>(null);
  const [isLeavingTeam, setIsLeavingTeam] = useState(false);

  useEffect(() => {
    if (!db || !user?.uid) {
      setIsLoading(false);
      return;
    }

    const unsubscribeProfiles = onSnapshot(
      collection(db, "profiles"),
      (snapshot) => {
        const nextMap = new Map<string, ProfileRecord>();
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data() as Omit<ProfileRecord, "id">;
          nextMap.set(docSnap.id, { id: docSnap.id, ...data });
        });
        setProfilesMap(nextMap);
      },
      (err) => {
        console.error("Failed to subscribe profiles:", err);
      },
    );

    const requestsUnsubscribe = onSnapshot(
      collection(db, "teamRequests"),
      (snapshot) => {
        const requests = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<TeamRequest, "id">),
          }))
          .filter(
            (req) => req.senderId === user.uid || req.receiverId === user.uid,
          )
          .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

        setTeamRequests(requests);
      },
      (err) => {
        console.error("Failed to subscribe team requests:", err);
      },
    );

    const teamsQuery = query(
      collection(db, "teams"),
      where("members", "array-contains", user.uid),
    );

    const teamsUnsubscribe = onSnapshot(
      teamsQuery,
      (snapshot) => {
        const teams = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<TeamDocument, "id">),
          }))
          .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

        setMyTeams(teams);
        setIsLoading(false);
      },
      (err) => {
        console.error("Failed to subscribe teams:", err);
        setIsLoading(false);
      },
    );

    return () => {
      unsubscribeProfiles();
      requestsUnsubscribe();
      teamsUnsubscribe();
    };
  }, [user?.uid]);

  const activeTeam = myTeams[0] || null;

  const currentMembers = useMemo(() => {
    const memberIds = activeTeam?.members || (user?.uid ? [user.uid] : []);

    return memberIds.map((memberId) => {
      const profile = profilesMap.get(memberId);
      const detail = activeTeam?.memberDetails?.find((d) => d.uid === memberId);

      return {
        id: memberId,
        name: detail?.name || getProfileName(profile),
        role: profile?.preferredRole || "Role not added",
        avatar: detail?.avatar || profile?.avatar || DEFAULT_AVATAR,
        skills: profile?.technicalSkills || [],
        status: memberId === user?.uid ? "You" : "Member",
      };
    });
  }, [activeTeam, profilesMap, user?.uid]);

  const incomingPending = useMemo(
    () =>
      teamRequests.filter(
        (req) => req.receiverId === user?.uid && req.status === "pending",
      ),
    [teamRequests, user?.uid],
  );

  const outgoingPending = useMemo(
    () =>
      teamRequests.filter(
        (req) => req.senderId === user?.uid && req.status === "pending",
      ),
    [teamRequests, user?.uid],
  );

  const acceptedRequests = useMemo(
    () =>
      teamRequests.filter(
        (req) =>
          (req.senderId === user?.uid || req.receiverId === user?.uid) &&
          req.status === "accepted",
      ),
    [teamRequests, user?.uid],
  );

  const teamReadiness = Math.min(
    100,
    Math.round((currentMembers.length / TEAM_TARGET_SIZE) * 100),
  );

  const acceptRequest = async (requestId: string) => {
    if (!db || !user?.uid) return;

    try {
      setActionRequestId(requestId);
      const request = teamRequests.find((req) => req.id === requestId);
      if (!request) return;

      const teamDocRef = await addDoc(collection(db, "teams"), {
        teamNumber: Math.floor(Math.random() * 1000000),
        members: [request.senderId, request.receiverId],
        memberDetails: [
          {
            uid: request.senderId,
            name:
              request.senderName ||
              getProfileName(profilesMap.get(request.senderId)) ||
              "Unknown User",
            avatar:
              request.senderAvatar ||
              profilesMap.get(request.senderId)?.avatar ||
              null,
            joinedAt: serverTimestamp(),
          },
          {
            uid: request.receiverId,
            name:
              request.receiverName ||
              user.email ||
              getProfileName(profilesMap.get(request.receiverId)),
            avatar: profilesMap.get(request.receiverId)?.avatar || null,
            joinedAt: serverTimestamp(),
          },
        ],
        createdAt: serverTimestamp(),
        status: "active",
      });

      await updateDoc(doc(db, "teamRequests", requestId), {
        status: "accepted",
        teamId: teamDocRef.id,
      });
    } catch (err) {
      console.error("Failed to accept request:", err);
    } finally {
      setActionRequestId(null);
    }
  };

  const declineRequest = async (requestId: string) => {
    if (!db) return;
    try {
      setActionRequestId(requestId);
      await deleteDoc(doc(db, "teamRequests", requestId));
    } catch (err) {
      console.error("Failed to decline request:", err);
    } finally {
      setActionRequestId(null);
    }
  };

  const cancelRequest = async (requestId: string) => {
    if (!db) return;
    try {
      setActionRequestId(requestId);
      await deleteDoc(doc(db, "teamRequests", requestId));
    } catch (err) {
      console.error("Failed to cancel request:", err);
    } finally {
      setActionRequestId(null);
    }
  };

  const leaveActiveTeam = async () => {
    if (!db || !user?.uid || !activeTeam?.id) return;

    try {
      setIsLeavingTeam(true);

      const acceptedRequestsSnapshot = await getDocs(
        query(
          collection(db, "teamRequests"),
          where("teamId", "==", activeTeam.id),
          where("status", "==", "accepted"),
        ),
      );

      await runTransaction(db, async (transaction) => {
        const teamRef = doc(db, "teams", activeTeam.id);
        const snapshot = await transaction.get(teamRef);

        if (!snapshot.exists()) return;

        const data = snapshot.data() as TeamDocument;
        const currentMembers = data.members || [];
        const nextMembers = currentMembers.filter((id) => id !== user.uid);

        if (nextMembers.length === currentMembers.length) {
          return;
        }

        if (nextMembers.length === 0) {
          transaction.delete(teamRef);
        } else {
          const nextMemberDetails = (data.memberDetails || []).filter(
            (detail) => detail.uid !== user.uid,
          );

          transaction.update(teamRef, {
            members: nextMembers,
            memberDetails: nextMemberDetails,
            updatedAt: serverTimestamp(),
          });
        }

        acceptedRequestsSnapshot.docs.forEach((requestDoc) => {
          transaction.delete(doc(db, "teamRequests", requestDoc.id));
        });
      });
    } catch (err) {
      console.error("Failed to leave team:", err);
    } finally {
      setIsLeavingTeam(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] pt-24 pb-20 px-6 flex items-center justify-center text-[#64748B] dark:text-[#94A3B8]">
        Loading your team...
      </div>
    );
  }

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
            Realtime status of your team, pending sent and received requests.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121A2B] shadow-xl"
        >
          <div className="grid lg:grid-cols-[auto,1fr] gap-8 items-center p-8 bg-[radial-gradient(circle_at_top_right,_rgba(124,58,237,0.14),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.12),_transparent_36%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(124,58,237,0.22),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_36%)]">
            <div className="flex justify-center">
              <TeamReadinessRing score={teamReadiness} />
            </div>

            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 text-sm font-semibold mb-4 border border-violet-500/10 dark:border-violet-400/20">
                <Users className="w-4 h-4" />
                Team Overview
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                Team Readiness: {currentMembers.length}/{TEAM_TARGET_SIZE}
              </h2>
              <p className="text-[#64748B] dark:text-[#94A3B8] mb-6 max-w-2xl">
                Your readiness updates live as members join or leave. The score
                is always shown with strong contrast for both light and dark
                themes.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate("matching")}
                  className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 hover:shadow-xl transition-all"
                >
                  Find More Members
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenSkillModal}
                  className="px-6 py-3 bg-white dark:bg-[#0B1020] text-[#0F172A] dark:text-[#F8FAFC] font-semibold rounded-xl border border-black/10 dark:border-white/10 hover:bg-[#F8FAFC] dark:hover:bg-[#132036] transition-all"
                >
                  Verify Your Skills
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={leaveActiveTeam}
                  disabled={!activeTeam || isLeavingTeam}
                  className="px-6 py-3 bg-red-500/10 text-red-600 dark:text-red-300 font-semibold rounded-xl border border-red-500/20 hover:bg-red-500/15 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLeavingTeam
                    ? "Leaving..."
                    : activeTeam
                      ? "Leave Team"
                      : "Not in Team"}
                </motion.button>
              </div>
            </div>
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
                {currentMembers.length} / {TEAM_TARGET_SIZE}
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
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                          {member.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold">
                          {member.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-2">
                        {member.role}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.length > 0 ? (
                          member.skills.slice(0, 5).map((skill) => (
                            <span
                              key={`${member.id}-${skill}`}
                              className="px-2 py-0.5 rounded bg-violet-500/10 text-xs text-violet-600 dark:text-violet-400"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#94A3B8]">
                            No skills added
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {member.id === user?.uid && (
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
                <Mail className="w-6 h-6 mr-3 text-blue-500" />
                Pending Sent
              </h2>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                {outgoingPending.length}
              </span>
            </div>

            {outgoingPending.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto mb-3 text-[#64748B] dark:text-[#94A3B8]" />
                <p className="text-[#64748B] dark:text-[#94A3B8] mb-4">
                  No pending sent requests
                </p>
                <button
                  onClick={() => onNavigate("matching")}
                  className="text-violet-500 hover:text-violet-600 font-medium transition-colors"
                >
                  Find teammates
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {outgoingPending.map((request) => {
                  const receiver = profilesMap.get(request.receiverId);
                  const receiverName =
                    request.receiverName || getProfileName(receiver);
                  const receiverAvatar = receiver?.avatar || DEFAULT_AVATAR;

                  return (
                    <div
                      key={request.id}
                      className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/5 dark:border-white/5"
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <img
                          src={receiverAvatar}
                          alt={receiverName}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                            {receiverName}
                          </h3>
                          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending approval
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => cancelRequest(request.id)}
                        disabled={actionRequestId === request.id}
                        className="w-full py-2.5 rounded-lg bg-red-500/20 dark:bg-red-500/20 hover:bg-red-500/40 dark:hover:bg-red-500/40 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2 transition-all border border-red-300 dark:border-red-500/40 disabled:opacity-70"
                      >
                        <X className="w-4 h-4" />
                        {actionRequestId === request.id
                          ? "Working..."
                          : "Withdraw"}
                      </button>
                    </div>
                  );
                })}
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
              <Clock className="w-6 h-6 mr-3 text-orange-500" />
              Pending Received
            </h2>
            <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-semibold">
              {incomingPending.length}
            </span>
          </div>

          {incomingPending.length === 0 ? (
            <div className="text-center py-10 text-[#64748B] dark:text-[#94A3B8]">
              No incoming requests right now.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {incomingPending.map((request) => {
                const sender = profilesMap.get(request.senderId);
                const senderName = request.senderName || getProfileName(sender);
                const senderAvatar =
                  request.senderAvatar || sender?.avatar || DEFAULT_AVATAR;

                return (
                  <div
                    key={request.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/5 dark:border-white/5"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={senderAvatar}
                        alt={senderName}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                          {senderName}
                        </h3>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                          Wants to team up
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => acceptRequest(request.id)}
                        disabled={actionRequestId === request.id}
                        className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                      >
                        <Check className="w-4 h-4" />
                        {actionRequestId === request.id
                          ? "Working..."
                          : "Accept"}
                      </button>
                      <button
                        onClick={() => declineRequest(request.id)}
                        disabled={actionRequestId === request.id}
                        className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                      >
                        <X className="w-4 h-4" />
                        {actionRequestId === request.id
                          ? "Working..."
                          : "Decline"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center">
                <Check className="w-6 h-6 mr-3 text-emerald-500" />
                Accepted Requests
              </h2>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                {acceptedRequests.length}
              </span>
            </div>

            {acceptedRequests.length === 0 ? (
              <div className="text-center py-10 text-[#64748B] dark:text-[#94A3B8]">
                No accepted requests yet.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {acceptedRequests.map((request) => {
                  const otherId =
                    request.senderId === user?.uid
                      ? request.receiverId
                      : request.senderId;
                  const otherProfile = profilesMap.get(otherId);
                  const otherName =
                    request.senderId === user?.uid
                      ? request.receiverName
                      : request.senderName;

                  return (
                    <div
                      key={request.id}
                      className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/5 dark:border-white/5"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={otherProfile?.avatar || DEFAULT_AVATAR}
                          alt={otherName || "Accepted User"}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                            {otherName || "Unknown User"}
                          </h3>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Accepted
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("matching")}
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Find Suggested Members
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
