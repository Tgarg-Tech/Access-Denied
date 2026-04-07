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
  Github,
  Linkedin,
  FileText,
  Award,
  ShieldCheck,
  Link2,
} from "lucide-react";

import { useProfile } from "../contexts/ProfileContext";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

interface ProfilePageProps {
  autoOpenVerification?: boolean;
}

interface VerificationData {
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  certificateLinks: string[];
  status?: string;
}

type VerificationMessageType = "success" | "error";

const parseUrl = (value: string) => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const normalizeHostname = (hostname: string) => hostname.toLowerCase();

const isGithubUrl = (value: string) => {
  const parsed = parseUrl(value);
  if (!parsed) return false;
  const host = normalizeHostname(parsed.hostname);
  return (
    parsed.protocol === "https:" &&
    (host === "github.com" || host === "www.github.com")
  );
};

const isLinkedinUrl = (value: string) => {
  const parsed = parseUrl(value);
  if (!parsed) return false;
  const host = normalizeHostname(parsed.hostname);
  return (
    parsed.protocol === "https:" &&
    (host === "linkedin.com" || host === "www.linkedin.com")
  );
};

const isDriveUrl = (value: string) => {
  const parsed = parseUrl(value);
  if (!parsed) return false;
  const host = normalizeHostname(parsed.hostname);
  return (
    parsed.protocol === "https:" &&
    (host === "drive.google.com" || host === "docs.google.com")
  );
};

const isCertificateLikeUrl = (value: string) => {
  const parsed = parseUrl(value);
  if (!parsed) return false;

  const host = normalizeHostname(parsed.hostname);
  const href = value.toLowerCase();

  const knownCertificateHosts = [
    "credly.com",
    "www.credly.com",
    "coursera.org",
    "www.coursera.org",
    "udemy.com",
    "www.udemy.com",
    "skillshop.exceedlms.com",
    "hackerrank.com",
    "www.hackerrank.com",
    "leetcode.com",
    "www.leetcode.com",
    "codechef.com",
    "www.codechef.com",
    "unstop.com",
    "www.unstop.com",
  ];

  const hasCertificateKeywords =
    href.includes("cert") ||
    href.includes("certificate") ||
    href.includes("badge") ||
    href.includes("verify");

  return (
    parsed.protocol === "https:" &&
    (knownCertificateHosts.includes(host) || hasCertificateKeywords)
  );
};

export function ProfilePage({
  autoOpenVerification = false,
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isVerificationSaving, setIsVerificationSaving] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationMessageType, setVerificationMessageType] =
    useState<VerificationMessageType>("success");
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

  const [verificationForm, setVerificationForm] = useState({
    githubUrl: "",
    linkedinUrl: "",
    resumeUrl: "",
    certificateLinks: "",
  });

  const [savedVerification, setSavedVerification] =
    useState<VerificationData | null>(null);

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

  useEffect(() => {
    const loadVerification = async () => {
      if (!db || !user?.uid) return;

      try {
        const profileRef = doc(db, "profiles", user.uid);
        const snapshot = await getDoc(profileRef);
        if (!snapshot.exists()) return;

        const data = snapshot.data() as {
          verification?: VerificationData;
        };

        if (!data.verification) return;

        const verification = {
          githubUrl: data.verification.githubUrl || "",
          linkedinUrl: data.verification.linkedinUrl || "",
          resumeUrl: data.verification.resumeUrl || "",
          certificateLinks: Array.isArray(data.verification.certificateLinks)
            ? data.verification.certificateLinks
            : [],
          status: data.verification.status || "submitted",
        };

        setSavedVerification(verification);
        setVerificationForm({
          githubUrl: verification.githubUrl,
          linkedinUrl: verification.linkedinUrl,
          resumeUrl: verification.resumeUrl,
          certificateLinks: verification.certificateLinks.join(", "),
        });
      } catch (error) {
        console.error("Failed to load verification data:", error);
      }
    };

    loadVerification();
  }, [user?.uid]);

  useEffect(() => {
    if (!autoOpenVerification) return;

    setVerificationMessage("");
    setVerificationMessageType("success");
    setIsVerificationOpen(true);
  }, [autoOpenVerification]);

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

  const handleVerificationSave = async () => {
    if (!db || !user?.uid) return;

    const certificateLinks = verificationForm.certificateLinks
      .split(",")
      .map((link) => link.trim())
      .filter(Boolean);

    const githubUrl = verificationForm.githubUrl.trim();
    const linkedinUrl = verificationForm.linkedinUrl.trim();
    const resumeUrl = verificationForm.resumeUrl.trim();

    if (githubUrl && !isGithubUrl(githubUrl)) {
      setVerificationMessageType("error");
      setVerificationMessage(
        "GitHub field accepts only a valid https://github.com/... profile or repo link.",
      );
      return;
    }

    if (linkedinUrl && !isLinkedinUrl(linkedinUrl)) {
      setVerificationMessageType("error");
      setVerificationMessage(
        "LinkedIn field accepts only a valid https://linkedin.com/... link.",
      );
      return;
    }

    if (
      resumeUrl &&
      !(isDriveUrl(resumeUrl) || isCertificateLikeUrl(resumeUrl))
    ) {
      setVerificationMessageType("error");
      setVerificationMessage(
        "Resume link must be a Google Drive link or a certificate verification link.",
      );
      return;
    }

    const invalidCertificateLink = certificateLinks.find(
      (link) => !(isDriveUrl(link) || isCertificateLikeUrl(link)),
    );

    if (invalidCertificateLink) {
      setVerificationMessageType("error");
      setVerificationMessage(
        "Each certificate link must be a Google Drive link or a certificate verification link.",
      );
      return;
    }

    const verificationPayload: VerificationData = {
      githubUrl,
      linkedinUrl,
      resumeUrl,
      certificateLinks,
      status: "submitted",
    };

    try {
      setIsVerificationSaving(true);
      setVerificationMessage("");

      await setDoc(
        doc(db, "profiles", user.uid),
        {
          verification: {
            ...verificationPayload,
            submittedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setSavedVerification(verificationPayload);
      setVerificationMessageType("success");
      setVerificationMessage("Verification links saved to Firestore.");
      setIsVerificationOpen(false);
    } catch (error) {
      console.error("Failed to save verification:", error);
      setVerificationMessageType("error");
      setVerificationMessage("Could not save verification links. Try again.");
    } finally {
      setIsVerificationSaving(false);
    }
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
                  <>
                    <button
                      onClick={() => {
                        setVerificationMessage("");
                        setVerificationMessageType("success");
                        setIsVerificationOpen((prev) => !prev);
                      }}
                      className="px-6 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-500/25"
                    >
                      {savedVerification
                        ? "Update Verification"
                        : "Verify Skills"}
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] font-medium hover:border-violet-500 transition-colors"
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>

            {verificationMessage && (
              <div
                className={`mb-6 rounded-xl px-4 py-3 text-sm border ${
                  verificationMessageType === "error"
                    ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
                    : "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300"
                }`}
              >
                {verificationMessage}
              </div>
            )}

            {savedVerification && !isVerificationOpen && (
              <div className="mb-8 p-4 rounded-2xl border border-green-500/20 bg-green-500/5 dark:bg-green-500/10">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      Verification Links
                    </h3>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-700 dark:text-green-300">
                      {savedVerification.status || "submitted"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setVerificationMessage("");
                      setIsVerificationOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-[#0B1020] border border-green-500/30 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    Edit Verification
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  {savedVerification.githubUrl && (
                    <p className="text-[#0F172A] dark:text-[#F8FAFC] break-all">
                      GitHub: {savedVerification.githubUrl}
                    </p>
                  )}
                  {savedVerification.linkedinUrl && (
                    <p className="text-[#0F172A] dark:text-[#F8FAFC] break-all">
                      LinkedIn: {savedVerification.linkedinUrl}
                    </p>
                  )}
                  {savedVerification.resumeUrl && (
                    <p className="text-[#0F172A] dark:text-[#F8FAFC] break-all">
                      Resume: {savedVerification.resumeUrl}
                    </p>
                  )}
                  {savedVerification.certificateLinks.length > 0 && (
                    <p className="text-[#0F172A] dark:text-[#F8FAFC] break-all">
                      Certificates:{" "}
                      {savedVerification.certificateLinks.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {isVerificationOpen && (
              <div className="mb-8 p-5 rounded-2xl border border-green-500/30 bg-green-500/5 dark:bg-green-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    Skill Verification Form
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-1 flex items-center gap-2">
                      <Github className="w-4 h-4 text-[#0F172A] dark:text-[#F8FAFC]" />
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={verificationForm.githubUrl}
                      onChange={(e) =>
                        setVerificationForm((prev) => ({
                          ...prev,
                          githubUrl: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 rounded-xl bg-white dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-1 flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-[#0F172A] dark:text-[#F8FAFC]" />
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={verificationForm.linkedinUrl}
                      onChange={(e) =>
                        setVerificationForm((prev) => ({
                          ...prev,
                          linkedinUrl: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 rounded-xl bg-white dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-1 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0F172A] dark:text-[#F8FAFC]" />
                      Resume Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={verificationForm.resumeUrl}
                      onChange={(e) =>
                        setVerificationForm((prev) => ({
                          ...prev,
                          resumeUrl: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 rounded-xl bg-white dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-1 flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#0F172A] dark:text-[#F8FAFC]" />
                      Certificate Links (comma separated)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="https://certificate1.com, https://certificate2.com"
                      value={verificationForm.certificateLinks}
                      onChange={(e) =>
                        setVerificationForm((prev) => ({
                          ...prev,
                          certificateLinks: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 rounded-xl bg-white dark:bg-[#0B1020] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-green-500 transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setVerificationMessage("");
                      setVerificationMessageType("success");
                      setIsVerificationOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-[#64748B] dark:text-[#94A3B8] hover:text-red-500 hover:border-red-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerificationSave}
                    disabled={isVerificationSaving}
                    className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-70"
                  >
                    {isVerificationSaving
                      ? "Saving..."
                      : savedVerification
                        ? "Update Verification"
                        : "Submit Verification"}
                  </button>
                </div>
                <p className="mt-3 text-xs text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5" />
                  GitHub: github.com only | LinkedIn: linkedin.com only |
                  Resume/Certificates: Google Drive or certificate verification
                  links.
                </p>
              </div>
            )}

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
