import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import {
  Search,
  Sparkles,
  Users,
  GraduationCap,
  MapPin,
  CircleDot,
  FilterX,
  Send,
  Check,
  X,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface ExploreProfile {
  id: string;
  username?: string;
  fullName?: string;
  email?: string;
  college?: string;
  collegeYear?: string;
  preferredRole?: string;
  availability?: string;
  interest?: string;
  technicalSkills?: string[];
  softSkills?: string[];
  projectTypes?: string[];
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
  senderName?: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName?: string;
  status: "pending" | "accepted" | "declined";
  teamName?: string;
  teamId?: string;
  createdAt?: Timestamp;
}

interface TeamRecord {
  members?: string[];
}

const DEFAULT_AVATAR =
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400";
const MAX_OUTGOING_PENDING_REQUESTS = 5;

const normalize = (value?: string) => (value || "").trim().toLowerCase();
const hasAvatar = (value?: string) => Boolean(value && value.trim());

const getDisplayName = (profile: ExploreProfile) =>
  profile.fullName || profile.username || profile.email || "Unknown User";

const getInitial = (profile: ExploreProfile) =>
  getDisplayName(profile).charAt(0).toUpperCase();

const toMillis = (value?: Timestamp) => value?.toMillis?.() || 0;

const getUsernameFromEmail = (email?: string) =>
  (email || "").split("@")[0] || "";

export function ExplorePage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ExploreProfile[]>([]);
  const [failedAvatarIds, setFailedAvatarIds] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");
  const [interestFilter, setInterestFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"explore" | "requests">("explore");
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [profilesMap, setProfilesMap] = useState<Map<string, ExploreProfile>>(
    new Map(),
  );
  const [sendingRequestId, setSendingRequestId] = useState<string | null>(null);
  const [actionRequestId, setActionRequestId] = useState<string | null>(null);
  const [myTeamMemberIds, setMyTeamMemberIds] = useState<Set<string>>(
    new Set(),
  );
  const [openVerificationProfileId, setOpenVerificationProfileId] = useState<
    string | null
  >(null);

  const ownEmail = normalize(user?.email);
  const ownUsername = normalize(getUsernameFromEmail(user?.email));

  const isCurrentUserProfile = (profile: ExploreProfile) => {
    if (user?.uid && profile.id === user.uid) return true;
    if (ownEmail && normalize(profile.email) === ownEmail) return true;
    if (ownUsername && normalize(profile.username) === ownUsername) return true;
    return false;
  };

  const getVerificationLinks = (profile: ExploreProfile) => {
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

  const isProfileVerified = (profile: ExploreProfile) =>
    getVerificationLinks(profile).length > 0;

  useEffect(() => {
    const loadProfiles = async () => {
      if (!db) {
        setError("Explore is unavailable because Firebase is not configured.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const snapshot = await getDocs(collection(db, "profiles"));
        const allProfiles = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ExploreProfile, "id">),
        }));

        const otherProfiles = allProfiles.filter(
          (profile) => !isCurrentUserProfile(profile),
        );
        setProfiles(otherProfiles);

        // Create map for quick lookup
        const map = new Map();
        allProfiles.forEach((profile) => map.set(profile.id, profile));
        setProfilesMap(map);
      } catch (err) {
        console.error("Failed to fetch explore profiles:", err);
        setError("Could not load users right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, [ownEmail, ownUsername, user?.uid]);

  useEffect(() => {
    if (!user?.uid || !db) return;

    const unsubscribe = onSnapshot(
      collection(db, "teamRequests"),
      (snapshot) => {
        const allRequests = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<TeamRequest, "id">),
        }));

        const relevantRequests = allRequests
          .filter(
            (req) => req.senderId === user.uid || req.receiverId === user.uid,
          )
          .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

        setTeamRequests(relevantRequests);
      },
      (snapshotError) => {
        console.error("Failed to subscribe team requests:", snapshotError);
      },
    );

    return unsubscribe;
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || !db) return;

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

  const excludedProfileIds = useMemo(() => {
    const excluded = new Set<string>();

    if (user?.uid) excluded.add(user.uid);

    myTeamMemberIds.forEach((memberId) => excluded.add(memberId));

    teamRequests.forEach((request) => {
      if (request.status === "pending") {
        if (request.senderId === user?.uid) excluded.add(request.receiverId);
        if (request.receiverId === user?.uid) excluded.add(request.senderId);
      }
    });

    return excluded;
  }, [myTeamMemberIds, teamRequests, user?.uid]);

  const discoverableProfiles = useMemo(
    () =>
      profiles.filter(
        (profile) =>
          !excludedProfileIds.has(profile.id) && !isCurrentUserProfile(profile),
      ),
    [profiles, excludedProfileIds, ownEmail, ownUsername, user?.uid],
  );

  const outgoingPendingRequestsCount = useMemo(
    () =>
      teamRequests.filter(
        (req) => req.senderId === user?.uid && req.status === "pending",
      ).length,
    [teamRequests, user?.uid],
  );

  const hasReachedOutgoingPendingLimit =
    outgoingPendingRequestsCount >= MAX_OUTGOING_PENDING_REQUESTS;

  const skillOptions = useMemo(() => {
    const allSkills = discoverableProfiles.flatMap(
      (profile) => profile.technicalSkills || [],
    );
    return ["All", ...Array.from(new Set(allSkills)).sort()];
  }, [discoverableProfiles]);

  const interestOptions = useMemo(() => {
    const allInterests = discoverableProfiles.flatMap(
      (profile) => profile.projectTypes || [],
    );
    return ["All", ...Array.from(new Set(allInterests)).sort()];
  }, [discoverableProfiles]);

  const filteredProfiles = useMemo(() => {
    const query = normalize(searchQuery);

    return discoverableProfiles.filter((profile) => {
      const skills = profile.technicalSkills || [];
      const interests = profile.projectTypes || [];

      const searchableText = [
        profile.fullName,
        profile.username,
        profile.email,
        profile.college,
        profile.preferredRole,
        profile.availability,
        profile.interest,
        skills.join(" "),
        interests.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesSkill =
        skillFilter === "All" ||
        skills.some((skill) => normalize(skill) === normalize(skillFilter));
      const matchesInterest =
        interestFilter === "All" ||
        interests.some(
          (interest) => normalize(interest) === normalize(interestFilter),
        );

      return matchesSearch && matchesSkill && matchesInterest;
    });
  }, [discoverableProfiles, searchQuery, skillFilter, interestFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setSkillFilter("All");
    setInterestFilter("All");
  };

  const sendTeamRequest = async (receiverId: string) => {
    if (!user?.uid || !db) return;

    try {
      if (hasReachedOutgoingPendingLimit) return;

      setSendingRequestId(receiverId);
      const receiverProfile = profilesMap.get(receiverId);
      const senderProfile = profilesMap.get(user.uid);

      const existingRequest = teamRequests.find(
        (req) =>
          ((req.senderId === user.uid && req.receiverId === receiverId) ||
            (req.senderId === receiverId && req.receiverId === user.uid)) &&
          req.status === "pending",
      );

      if (existingRequest) {
        return;
      }

      await addDoc(collection(db, "teamRequests"), {
        senderId: user.uid,
        senderName: senderProfile?.fullName || user.email,
        senderAvatar: senderProfile?.avatar,
        receiverId: receiverId,
        receiverName: receiverProfile?.fullName,
        status: "pending",
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error sending request:", err);
    } finally {
      setSendingRequestId(null);
    }
  };

  const acceptRequest = async (requestId: string) => {
    if (!db) return;

    try {
      setActionRequestId(requestId);

      // Get the request from state
      const request = teamRequests.find((req) => req.id === requestId);
      if (!request) return;

      // Create a new team
      const teamDocRef = await addDoc(collection(db, "teams"), {
        teamNumber: Math.floor(Math.random() * 1000000), // Generate a random team number
        members: [request.senderId, request.receiverId],
        memberDetails: [
          {
            uid: request.senderId,
            name: request.senderName,
            avatar: request.senderAvatar,
            joinedAt: Timestamp.now(),
          },
          {
            uid: request.receiverId,
            name: request.receiverName || user?.email,
            avatar: null,
            joinedAt: Timestamp.now(),
          },
        ],
        createdAt: Timestamp.now(),
        status: "active",
      });

      // Update the request status to accepted and link to team
      await updateDoc(doc(db, "teamRequests", requestId), {
        status: "accepted",
        teamId: teamDocRef.id,
      });

      console.log("Team created:", teamDocRef.id);
    } catch (err) {
      console.error("Error accepting request:", err);
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
      console.error("Error declining request:", err);
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
      console.error("Error cancelling request:", err);
    } finally {
      setActionRequestId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] pt-24 pb-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Explore Builders
          </h1>
          <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
            See other users, their skills, and interests to find the best
            teammate recommendations.
          </p>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setTab("explore")}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                tab === "explore"
                  ? "bg-[#5f73ff] text-white shadow-lg"
                  : "bg-white/70 dark:bg-[#121A2B] text-[#0F172A] dark:text-[#F8FAFC] border border-black/10 dark:border-white/10 hover:bg-white/85 dark:hover:bg-[#1a2a3a]"
              }`}
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Explore
              </span>
            </button>
            <button
              onClick={() => setTab("requests")}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                tab === "requests"
                  ? "bg-[#5f73ff] text-white shadow-lg"
                  : "bg-white/70 dark:bg-[#121A2B] text-[#0F172A] dark:text-[#F8FAFC] border border-black/10 dark:border-white/10 hover:bg-white/85 dark:hover:bg-[#1a2a3a]"
              }`}
            >
              <Clock className="w-4 h-4" />
              Requests
              {teamRequests.filter(
                (req) =>
                  (req.receiverId === user?.uid && req.status === "pending") ||
                  (req.senderId === user?.uid && req.status === "accepted"),
              ).length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
                  {
                    teamRequests.filter(
                      (req) =>
                        (req.receiverId === user?.uid &&
                          req.status === "pending") ||
                        (req.senderId === user?.uid &&
                          req.status === "accepted"),
                    ).length
                  }
                </span>
              )}
            </button>
          </div>
        </div>

        {/* EXPLORE TAB */}
        {tab === "explore" && (
          <>
            <div className="rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 p-4 sm:p-5 mb-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="lg:col-span-2 relative">
                  <Search className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, role, college, skill..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F8FAFC] dark:bg-[#0B1020] text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500"
                  />
                </div>

                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F8FAFC] dark:bg-[#0B1020] text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500"
                >
                  {skillOptions.map((skill) => (
                    <option key={skill} value={skill}>
                      Skill: {skill}
                    </option>
                  ))}
                </select>

                <select
                  value={interestFilter}
                  onChange={(e) => setInterestFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F8FAFC] dark:bg-[#0B1020] text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500"
                >
                  {interestOptions.map((interest) => (
                    <option key={interest} value={interest}>
                      Interest: {interest}
                    </option>
                  ))}
                </select>

                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-sm font-semibold text-[#475569] dark:text-[#AFC0E3] hover:bg-[#F1F5F9] dark:hover:bg-[#0B1020] transition-colors inline-flex items-center justify-center gap-2"
                >
                  <FilterX className="w-4 h-4" /> Clear Filters
                </button>
              </div>
            </div>

            {isLoading && (
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121A2B] p-8 text-center text-[#64748B] dark:text-[#94A3B8]">
                Loading users...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            )}

            {!isLoading && !error && filteredProfiles.length === 0 && (
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121A2B] p-8 text-center text-[#64748B] dark:text-[#94A3B8]">
                No users matched your current filters.
              </div>
            )}

            {!isLoading && !error && filteredProfiles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProfiles.map((profile) => {
                  const displayName = getDisplayName(profile);
                  const technicalSkills = profile.technicalSkills || [];
                  const softSkills = profile.softSkills || [];
                  const interests = profile.projectTypes || [];
                  const shouldUseImage =
                    hasAvatar(profile.avatar) &&
                    !failedAvatarIds.has(profile.id);
                  const verificationLinks = getVerificationLinks(profile);
                  const isVerified = isProfileVerified(profile);
                  const showVerificationLinks =
                    openVerificationProfileId === profile.id;

                  // Check if already sent request
                  const hasRequestPending = teamRequests.some(
                    (req) =>
                      req.senderId === user?.uid &&
                      req.receiverId === profile.id &&
                      req.status === "pending",
                  );
                  const pendingRequest = teamRequests.find(
                    (req) =>
                      req.senderId === user?.uid &&
                      req.receiverId === profile.id &&
                      req.status === "pending",
                  );

                  return (
                    <article
                      key={profile.id}
                      className="group relative h-full flex flex-col overflow-hidden rounded-2xl border border-white/60 dark:border-white/15 bg-white/45 dark:bg-[#0f1730]/45 backdrop-blur-xl p-4 shadow-[0_16px_46px_-34px_rgba(43,76,132,0.75)] hover:shadow-[0_22px_56px_-32px_rgba(35,87,171,0.7)] transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="pointer-events-none absolute -right-16 -top-20 h-36 w-36 rounded-full bg-gradient-to-br from-[#68d6ff]/35 via-[#8ba3ff]/30 to-transparent blur-2xl" />
                      <div className="pointer-events-none absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-gradient-to-tr from-[#ffb176]/30 via-[#ffe6d4]/25 to-transparent blur-2xl" />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/35 dark:ring-white/10" />

                      <div className="relative flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 min-w-0">
                          {shouldUseImage ? (
                            <img
                              src={profile.avatar || DEFAULT_AVATAR}
                              alt={displayName}
                              onError={() => {
                                setFailedAvatarIds((prev) => {
                                  if (prev.has(profile.id)) return prev;
                                  const next = new Set(prev);
                                  next.add(profile.id);
                                  return next;
                                });
                              }}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-white/80 dark:border-[#273455] shadow-md"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#ff7e4c] via-[#ffb26f] to-[#5f73ff] text-white font-bold text-lg border-2 border-white/80 dark:border-[#273455] shadow-md">
                              {getInitial(profile)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h2 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                                {displayName}
                              </h2>
                              <span
                                className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${
                                  isVerified
                                    ? "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/25"
                                    : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/25"
                                }`}
                              >
                                {isVerified ? (
                                  <ShieldCheck className="w-3 h-3" />
                                ) : (
                                  <ShieldAlert className="w-3 h-3" />
                                )}
                                {isVerified ? "Verified" : "Unverified"}
                              </span>
                            </div>
                            <p className="text-xs text-[#4b5f87] dark:text-[#9eb2da] truncate">
                              {profile.preferredRole || "Role not added"}
                            </p>
                            {profile.username && (
                              <p className="mt-0.5 text-[11px] text-[#6b7fa5] dark:text-[#88a0cd] truncate">
                                @{profile.username}
                              </p>
                            )}

                            {isVerified && (
                              <div className="mt-2">
                                <button
                                  onClick={() =>
                                    setOpenVerificationProfileId((prev) =>
                                      prev === profile.id ? null : profile.id,
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm shadow-green-600/25"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  {showVerificationLinks
                                    ? "Hide Verification Links"
                                    : "View Verification Links"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-white/65 dark:bg-[#16233d]/70 text-[#1e6e62] border border-white/70 dark:border-white/15 backdrop-blur-md">
                          <CircleDot className="w-2.5 h-2.5" />
                          {profile.availability || "Open"}
                        </span>
                      </div>

                      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
                        <div className="flex items-center gap-2 rounded-lg bg-white/55 dark:bg-[#132342]/55 border border-white/70 dark:border-white/10 px-2.5 py-1.5 backdrop-blur-md">
                          <GraduationCap className="w-3.5 h-3.5 text-[#5678c6] dark:text-[#9cb7ed]" />
                          <span className="text-xs text-[#3f4f72] dark:text-[#bfd1f5] truncate">
                            {profile.college || "College not added"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-white/55 dark:bg-[#2a1c14]/55 border border-white/70 dark:border-white/10 px-2.5 py-1.5 backdrop-blur-md">
                          <Sparkles className="w-3.5 h-3.5 text-[#d17a2d] dark:text-[#f5b06f]" />
                          <span className="text-xs text-[#704a29] dark:text-[#ffd3a2] truncate">
                            {profile.collegeYear || "Year not added"}
                          </span>
                        </div>
                        <div className="sm:col-span-2 flex items-center gap-2 rounded-lg bg-white/55 dark:bg-[#102b24]/55 border border-white/70 dark:border-white/10 px-2.5 py-1.5 backdrop-blur-md">
                          <MapPin className="w-3.5 h-3.5 text-[#2a8f66] dark:text-[#89e3be]" />
                          <span className="text-xs text-[#29503f] dark:text-[#b7ead5] truncate">
                            {profile.preferredRole || "Role not added"}
                          </span>
                        </div>
                      </div>

                      {profile.interest && (
                        <p className="relative text-xs text-[#334155] dark:text-[#CBD5E1] bg-white/55 dark:bg-[#152441]/55 border border-white/70 dark:border-white/10 rounded-xl p-2.5 mb-3 leading-relaxed backdrop-blur-md line-clamp-3">
                          {profile.interest}
                        </p>
                      )}

                      <div className="mb-3">
                        <h3 className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#5f739d] dark:text-[#9ab1db] mb-2.5">
                          Technical Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {technicalSkills.length ? (
                            technicalSkills.slice(0, 5).map((skill) => (
                              <span
                                key={`${profile.id}-skill-${skill}`}
                                className="text-[11px] px-2 py-1 rounded-full bg-white/65 text-[#355da8] border border-white/70 dark:bg-[#162847]/65 dark:text-[#a8c7ff] dark:border-white/10 backdrop-blur-md"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[#94A3B8]">
                              No technical skills added
                            </span>
                          )}
                          {technicalSkills.length > 5 && (
                            <span className="text-[11px] px-2 py-1 rounded-full bg-[#eef2f8] text-[#586887] border border-[#d8dfec] dark:bg-[#172137] dark:text-[#a7b8da] dark:border-[#2d426e]">
                              +{technicalSkills.length - 5}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h3 className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#5f739d] dark:text-[#9ab1db] mb-2.5">
                          Interests
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {interests.length ? (
                            interests.slice(0, 4).map((interest) => (
                              <span
                                key={`${profile.id}-interest-${interest}`}
                                className="text-[11px] px-2 py-1 rounded-full bg-white/65 text-[#1f7a60] border border-white/70 dark:bg-[#113227]/65 dark:text-[#98e8cb] dark:border-white/10 backdrop-blur-md"
                              >
                                {interest}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[#94A3B8]">
                              No interests added
                            </span>
                          )}
                          {interests.length > 4 && (
                            <span className="text-[11px] px-2 py-1 rounded-full bg-[#eef2f8] text-[#586887] border border-[#d8dfec] dark:bg-[#172137] dark:text-[#a7b8da] dark:border-[#2d426e]">
                              +{interests.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#5f739d] dark:text-[#9ab1db] mb-2.5">
                          Soft Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {softSkills.length ? (
                            softSkills.slice(0, 4).map((skill) => (
                              <span
                                key={`${profile.id}-soft-${skill}`}
                                className="text-[11px] px-2 py-1 rounded-full bg-white/65 text-[#9d4e5d] border border-white/70 dark:bg-[#2b1620]/65 dark:text-[#f3b2c1] dark:border-white/10 backdrop-blur-md"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[#94A3B8]">
                              No soft skills added
                            </span>
                          )}
                          {softSkills.length > 4 && (
                            <span className="text-[11px] px-2 py-1 rounded-full bg-[#eef2f8] text-[#586887] border border-[#d8dfec] dark:bg-[#172137] dark:text-[#a7b8da] dark:border-[#2d426e]">
                              +{softSkills.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="relative mb-3">
                        {showVerificationLinks && (
                          <div className="mt-2 p-3 rounded-xl bg-green-50/90 dark:bg-green-900/20 border border-green-300/70 dark:border-green-500/35 ring-1 ring-green-400/30 dark:ring-green-500/30 shadow-[0_8px_24px_-18px_rgba(22,163,74,0.9)]">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-700 dark:text-green-300 mb-2">
                              Uploaded Links
                            </div>
                            <div className="space-y-1.5">
                              {verificationLinks.map((item) => (
                                <a
                                  key={`${profile.id}-${item.label}-${item.url}`}
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

                      <button
                        onClick={() => {
                          if (hasRequestPending) {
                            const request = teamRequests.find(
                              (req) =>
                                req.senderId === user?.uid &&
                                req.receiverId === profile.id &&
                                req.status === "pending",
                            );
                            if (request?.id) cancelRequest(request.id);
                          } else {
                            sendTeamRequest(profile.id);
                          }
                        }}
                        disabled={
                          sendingRequestId === profile.id ||
                          actionRequestId === pendingRequest?.id ||
                          (!hasRequestPending && hasReachedOutgoingPendingLimit)
                        }
                        className={`relative mt-auto w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                          sendingRequestId === profile.id
                            ? "bg-[#cbd5e1]/50 dark:bg-[#475569]/50 text-[#94a3b8] cursor-not-allowed"
                            : hasRequestPending
                              ? "bg-red-500/20 dark:bg-red-500/20 hover:bg-red-500/40 dark:hover:bg-red-500/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/40"
                              : "bg-[#5f73ff] text-white hover:bg-[#4d5edb] shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {sendingRequestId === profile.id ? (
                          <>
                            <Clock className="w-4 h-4" />
                            Sending...
                          </>
                        ) : !hasRequestPending &&
                          hasReachedOutgoingPendingLimit ? (
                          <>
                            <Clock className="w-4 h-4" />
                            Limit Reached (5/5)
                          </>
                        ) : hasRequestPending ? (
                          <>
                            <X className="w-4 h-4" />
                            Withdraw
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Request
                          </>
                        )}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}

            {!isLoading && !error && (
              <div className="mt-8 text-sm text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2">
                <Users className="w-4 h-4" />
                Showing {filteredProfiles.length}{" "}
                {filteredProfiles.length === 1 ? "user" : "users"}
                <span className="ml-2 text-xs text-[#7b8ca8] dark:text-[#9db2d8]">
                  Pending sent: {outgoingPendingRequestsCount}/
                  {MAX_OUTGOING_PENDING_REQUESTS}
                </span>
              </div>
            )}
          </>
        )}

        {/* REQUESTS TAB */}
        {tab === "requests" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
                Incoming Requests
              </h2>
              {teamRequests.filter(
                (req) =>
                  req.receiverId === user?.uid && req.status === "pending",
              ).length === 0 ? (
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121A2B] p-8 text-center text-[#64748B] dark:text-[#94A3B8]">
                  No incoming requests
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamRequests
                    .filter(
                      (req) =>
                        req.receiverId === user?.uid &&
                        req.status === "pending",
                    )
                    .map((request) => {
                      const senderProfile = profilesMap.get(request.senderId);
                      const senderVerificationLinks = senderProfile
                        ? getVerificationLinks(senderProfile)
                        : [];
                      const senderVerified = senderVerificationLinks.length > 0;
                      const isSenderLinksOpen =
                        openVerificationProfileId === request.senderId;
                      const shouldUseImage =
                        hasAvatar(request.senderAvatar) &&
                        request.senderAvatar !== undefined;

                      return (
                        <div
                          key={request.id}
                          className="rounded-2xl border border-white/60 dark:border-white/15 bg-white/45 dark:bg-[#0f1730]/45 backdrop-blur-xl p-4 shadow-lg h-full flex flex-col"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            {shouldUseImage ? (
                              <img
                                src={request.senderAvatar}
                                alt={request.senderName}
                                className="w-12 h-12 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#ff7e4c] via-[#ffb26f] to-[#5f73ff] text-white font-bold">
                                {(request.senderName || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                  {request.senderName || "Unknown User"}
                                </h3>
                                <span
                                  className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${
                                    senderVerified
                                      ? "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/25"
                                      : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/25"
                                  }`}
                                >
                                  {senderVerified ? (
                                    <ShieldCheck className="w-3 h-3" />
                                  ) : (
                                    <ShieldAlert className="w-3 h-3" />
                                  )}
                                  {senderVerified ? "Verified" : "Unverified"}
                                </span>
                              </div>
                              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                                Wants to team up
                              </p>
                            </div>
                          </div>

                          {senderVerified && (
                            <div className="mb-3">
                              <button
                                onClick={() =>
                                  setOpenVerificationProfileId((prev) =>
                                    prev === request.senderId
                                      ? null
                                      : request.senderId,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm shadow-green-600/25"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                {isSenderLinksOpen
                                  ? "Hide Verification Links"
                                  : "View Verification Links"}
                              </button>

                              {isSenderLinksOpen && (
                                <div className="mt-2 p-3 rounded-xl bg-green-50/90 dark:bg-green-900/20 border border-green-300/70 dark:border-green-500/35 ring-1 ring-green-400/30 dark:ring-green-500/30 shadow-[0_8px_24px_-18px_rgba(22,163,74,0.9)]">
                                  <div className="space-y-1.5">
                                    {senderVerificationLinks.map((item) => (
                                      <a
                                        key={`${request.id}-${item.label}-${item.url}`}
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
                          )}

                          <div className="mt-auto flex gap-3">
                            <button
                              onClick={() => acceptRequest(request.id)}
                              disabled={actionRequestId === request.id}
                              className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center justify-center gap-2 transition-all"
                            >
                              <Check className="w-4 h-4" />
                              {actionRequestId === request.id
                                ? "Working..."
                                : "Accept"}
                            </button>
                            <button
                              onClick={() => declineRequest(request.id)}
                              disabled={actionRequestId === request.id}
                              className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center justify-center gap-2 transition-all"
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
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
                Outgoing Requests
              </h2>
              {teamRequests.filter(
                (req) => req.senderId === user?.uid && req.status === "pending",
              ).length === 0 ? (
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121A2B] p-8 text-center text-[#64748B] dark:text-[#94A3B8]">
                  No outgoing requests
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamRequests
                    .filter(
                      (req) =>
                        req.senderId === user?.uid && req.status === "pending",
                    )
                    .map((request) => {
                      const receiverProfile = profilesMap.get(
                        request.receiverId,
                      );
                      const receiverVerificationLinks = receiverProfile
                        ? getVerificationLinks(receiverProfile)
                        : [];
                      const receiverVerified =
                        receiverVerificationLinks.length > 0;
                      const isReceiverLinksOpen =
                        openVerificationProfileId === request.receiverId;
                      const shouldUseImage =
                        hasAvatar(receiverProfile?.avatar) &&
                        receiverProfile?.avatar !== undefined;

                      return (
                        <div
                          key={request.id}
                          className="rounded-2xl border border-white/60 dark:border-white/15 bg-white/45 dark:bg-[#0f1730]/45 backdrop-blur-xl p-4 shadow-lg h-full flex flex-col"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            {shouldUseImage ? (
                              <img
                                src={receiverProfile?.avatar}
                                alt={request.receiverName}
                                className="w-12 h-12 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-400 via-yellow-400 to-yellow-600 text-white font-bold">
                                {(request.receiverName || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                  {request.receiverName || "Unknown User"}
                                </h3>
                                <span
                                  className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${
                                    receiverVerified
                                      ? "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/25"
                                      : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/25"
                                  }`}
                                >
                                  {receiverVerified ? (
                                    <ShieldCheck className="w-3 h-3" />
                                  ) : (
                                    <ShieldAlert className="w-3 h-3" />
                                  )}
                                  {receiverVerified ? "Verified" : "Unverified"}
                                </span>
                              </div>
                              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Pending
                              </p>
                            </div>
                          </div>

                          {receiverVerified && (
                            <div className="mb-3">
                              <button
                                onClick={() =>
                                  setOpenVerificationProfileId((prev) =>
                                    prev === request.receiverId
                                      ? null
                                      : request.receiverId,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm shadow-green-600/25"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                {isReceiverLinksOpen
                                  ? "Hide Verification Links"
                                  : "View Verification Links"}
                              </button>

                              {isReceiverLinksOpen && (
                                <div className="mt-2 p-3 rounded-xl bg-green-50/90 dark:bg-green-900/20 border border-green-300/70 dark:border-green-500/35 ring-1 ring-green-400/30 dark:ring-green-500/30 shadow-[0_8px_24px_-18px_rgba(22,163,74,0.9)]">
                                  <div className="space-y-1.5">
                                    {receiverVerificationLinks.map((item) => (
                                      <a
                                        key={`${request.id}-${item.label}-${item.url}`}
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
                          )}

                          <button
                            onClick={() => cancelRequest(request.id)}
                            disabled={actionRequestId === request.id}
                            className="mt-auto w-full py-2.5 rounded-lg bg-red-500/20 dark:bg-red-500/20 hover:bg-red-500/40 dark:hover:bg-red-500/40 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2 transition-all border border-red-300 dark:border-red-500/40"
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
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
                Accepted Requests
              </h2>
              {teamRequests.filter(
                (req) =>
                  (req.senderId === user?.uid ||
                    req.receiverId === user?.uid) &&
                  req.status === "accepted",
              ).length === 0 ? (
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121A2B] p-8 text-center text-[#64748B] dark:text-[#94A3B8]">
                  No accepted requests yet
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamRequests
                    .filter(
                      (req) =>
                        (req.senderId === user?.uid ||
                          req.receiverId === user?.uid) &&
                        req.status === "accepted",
                    )
                    .map((request) => {
                      const otherUserId =
                        request.senderId === user?.uid
                          ? request.receiverId
                          : request.senderId;
                      const otherUser = profilesMap.get(otherUserId);
                      const otherVerificationLinks = otherUser
                        ? getVerificationLinks(otherUser)
                        : [];
                      const otherVerified = otherVerificationLinks.length > 0;
                      const isOtherLinksOpen =
                        openVerificationProfileId === otherUserId;
                      const otherName =
                        request.senderId === user?.uid
                          ? request.receiverName
                          : request.senderName;

                      return (
                        <div
                          key={request.id}
                          className="rounded-2xl border border-white/60 dark:border-white/15 bg-white/45 dark:bg-[#0f1730]/45 backdrop-blur-xl p-4 shadow-lg h-full flex flex-col"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600 text-white font-bold">
                              {(otherName || "U").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                  {otherName || "Unknown User"}
                                </h3>
                                <span
                                  className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${
                                    otherVerified
                                      ? "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/25"
                                      : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/25"
                                  }`}
                                >
                                  {otherVerified ? (
                                    <ShieldCheck className="w-3 h-3" />
                                  ) : (
                                    <ShieldAlert className="w-3 h-3" />
                                  )}
                                  {otherVerified ? "Verified" : "Unverified"}
                                </span>
                              </div>
                              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Accepted
                              </p>
                            </div>
                          </div>

                          {otherVerified && (
                            <div className="mt-3">
                              <button
                                onClick={() =>
                                  setOpenVerificationProfileId((prev) =>
                                    prev === otherUserId ? null : otherUserId,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm shadow-green-600/25"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                {isOtherLinksOpen
                                  ? "Hide Verification Links"
                                  : "View Verification Links"}
                              </button>

                              {isOtherLinksOpen && (
                                <div className="mt-2 p-3 rounded-xl bg-green-50/90 dark:bg-green-900/20 border border-green-300/70 dark:border-green-500/35 ring-1 ring-green-400/30 dark:ring-green-500/30 shadow-[0_8px_24px_-18px_rgba(22,163,74,0.9)]">
                                  <div className="space-y-1.5">
                                    {otherVerificationLinks.map((item) => (
                                      <a
                                        key={`${request.id}-${item.label}-${item.url}`}
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
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
