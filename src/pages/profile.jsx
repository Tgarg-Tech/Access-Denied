import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useProfile } from "../contexts/ProfileContext";
import { useAuth } from "../contexts/AuthContext";

export default function Profile({ onComplete, onBack }) {
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: profile.fullName || user?.displayName || "",
    email: profile.email || user?.email || "",
    college: profile.college || "",
    year: profile.collegeYear || "",
    role: profile.preferredRole || "",
    skills: profile.technicalSkills || [],
    interests: profile.projectTypes || [],
    availability: profile.availability || "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: prev.name || profile.fullName || user?.displayName || "",
      email: prev.email || profile.email || user?.email || "",
      college: prev.college || profile.college || "",
      year: prev.year || profile.collegeYear || "",
      role: prev.role || profile.preferredRole || "",
      skills: prev.skills.length ? prev.skills : profile.technicalSkills || [],
      interests: prev.interests.length
        ? prev.interests
        : profile.projectTypes || [],
      availability: prev.availability || profile.availability || "",
    }));
  }, [profile, user]);

  const skills = [
    "React",
    "Node.js",
    "Python",
    "ML/AI",
    "UI/UX",
    "Figma",
    "MongoDB",
    "DevOps",
    "Flutter",
    "Swift",
  ];
  const roles = [
    "Frontend Dev",
    "Backend Dev",
    "Full Stack",
    "UI/UX Designer",
    "ML Engineer",
    "DevOps",
    "Mobile Dev",
  ];
  const interests = [
    "AI/ML",
    "Web3",
    "EdTech",
    "HealthTech",
    "FinTech",
    "Gaming",
    "Social Impact",
    "AR/VR",
  ];

  const toggle = (key, val) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val)
        ? f[key].filter((x) => x !== val)
        : [...f[key], val],
    }));
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .pr-root {
          min-height: 100vh;
          background: #0c0c0f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }
        .pr-orb-1 {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
          width: 350px; height: 350px;
          background: rgba(83,74,183,0.15);
          top: -80px; left: -60px;
        }
        .pr-orb-2 {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
          width: 250px; height: 250px;
          background: rgba(29,158,117,0.1);
          bottom: -60px; right: -40px;
        }
        .pr-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 2.5rem;
          width: 100%;
          max-width: 480px;
          z-index: 1;
        }
        .pr-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
          display: flex;
          justify-content: center;
          padding: 1.25rem 1.5rem;
        }
        .pr-header-inner {
          width: 100%;
          max-width: 1280px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pr-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          color: #fff;
          text-decoration: none;
        }
        .pr-brand-icon {
          width: 32px;
          height: 32px;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pr-brand-name {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .pr-title {
          font-size: 26px; font-weight: 800;
          color: #fff; margin-bottom: 0.4rem;
          letter-spacing: -0.5px;
        }
        .pr-sub {
          font-size: 14px; color: rgba(255,255,255,0.4);
          margin-bottom: 2rem;
        }
        .pr-steps {
          display: flex; gap: 6px; margin-bottom: 2rem;
        }
        .pr-step {
          height: 3px; flex: 1; border-radius: 99px;
          background: rgba(255,255,255,0.1);
          transition: background 0.3s;
        }
        .pr-step.active { background: #534AB7; }
        .pr-step.done   { background: #1D9E75; }
        .pr-label {
          font-size: 12px; color: rgba(255,255,255,0.4);
          margin-bottom: 6px; letter-spacing: 0.3px;
        }
        .pr-input {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 12px 16px;
          color: #fff; font-size: 15px;
          margin-bottom: 1rem; outline: none;
          transition: border 0.2s;
        }
        .pr-input:focus { border-color: rgba(83,74,183,0.6); }
        .pr-input option { background: #1a1a2e; }
        .pr-chips {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin-bottom: 1.5rem;
        }
        .pr-chip {
          padding: 6px 14px; border-radius: 99px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          font-size: 13px; cursor: pointer;
          transition: all 0.2s;
        }
        .pr-chip.selected {
          background: rgba(83,74,183,0.25);
          border-color: rgba(83,74,183,0.5);
          color: #AFA9EC;
        }
        .pr-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #534AB7, #1D9E75);
          border: none; border-radius: 12px;
          color: #fff; font-size: 15px; font-weight: 600;
          cursor: pointer; margin-top: 0.5rem;
          transition: opacity 0.2s;
        }
        .pr-btn:hover { opacity: 0.9; }
        .pr-btn-ghost {
          width: 100%; padding: 12px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: rgba(255,255,255,0.4);
          font-size: 14px; cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s;
        }
        .pr-btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); }
        .pr-row { display: flex; gap: 12px; }
        .pr-row > * { flex: 1; }
      `}</style>

      <div className="pr-root">
        <div className="pr-orb-1" />
        <div className="pr-orb-2" />

        <div className="pr-header">
          <div className="pr-header-inner">
            <div className="pr-brand">
              <div className="pr-brand-icon">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="pr-brand-name">HackMate</span>
            </div>
          </div>
        </div>

        <div className="pr-card">
          <div className="pr-steps">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`pr-step ${step === s ? "active" : step > s ? "done" : ""}`}
              />
            ))}
          </div>

          {step === 1 && (
            <>
              <div className="pr-title">Who are you?</div>
              <div className="pr-sub">Let's set up your hacker profile</div>

              <div className="pr-label">Full name</div>
              <input
                className="pr-input"
                placeholder="Sanjay Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <div className="pr-label">Email</div>
              <input
                className="pr-input"
                placeholder="sanjay@college.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <div className="pr-row">
                <div>
                  <div className="pr-label">College</div>
                  <input
                    className="pr-input"
                    placeholder="IIT Delhi"
                    value={form.college}
                    onChange={(e) =>
                      setForm({ ...form, college: e.target.value })
                    }
                  />
                </div>
                <div>
                  <div className="pr-label">Year</div>
                  <select
                    className="pr-input"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  >
                    <option value="">Year</option>
                    <option>1st</option>
                    <option>2nd</option>
                    <option>3rd</option>
                    <option>4th</option>
                    <option>Graduate</option>
                  </select>
                </div>
              </div>

              <button className="pr-btn" onClick={() => setStep(2)}>
                Continue →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="pr-title">Your skills</div>
              <div className="pr-sub">Pick your role and top skills</div>

              <div className="pr-label">Preferred role</div>
              <select
                className="pr-input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="">Select a role</option>
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>

              <div className="pr-label">Skills (pick all that apply)</div>
              <div className="pr-chips">
                {skills.map((s) => (
                  <div
                    key={s}
                    className={`pr-chip ${form.skills.includes(s) ? "selected" : ""}`}
                    onClick={() => toggle("skills", s)}
                  >
                    {s}
                  </div>
                ))}
              </div>

              <button className="pr-btn" onClick={() => setStep(3)}>
                Continue →
              </button>
              <button className="pr-btn-ghost" onClick={() => setStep(1)}>
                ← Back
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="pr-title">What you're building</div>
              <div className="pr-sub">Pick your interests and availability</div>

              <div className="pr-label">Project interests</div>
              <div className="pr-chips">
                {interests.map((i) => (
                  <div
                    key={i}
                    className={`pr-chip ${form.interests.includes(i) ? "selected" : ""}`}
                    onClick={() => toggle("interests", i)}
                  >
                    {i}
                  </div>
                ))}
              </div>

              <div className="pr-label">Availability</div>
              <select
                className="pr-input"
                value={form.availability}
                onChange={(e) =>
                  setForm({ ...form, availability: e.target.value })
                }
              >
                <option value="">Select availability</option>
                <option>Full-time (24hrs)</option>
                <option>Part-time (12hrs)</option>
                <option>Casual (6hrs)</option>
              </select>

              <button
                className="pr-btn"
                onClick={() => {
                  updateProfile({
                    fullName: form.name,
                    email: form.email,
                    college: form.college,
                    collegeYear: form.year,
                    preferredRole: form.role,
                    technicalSkills: form.skills,
                    projectTypes: form.interests,
                    availability: form.availability,
                  });
                  if (onComplete) {
                    onComplete(form);
                    return;
                  }
                  alert("Profile saved! 🎉");
                }}
              >
                Find my team →
              </button>
              <button
                className="pr-btn-ghost"
                onClick={() => {
                  if (onBack) {
                    onBack();
                    return;
                  }
                  setStep(2);
                }}
              >
                ← Back
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
