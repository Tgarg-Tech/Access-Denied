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
} from "lucide-react";

import { useProfile } from "../contexts/ProfileContext";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

interface ProfilePageProps {}

export function ProfilePage({}: ProfilePageProps) {
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
      </div>
    </div>
  );
}
