import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Brain,
  Mail,
  Camera,
  Save,
  X,
  GraduationCap,
  Briefcase,
  Rocket,
  Trophy,
  ExternalLink,
  Github,
  Youtube,
  Star,
  ShieldCheck,
  Users,
  Calendar
} from "lucide-react";

import { useProfile } from "../contexts/ProfileContext";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { profile: profileData, updateProfile: setProfileData } = useProfile();
  const { user } = useAuth();
  const profileInitial = (
    profileData.fullName?.trim().charAt(0) || "U"
  ).toUpperCase();

  const [editForm, setEditForm] = useState({
    fullName: profileData.fullName,
    email: profileData.email,
    college: profileData.college,
    collegeYear: profileData.collegeYear,
    preferredRole: profileData.preferredRole,
    availability: profileData.availability,
    interest: profileData.interest,
    technicalSkills: profileData.technicalSkills.join(", "),
    softSkills: profileData.softSkills.join(", "),
    projectTypes: profileData.projectTypes.join(", "),
  });

  useEffect(() => {
    if (isEditing) return;
    setEditForm({
      fullName: profileData.fullName,
      email: profileData.email,
      college: profileData.college,
      collegeYear: profileData.collegeYear,
      preferredRole: profileData.preferredRole,
      availability: profileData.availability,
      interest: profileData.interest,
      technicalSkills: profileData.technicalSkills.join(", "),
      softSkills: profileData.softSkills.join(", "),
      projectTypes: profileData.projectTypes.join(", "),
    });
  }, [isEditing, profileData]);

  const handleSave = async () => {
    const nextProfile = {
      ...profileData,
      fullName: editForm.fullName,
      email: editForm.email,
      college: editForm.college,
      collegeYear: editForm.collegeYear,
      preferredRole: editForm.preferredRole,
      availability: editForm.availability,
      interest: editForm.interest,
      technicalSkills: editForm.technicalSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      softSkills: editForm.softSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      projectTypes: editForm.projectTypes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    setIsSaving(true);
    setProfileData(nextProfile);

    try {
      if (user) {
        await setDoc(
          doc(db, "profiles", user.uid),
          {
            ...nextProfile,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      }
    } finally {
      setIsSaving(false);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      fullName: profileData.fullName,
      email: profileData.email,
      college: profileData.college,
      collegeYear: profileData.collegeYear,
      preferredRole: profileData.preferredRole,
      availability: profileData.availability,
      interest: profileData.interest,
      technicalSkills: profileData.technicalSkills.join(", "),
      softSkills: profileData.softSkills.join(", "),
      projectTypes: profileData.projectTypes.join(", "),
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
            User Profile
          </h1>
          <p className="text-lg text-[#64748B] dark:text-[#94A3B8]">
            Manage your personal information and skills
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 overflow-hidden shadow-xl"
        >
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-violet-500 to-blue-500 relative">
            <div className="absolute -bottom-16 left-8 flex items-end">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#121A2B] bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-5xl font-extrabold">
                  {profileInitial}
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-violet-500 text-white hover:bg-violet-600 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                {isEditing ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, fullName: e.target.value })
                      }
                      className="w-full max-w-md px-4 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {profileData.fullName}
                  </h2>
                )}
                <p className="text-violet-500 font-medium">
                  @{profileData.username}
                </p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#64748B] dark:text-[#94A3B8] font-medium hover:border-red-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors shadow-lg shadow-violet-500/25"
                    >
                      <Save className="w-4 h-4" />{" "}
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] font-medium hover:border-violet-500 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* College & Year */}
              <div>
                {isEditing ? (
                  <div className="flex gap-3">
                    <div className="flex-[2]">
                      <label className="block text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-1 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> College
                      </label>
                      <input
                        type="text"
                        value={editForm.college}
                        onChange={(e) =>
                          setEditForm({ ...editForm, college: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={editForm.collegeYear}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            collegeYear: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-[#64748B] dark:text-[#94A3B8]">
                    <GraduationCap className="w-5 h-5 text-violet-500" />
                    <span>
                      {profileData.college} • {profileData.collegeYear}
                    </span>
                  </div>
                )}
              </div>

              {/* Role & Availability */}
              <div>
                {isEditing ? (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-1 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Role
                      </label>
                      <input
                        type="text"
                        value={editForm.preferredRole}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            preferredRole: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                        Availability
                      </label>
                      <select
                        value={editForm.availability}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            availability: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors"
                      >
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-[#64748B] dark:text-[#94A3B8]">
                    <Briefcase className="w-5 h-5 text-violet-500" />
                    <span>
                      {profileData.preferredRole} • {profileData.availability}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="md:col-span-2">
                {isEditing ? (
                  <div className="w-full md:w-[calc(50%-0.75rem)]">
                    <label className="block text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-[#64748B] dark:text-[#94A3B8]">
                    <Mail className="w-5 h-5 text-violet-500" />
                    <span>{profileData.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                About & Interest
              </h3>
              {isEditing ? (
                <textarea
                  value={editForm.interest}
                  onChange={(e) =>
                    setEditForm({ ...editForm, interest: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              ) : (
                <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  {profileData.interest}
                </p>
              )}
            </div>

            {/* Project Types */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  Project Types Interested In
                </h3>
              </div>
              {isEditing ? (
                <div>
                  <textarea
                    value={editForm.projectTypes}
                    onChange={(e) =>
                      setEditForm({ ...editForm, projectTypes: e.target.value })
                    }
                    placeholder="Separate project types with commas (e.g. AI/ML, Software Development, Open Source)"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors resize-none mb-2"
                  />
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Separate project types with commas
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData.projectTypes.map((type, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-xl bg-orange-500/10 text-sm font-medium text-orange-600 dark:text-orange-400 border border-orange-500/20"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Skills */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  Technical Skills
                </h3>
              </div>
              {isEditing ? (
                <div>
                  <textarea
                    value={editForm.technicalSkills}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        technicalSkills: e.target.value,
                      })
                    }
                    placeholder="Separate skills with commas (e.g. React, Node.js, Python)"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors resize-none mb-2"
                  />
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Separate skills with commas
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData.technicalSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-xl bg-blue-500/10 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Soft Skills */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-violet-500" />
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  Soft Skills
                </h3>
              </div>
              {isEditing ? (
                <div>
                  <textarea
                    value={editForm.softSkills}
                    onChange={(e) =>
                      setEditForm({ ...editForm, softSkills: e.target.value })
                    }
                    placeholder="Separate skills with commas (e.g. Leadership, Teamwork)"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors resize-none mb-2"
                  />
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Separate skills with commas
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData.softSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-xl bg-violet-500/10 text-sm font-medium text-violet-600 dark:text-violet-400 border border-violet-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ===== Past Hackathons Section ===== */}
        <PastHackathonsSection />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Past Hackathons Sub-Component                                               */
/* ─────────────────────────────────────────────────────────────────────────── */

const RESULT_COLORS: Record<string, string> = {
  Winner: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30",
  Finalist: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30",
  Participant: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30",
};

const REVIEW_CATS = [
  { key: "technical" as const, label: "Technical Contribution" },
  { key: "teamwork" as const, label: "Teamwork" },
  { key: "communication" as const, label: "Communication" },
  { key: "reliability" as const, label: "Reliability" },
  { key: "problemSolving" as const, label: "Problem Solving" },
  { key: "delivery" as const, label: "Delivery / Execution" },
];

type ReviewKeys = "technical" | "teamwork" | "communication" | "reliability" | "problemSolving" | "delivery";

const emptyForm = {
  name: "",
  date: "",
  rolePlayed: "",
  teamSize: "2",
  skillsUsed: "",
  projectTitle: "",
  contributionSummary: "",
  projectLink: "",
  githubLink: "",
  demoLink: "",
  certificateUrl: "",
  result: "Participant" as "Winner" | "Finalist" | "Participant",
};

const emptyRating: Record<ReviewKeys, number> = {
  technical: 0, teamwork: 0, communication: 0,
  reliability: 0, problemSolving: 0, delivery: 0,
};

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          className={`transition-transform ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          <Star
            className={`w-5 h-5 ${s <= (hover || value) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
          />
        </button>
      ))}
    </div>
  );
}

function PastHackathonsSection() {
  const { profile, updateProfile } = useProfile();
  const hackathons = profile.pastHackathons ?? [];

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [ratings, setRatings] = useState<Record<ReviewKeys, number>>(emptyRating);
  const [ratingSummary, setRatingSummary] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rateModal, setRateModal] = useState<string | null>(null);
  const [modalRatings, setModalRatings] = useState<Record<ReviewKeys, number>>(emptyRating);
  const [modalSummary, setModalSummary] = useState("");

  const calcAvg = (r: Record<ReviewKeys, number>) => {
    const vals = Object.values(r);
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
  };

  const handleAddHackathon = () => {
    if (!form.name.trim() || !form.projectTitle.trim()) return;
    const hasRatings = Object.values(ratings).some((v) => v > 0);
    const newHackathon = {
      id: `h${Date.now()}`,
      name: form.name,
      date: form.date,
      rolePlayed: form.rolePlayed,
      teamSize: parseInt(form.teamSize) || 2,
      skillsUsed: form.skillsUsed.split(",").map((s) => s.trim()).filter(Boolean),
      projectTitle: form.projectTitle,
      contributionSummary: form.contributionSummary,
      projectLink: form.projectLink,
      githubLink: form.githubLink,
      demoLink: form.demoLink,
      certificateUrl: form.certificateUrl,
      certificateVerified: !!form.certificateUrl,
      result: form.result,
      ...(hasRatings && {
        review: { ...ratings, averageRating: calcAvg(ratings), summary: ratingSummary },
      }),
    };
    updateProfile({ pastHackathons: [...hackathons, newHackathon] });
    setForm(emptyForm);
    setRatings(emptyRating);
    setRatingSummary("");
    setShowForm(false);
    setExpanded(newHackathon.id);
  };

  const handleSaveReview = (id: string) => {
    const updated = hackathons.map((h) =>
      h.id === id
        ? { ...h, review: { ...modalRatings, averageRating: calcAvg(modalRatings), summary: modalSummary } }
        : h
    );
    updateProfile({ pastHackathons: updated });
    setRateModal(null);
  };

  const handleDelete = (id: string) => {
    updateProfile({ pastHackathons: hackathons.filter((h) => h.id !== id) });
  };

  const inputCls = "w-full px-4 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors text-sm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-8 rounded-3xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 shadow-xl p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">Past Hackathons</h2>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{hackathons.length} hackathon{hackathons.length !== 1 ? "s" : ""} recorded</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600 transition-colors shadow-lg shadow-violet-500/25"
        >
          {showForm ? <X className="w-4 h-4" /> : <span className="text-lg leading-none">+</span>}
          {showForm ? "Cancel" : "Add Hackathon"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 p-6 rounded-2xl border-2 border-dashed border-violet-400/40 bg-violet-500/5"
        >
          <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">Add New Hackathon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1 block">Hackathon Name *</label>
              <input className={inputCls} placeholder="e.g. HackMIT 2024" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1 block">Year / Date</label>
              <input className={inputCls} placeholder="e.g. Oct 2024" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1 block">Role Played</label>
              <input className={inputCls} placeholder="e.g. Frontend Developer" value={form.rolePlayed} onChange={e => setForm(f => ({...f, rolePlayed: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1 block">Team Size</label>
              <input type="number" min="1" max="20" className={inputCls} value={form.teamSize} onChange={e => setForm(f => ({...f, teamSize: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1 block">Project Title *</label>
              <input className={inputCls} placeholder="e.g. AI Health Assistant" value={form.projectTitle} onChange={e => setForm(f => ({...f, projectTitle: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1 block">Result</label>
              <select className={inputCls} value={form.result} onChange={e => setForm(f => ({...f, result: e.target.value as "Winner"|"Finalist"|"Participant"}))}>
                <option value="Winner">🏆 Winner</option>
                <option value="Finalist">🥈 Finalist</option>
                <option value="Participant">🎫 Participant</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1 block">Skills Used (comma separated)</label>
              <input className={inputCls} placeholder="e.g. React, Python, Firebase" value={form.skillsUsed} onChange={e => setForm(f => ({...f, skillsUsed: e.target.value}))} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1 block">Contribution Summary</label>
              <textarea rows={2} className={inputCls + " resize-none"} placeholder="Describe what you built and your key contributions..." value={form.contributionSummary} onChange={e => setForm(f => ({...f, contributionSummary: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1 block flex items-center gap-1"><Github className="w-3 h-3"/>GitHub Link</label>
              <input className={inputCls} placeholder="https://github.com/..." value={form.githubLink} onChange={e => setForm(f => ({...f, githubLink: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1 block flex items-center gap-1"><Youtube className="w-3 h-3"/>Demo / PPT Link</label>
              <input className={inputCls} placeholder="https://youtube.com/..." value={form.demoLink} onChange={e => setForm(f => ({...f, demoLink: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1 block flex items-center gap-1"><ExternalLink className="w-3 h-3"/>Project Link</label>
              <input className={inputCls} placeholder="https://devpost.com/..." value={form.projectLink} onChange={e => setForm(f => ({...f, projectLink: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1 block flex items-center gap-1"><ShieldCheck className="w-3 h-3"/>Certificate / Proof URL</label>
              <input className={inputCls} placeholder="https://certificate-link..." value={form.certificateUrl} onChange={e => setForm(f => ({...f, certificateUrl: e.target.value}))} />
            </div>
          </div>

          {/* Teammate Rating in form */}
          <div className="border-t border-black/5 dark:border-white/5 pt-4 mt-2">
            <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>Teammate Review (optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {REVIEW_CATS.map(cat => (
                <div key={cat.key} className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-[#0B1020]/60 border border-black/5 dark:border-white/5">
                  <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">{cat.label}</span>
                  <StarRating value={ratings[cat.key]} onChange={v => setRatings(r => ({...r, [cat.key]: v}))}/>
                </div>
              ))}
            </div>
            <input className={inputCls} placeholder="Reviewer summary / quote..." value={ratingSummary} onChange={e => setRatingSummary(e.target.value)} />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-red-500 transition-colors">Cancel</button>
            <button
              onClick={handleAddHackathon}
              disabled={!form.name.trim() || !form.projectTitle.trim()}
              className="px-6 py-2 rounded-xl bg-violet-500 text-white font-semibold text-sm hover:bg-violet-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save Hackathon
            </button>
          </div>
        </motion.div>
      )}

      {/* Hackathon Cards */}
      {hackathons.length === 0 && !showForm && (
        <div className="text-center py-16 text-[#94A3B8]">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No hackathons recorded yet</p>
          <p className="text-sm mt-1">Click "Add Hackathon" to get started</p>
        </div>
      )}

      <div className="space-y-4">
        {hackathons.map((h) => {
          const isOpen = expanded === h.id;
          return (
            <div key={h.id} className="rounded-2xl border border-black/5 dark:border-white/5 bg-[#F8FAFC] dark:bg-[#0B1020] overflow-hidden">
              {/* Card Header — always visible */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 cursor-pointer hover:bg-black/2 dark:hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(isOpen ? null : h.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Trophy className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{h.name}</h3>
                      {h.certificateVerified && <ShieldCheck className="w-4 h-4 text-green-500" title="Verified" />}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${RESULT_COLORS[h.result]}`}>{h.result}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8] mt-1">
                      {h.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{h.date}</span>}
                      {h.rolePlayed && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3"/>{h.rolePlayed}</span>}
                      {h.teamSize && <span className="flex items-center gap-1"><Users className="w-3 h-3"/>Team of {h.teamSize}</span>}
                      {h.review && <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-yellow-500"/>{h.review.averageRating}/5</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); setModalRatings(h.review ? {technical: h.review.technical, teamwork: h.review.teamwork, communication: h.review.communication, reliability: h.review.reliability, problemSolving: h.review.problemSolving, delivery: h.review.delivery} : emptyRating); setModalSummary(h.review?.summary || ""); setRateModal(h.id); }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 transition-colors font-medium"
                  >Rate</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(h.id); }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors font-medium"
                  >Delete</button>
                  <span className={`text-[#94A3B8] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </div>
              </div>

              {/* Expanded Detail */}
              {isOpen && (
                <div className="px-5 pb-6 pt-1 border-t border-black/5 dark:border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Left column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">Project</p>
                        <p className="text-[#0F172A] dark:text-[#F8FAFC] font-medium">{h.projectTitle}</p>
                      </div>
                      {h.contributionSummary && (
                        <div>
                          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">Contribution Summary</p>
                          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{h.contributionSummary}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-2">Skills Used</p>
                        <div className="flex flex-wrap gap-2">
                          {h.skillsUsed.map(s => (
                            <span key={s} className="px-2 py-1 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-medium">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {h.githubLink && <a href={h.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-[#0F172A] dark:text-[#F8FAFC]"><Github className="w-3.5 h-3.5"/>GitHub</a>}
                        {h.demoLink && <a href={h.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-500"><Youtube className="w-3.5 h-3.5"/>Demo</a>}
                        {h.projectLink && <a href={h.projectLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors text-blue-500"><ExternalLink className="w-3.5 h-3.5"/>Project</a>}
                        {h.certificateUrl && <a href={h.certificateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors text-green-600 dark:text-green-400"><ShieldCheck className="w-3.5 h-3.5"/>Certificate</a>}
                      </div>
                    </div>

                    {/* Right column — Reviews */}
                    <div>
                      {h.review ? (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
                            <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-sm">Teammate Review</span>
                            <span className="text-xs text-[#94A3B8]">avg {h.review.averageRating}/5</span>
                          </div>
                          {h.review.summary && <p className="text-sm text-[#64748B] dark:text-[#94A3B8] italic mb-3">"{h.review.summary}"</p>}
                          <div className="space-y-2">
                            {REVIEW_CATS.map(cat => (
                              <div key={cat.key}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-[#94A3B8]">{cat.label}</span>
                                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{h.review![cat.key]}/5</span>
                                </div>
                                <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-1.5 rounded-full transition-all" style={{ width: `${(h.review![cat.key] / 5) * 100}%` }}/>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-8 text-[#94A3B8] border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
                          <Star className="w-8 h-8 mb-2 opacity-30"/>
                          <p className="text-sm font-medium">No review yet</p>
                          <button
                            onClick={() => { setModalRatings(emptyRating); setModalSummary(""); setRateModal(h.id); }}
                            className="mt-2 text-xs text-violet-500 hover:underline"
                          >Add teammate review →</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rate Teammate Modal */}
      {rateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#121A2B] rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 p-8 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500"/>Rate Teammate
              </h3>
              <button onClick={() => setRateModal(null)} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#94A3B8]"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-4 mb-6">
              {REVIEW_CATS.map(cat => (
                <div key={cat.key} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/5 dark:border-white/5">
                  <span className="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]">{cat.label}</span>
                  <StarRating value={modalRatings[cat.key]} onChange={v => setModalRatings(r => ({...r, [cat.key]: v}))}/>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">Review Summary (optional)</label>
              <textarea
                rows={2}
                className="w-full px-4 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors resize-none text-sm"
                placeholder="Write a short review..."
                value={modalSummary}
                onChange={e => setModalSummary(e.target.value)}
              />
            </div>
            {calcAvg(modalRatings) > 0 && (
              <div className="mb-4 text-center">
                <span className="text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">{calcAvg(modalRatings)}</span>
                <span className="text-[#94A3B8] text-sm">/5 average</span>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setRateModal(null)} className="flex-1 py-2 rounded-xl border border-black/10 dark:border-white/10 text-sm text-[#64748B] hover:text-red-500 transition-colors">Cancel</button>
              <button
                onClick={() => handleSaveReview(rateModal)}
                className="flex-1 py-2 rounded-xl bg-violet-500 text-white font-semibold text-sm hover:bg-violet-600 transition-colors"
              >Save Review</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

