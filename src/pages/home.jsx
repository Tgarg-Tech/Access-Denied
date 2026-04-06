import { useState } from "react";
import { Users } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Aryan Mehta",
    college: "IIT Bombay",
    year: "3rd",
    role: "ML Engineer",
    skills: ["Python", "TensorFlow", "FastAPI"],
    interests: ["AI/ML", "HealthTech"],
    availability: "Full-time",
    match: 94,
    gap: "You need ML — they bring it",
    reason: "Shared interest in AI/ML · Complements your backend skills",
  },
  {
    id: 2,
    name: "Priya Sharma",
    college: "BITS Pilani",
    year: "4th",
    role: "UI/UX Designer",
    skills: ["Figma", "React", "Tailwind"],
    interests: ["EdTech", "Social Impact"],
    availability: "Full-time",
    match: 89,
    gap: "Team missing a designer — perfect fit",
    reason: "Shared interest in EdTech · You bring logic, they bring beauty",
  },
  {
    id: 3,
    name: "Rohan Das",
    college: "NIT Trichy",
    year: "2nd",
    role: "Frontend Dev",
    skills: ["React", "Next.js", "TypeScript"],
    interests: ["Web3", "Gaming"],
    availability: "Part-time",
    match: 82,
    gap: "Strong frontend to your backend",
    reason: "Complementary stack · Both available evenings",
  },
  {
    id: 4,
    name: "Sneha Iyer",
    college: "VIT Vellore",
    year: "3rd",
    role: "DevOps",
    skills: ["Docker", "AWS", "CI/CD"],
    interests: ["FinTech", "AI/ML"],
    availability: "Full-time",
    match: 78,
    gap: "DevOps missing from your team",
    reason: "Shared AI/ML interest · Keeps your infra solid",
  },
  {
    id: 5,
    name: "Kabir Singh",
    college: "DTU Delhi",
    year: "4th",
    role: "Full Stack",
    skills: ["Node.js", "React", "MongoDB"],
    interests: ["Social Impact", "EdTech"],
    availability: "Full-time",
    match: 74,
    gap: "Versatile builder to fill gaps",
    reason: "Same stack · Can cover multiple roles",
  },
  {
    id: 6,
    name: "Ananya Roy",
    college: "Jadavpur University",
    year: "3rd",
    role: "Mobile Dev",
    skills: ["Flutter", "Firebase", "Swift"],
    interests: ["HealthTech", "AR/VR"],
    availability: "Part-time",
    match: 69,
    gap: "Mobile presence for your product",
    reason: "Unique skillset · Adds mobile dimension",
  },
];

const teamRoles = [
  { role: "Frontend", filled: true },
  { role: "Backend", filled: true },
  { role: "UI/UX", filled: false },
  { role: "ML Engineer", filled: false },
  { role: "DevOps", filled: false },
];

export default function Home({ onNavigate }) {
  const [invited, setInvited] = useState([]);
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("matches");

  const teamScore = Math.round(
    (teamRoles.filter((r) => r.filled).length / teamRoles.length) * 100,
  );

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hm-root {
          min-height: 100vh;
          background: #0c0c0f;
          font-family: sans-serif;
          color: #fff;
        }
        .hm-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky; top: 0; z-index: 100;
          background: rgba(12,12,15,0.9);
          backdrop-filter: blur(12px);
        }
        .hm-logo {
          display: flex; align-items: center; gap: 8px;
          font-size: 18px; font-weight: 800; color: #fff;
        }
        .hm-logo-icon {
          width: 30px; height: 30px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .hm-logo span { color: #7F77DD; }
        .hm-nav-right { display: flex; align-items: center; gap: 12px; }
        .hm-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #534AB7, #1D9E75);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; cursor: pointer;
        }
        .hm-body {
          max-width: 1100px; margin: 0 auto;
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
        }
        .hm-left {}
        .hm-right {}

        .hm-banner {
          background: linear-gradient(135deg, rgba(83,74,183,0.2), rgba(29,158,117,0.15));
          border: 1px solid rgba(83,74,183,0.25);
          border-radius: 20px;
          padding: 1.5rem 2rem;
          margin-bottom: 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .hm-banner-title {
          font-size: 20px; font-weight: 800; margin-bottom: 4px;
        }
        .hm-banner-sub {
          font-size: 13px; color: rgba(255,255,255,0.5);
        }
        .hm-banner-score {
          font-size: 42px; font-weight: 800;
          color: #7F77DD;
        }

        .hm-tabs {
          display: flex; gap: 4px;
          background: rgba(255,255,255,0.04);
          border-radius: 12px; padding: 4px;
          margin-bottom: 1.5rem; width: fit-content;
        }
        .hm-tab {
          padding: 8px 20px; border-radius: 8px;
          font-size: 13px; font-weight: 500; cursor: pointer;
          color: rgba(255,255,255,0.4);
          transition: all 0.2s;
          border: none; background: transparent;
        }
        .hm-tab.active {
          background: rgba(83,74,183,0.3);
          color: #AFA9EC;
        }

        .hm-section-title {
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.5px; text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .hm-cards { display: flex; flex-direction: column; gap: 12px; }

        .hm-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hm-card:hover {
          border-color: rgba(83,74,183,0.3);
          background: rgba(83,74,183,0.05);
        }
        .hm-card.expanded {
          border-color: rgba(83,74,183,0.4);
          background: rgba(83,74,183,0.08);
        }
        .hm-card-top {
          display: flex; align-items: center; gap: 12px;
        }
        .hm-card-avatar {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, #534AB7, #1D9E75);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; flex-shrink: 0;
        }
        .hm-card-info { flex: 1; }
        .hm-card-name {
          font-size: 15px; font-weight: 700; margin-bottom: 2px;
        }
        .hm-card-meta {
          font-size: 12px; color: rgba(255,255,255,0.4);
        }
        .hm-card-right { text-align: right; }
        .hm-match-pct {
          font-size: 20px; font-weight: 800; color: #7F77DD;
        }
        .hm-match-label {
          font-size: 11px; color: rgba(255,255,255,0.3);
        }

        .hm-skills {
          display: flex; flex-wrap: wrap; gap: 6px;
          margin-top: 12px;
        }
        .hm-skill {
          font-size: 11px; padding: 3px 10px;
          border-radius: 99px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .hm-expanded {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .hm-reason {
          font-size: 13px; color: rgba(255,255,255,0.5);
          margin-bottom: 8px; line-height: 1.5;
        }
        .hm-gap-pill {
          display: inline-block;
          font-size: 12px; padding: 4px 12px;
          border-radius: 99px;
          background: rgba(29,158,117,0.15);
          color: #5DCAA5;
          border: 1px solid rgba(29,158,117,0.2);
          margin-bottom: 12px;
        }
        .hm-invite-btn {
          padding: 9px 20px;
          background: linear-gradient(135deg, #534AB7, #1D9E75);
          border: none; border-radius: 10px;
          color: #fff; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: opacity 0.2s;
        }
        .hm-invite-btn:hover { opacity: 0.85; }
        .hm-invite-btn.sent {
          background: rgba(29,158,117,0.2);
          color: #5DCAA5;
          border: 1px solid rgba(29,158,117,0.3);
        }

        /* RIGHT SIDEBAR */
        .hm-widget {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 1.25rem;
          margin-bottom: 1rem;
        }
        .hm-widget-title {
          font-size: 13px; font-weight: 700;
          color: rgba(255,255,255,0.6);
          margin-bottom: 1rem;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .hm-score-ring {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 1rem;
        }
        .hm-ring {
          width: 64px; height: 64px; flex-shrink: 0;
          border-radius: 50%;
          background: conic-gradient(#534AB7 ${teamScore * 3.6}deg, rgba(255,255,255,0.06) 0deg);
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .hm-ring-inner {
          width: 48px; height: 48px; border-radius: 50%;
          background: #0c0c0f;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 800; color: #7F77DD;
        }
        .hm-ring-label { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.5; }
        .hm-ring-label strong { color: #fff; font-size: 14px; display: block; }

        .hm-role-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 13px;
        }
        .hm-role-row:last-child { border-bottom: none; }
        .hm-role-name { color: rgba(255,255,255,0.6); }
        .hm-role-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }
        .hm-role-dot.filled { background: #1D9E75; }
        .hm-role-dot.missing { background: rgba(255,255,255,0.15); }

        .hm-stat {
          display: flex; justify-content: space-between;
          font-size: 13px; padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
        }
        .hm-stat:last-child { border-bottom: none; }
        .hm-stat strong { color: #fff; }

        @media (max-width: 768px) {
          .hm-body { grid-template-columns: 1fr; }
          .hm-right { order: -1; }
          .hm-banner { flex-direction: column; gap: 1rem; text-align: center; }
        }
      `}</style>

      <div className="hm-root">
        <nav className="hm-nav">
          <div className="hm-logo">
            <div className="hm-logo-icon">
              <Users className="w-4 h-4 text-white" />
            </div>
            HackMate
          </div>
          <div className="hm-nav-right">
            {onNavigate && (
              <button
                className="hm-invite-btn"
                onClick={() => onNavigate("dashboard")}
                style={{ padding: "8px 14px", fontSize: 12 }}
              >
                Open Hackathons
              </button>
            )}
            <div className="hm-avatar">S</div>
          </div>
        </nav>

        <div className="hm-body">
          <div className="hm-left">
            <div className="hm-banner">
              <div>
                <div className="hm-banner-title">
                  Hey Sanjay, ready to build? 👋
                </div>
                <div className="hm-banner-sub">
                  We found {users.length} teammates that match your profile
                </div>
              </div>
              <div className="hm-banner-score">{users[0].match}%</div>
            </div>

            <div className="hm-tabs">
              {["matches", "invited"].map((t) => (
                <button
                  key={t}
                  className={`hm-tab ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t === "matches"
                    ? `Top Matches (${users.length})`
                    : `Invited (${invited.length})`}
                </button>
              ))}
            </div>

            <div className="hm-section-title">
              {tab === "matches" ? "Recommended for you" : "Pending invites"}
            </div>

            <div className="hm-cards">
              {(tab === "matches"
                ? users
                : users.filter((u) => invited.includes(u.id))
              ).map((u) => (
                <div
                  key={u.id}
                  className={`hm-card ${active === u.id ? "expanded" : ""}`}
                  onClick={() => setActive(active === u.id ? null : u.id)}
                >
                  <div className="hm-card-top">
                    <div className="hm-card-avatar">{u.name[0]}</div>
                    <div className="hm-card-info">
                      <div className="hm-card-name">{u.name}</div>
                      <div className="hm-card-meta">
                        {u.role} · {u.college} · {u.year}
                      </div>
                    </div>
                    <div className="hm-card-right">
                      <div className="hm-match-pct">{u.match}%</div>
                      <div className="hm-match-label">match</div>
                    </div>
                  </div>

                  <div className="hm-skills">
                    {u.skills.map((s) => (
                      <span key={s} className="hm-skill">
                        {s}
                      </span>
                    ))}
                    <span className="hm-skill">{u.availability}</span>
                  </div>

                  {active === u.id && (
                    <div className="hm-expanded">
                      <div className="hm-gap-pill">✦ {u.gap}</div>
                      <div className="hm-reason">{u.reason}</div>
                      <button
                        className={`hm-invite-btn ${invited.includes(u.id) ? "sent" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setInvited((prev) =>
                            prev.includes(u.id) ? prev : [...prev, u.id],
                          );
                        }}
                      >
                        {invited.includes(u.id)
                          ? "✓ Invite sent"
                          : "Send invite →"}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {tab === "invited" && invited.length === 0 && (
                <div
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 14,
                    padding: "2rem",
                    textAlign: "center",
                  }}
                >
                  No invites sent yet. Go match with someone!
                </div>
              )}
            </div>
          </div>

          <div className="hm-right">
            <div className="hm-widget">
              <div className="hm-widget-title">Team Readiness</div>
              <div className="hm-score-ring">
                <div className="hm-ring">
                  <div className="hm-ring-inner">{teamScore}%</div>
                </div>
                <div className="hm-ring-label">
                  <strong>Incomplete</strong>
                  {teamRoles.filter((r) => !r.filled).length} roles missing
                </div>
              </div>
              {teamRoles.map((r) => (
                <div key={r.role} className="hm-role-row">
                  <span className="hm-role-name">{r.role}</span>
                  <span
                    className={`hm-role-dot ${r.filled ? "filled" : "missing"}`}
                  />
                </div>
              ))}
            </div>

            <div className="hm-widget">
              <div className="hm-widget-title">Your Profile</div>
              {[
                { label: "Role", value: "Backend Dev" },
                { label: "Skills", value: "Node.js, MongoDB" },
                { label: "Availability", value: "Full-time" },
                { label: "Interests", value: "AI/ML, EdTech" },
              ].map((s) => (
                <div key={s.label} className="hm-stat">
                  <span>{s.label}</span>
                  <strong>{s.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
