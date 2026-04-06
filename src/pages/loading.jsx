import { useEffect, useState } from "react";
import { Users } from "lucide-react";

const nodes = [
  { left: "12%", top: "20%", size: 8, dur: 4.2, del: 0 },
  { left: "80%", top: "15%", size: 6, dur: 5.1, del: 0.8 },
  { left: "88%", top: "65%", size: 10, dur: 6, del: 1.3 },
  { left: "8%", top: "72%", size: 7, dur: 4.7, del: 0.4 },
  { left: "50%", top: "8%", size: 5, dur: 5.5, del: 1 },
  { left: "70%", top: "85%", size: 9, dur: 3.9, del: 0.2 },
  { left: "25%", top: "88%", size: 6, dur: 6.2, del: 1.6 },
  { left: "92%", top: "40%", size: 5, dur: 4.4, del: 0.7 },
];

const labels = [
  "Finding your matches...",
  "Scoring team balance...",
  "Almost there...",
];

const tags = [
  { label: "Frontend", color: "purple" },
  { label: "Backend", color: "teal" },
  { label: "UI / UX", color: "pink" },
  { label: "ML Engineer", color: "amber" },
  { label: "DevOps", color: "blue" },
  { label: "Full Stack", color: "purple" },
  { label: "Data Science", color: "teal" },
];

const tagStyles = {
  purple: {
    background: "rgba(83,74,183,0.18)",
    color: "#AFA9EC",
    border: "1px solid rgba(83,74,183,0.25)",
  },
  teal: {
    background: "rgba(29,158,117,0.15)",
    color: "#5DCAA5",
    border: "1px solid rgba(29,158,117,0.2)",
  },
  pink: {
    background: "rgba(212,83,126,0.15)",
    color: "#ED93B1",
    border: "1px solid rgba(212,83,126,0.2)",
  },
  amber: {
    background: "rgba(186,117,23,0.15)",
    color: "#EF9F27",
    border: "1px solid rgba(186,117,23,0.2)",
  },
  blue: {
    background: "rgba(55,138,221,0.15)",
    color: "#85B7EB",
    border: "1px solid rgba(55,138,221,0.2)",
  },
};

export default function Loading({ onDone, durationMs = 2600 }) {
  const [labelIndex, setLabelIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLabelIndex((i) => (i + 1) % labels.length);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!onDone) return;
    const timeout = setTimeout(() => {
      onDone();
    }, durationMs);
    return () => clearTimeout(timeout);
  }, [onDone, durationMs]);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .dm-root {
          min-height: 100vh;
          background: #0c0c0f;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }
        .dm-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(83,74,183,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(83,74,183,0.08) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%);
        }
        .dm-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .dm-orb-1 {
          width: 400px; height: 400px;
          background: rgba(83,74,183,0.18);
          top: -80px; left: -60px;
          animation: dmDrift1 8s ease-in-out infinite alternate;
        }
        .dm-orb-2 {
          width: 300px; height: 300px;
          background: rgba(29,158,117,0.12);
          bottom: -60px; right: -40px;
          animation: dmDrift2 10s ease-in-out infinite alternate;
        }
        @keyframes dmDrift1 { from{transform:translate(0,0)} to{transform:translate(40px,30px)} }
        @keyframes dmDrift2 { from{transform:translate(0,0)} to{transform:translate(-30px,-20px)} }
        .dm-node {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(127,119,221,0.2);
          animation: dmNodeFloat linear infinite;
        }
        @keyframes dmNodeFloat {
          0%  { transform: translateY(0px) scale(1);      opacity: 0.5; }
          50% { transform: translateY(-14px) scale(1.05); opacity: 1;   }
          100%{ transform: translateY(0px) scale(1);      opacity: 0.5; }
        }
        .dm-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
          display: flex;
          justify-content: center;
          padding: 1.25rem 1.5rem;
        }
        .dm-header-inner {
          width: 100%;
          max-width: 1280px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dm-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          color: #fff;
          text-decoration: none;
        }
        .dm-brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dm-brand-name {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .dm-hero { text-align: center; z-index: 1; animation: dmFadeUp 0.7s 0.1s ease both; }
        .dm-headline {
          font-size: clamp(36px, 7vw, 64px);
          font-weight: 800; color: #fff;
          line-height: 1.1; letter-spacing: -1.5px;
          margin-bottom: 1.25rem;
        }
        .dm-accent      { color: #7F77DD; }
        .dm-accent-teal { color: #1D9E75; }
        .dm-sub {
          font-size: 16px; color: rgba(255,255,255,0.45);
          font-weight: 300; max-width: 360px;
          line-height: 1.6; margin: 0 auto 2.5rem;
        }
        .dm-bar-wrap {
          width: 220px; height: 3px;
          background: rgba(255,255,255,0.08);
          border-radius: 99px; overflow: hidden;
          margin: 0 auto 1rem;
        }
        .dm-bar {
          height: 100%; width: 0%;
          background: linear-gradient(90deg, #534AB7, #1D9E75);
          border-radius: 99px;
          animation: dmLoadBar 2.4s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes dmLoadBar {
          0%  { width: 0%; }
          60% { width: 75%; }
          85% { width: 88%; }
          100%{ width: 100%; }
        }
        .dm-label {
          font-size: 12px; color: rgba(255,255,255,0.3);
          letter-spacing: 0.5px;
          animation: dmPulse 1.8s ease-in-out infinite;
        }
        @keyframes dmPulse { 0%,100%{opacity:0.3} 50%{opacity:0.6} }
        .dm-tags {
          display: flex; flex-wrap: wrap; gap: 8px;
          justify-content: center; max-width: 400px;
          margin: 2rem auto 0; z-index: 1;
          animation: dmFadeUp 0.8s 0.3s ease both;
        }
        .dm-tag {
          font-size: 11px; font-weight: 500;
          padding: 4px 12px; border-radius: 99px;
          letter-spacing: 0.3px;
        }
        @keyframes dmFadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div className="dm-root">
        <div className="dm-grid-bg" />
        <div className="dm-orb dm-orb-1" />
        <div className="dm-orb dm-orb-2" />

        {nodes.map((n, i) => (
          <div
            key={i}
            className="dm-node"
            style={{
              left: n.left,
              top: n.top,
              width: n.size,
              height: n.size,
              animationDuration: `${n.dur}s`,
              animationDelay: `${n.del}s`,
            }}
          />
        ))}

        <div className="dm-header">
          <div className="dm-header-inner">
            <div className="dm-brand">
              <div className="dm-brand-icon">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="dm-brand-name">DevSath</span>
            </div>
          </div>
        </div>

        <div className="dm-hero">
          <div className="dm-headline">
            Find your
            <br />
            <span className="dm-accent">perfect</span> team
            <span className="dm-accent-teal">.</span>
          </div>
          <div className="dm-sub">
            Swipe right on your perfect hackathon team.
          </div>
          <div className="dm-bar-wrap">
            <div className="dm-bar" />
          </div>
          <div className="dm-label">{labels[labelIndex]}</div>
        </div>

        <div className="dm-tags">
          {tags.map((t, i) => (
            <div key={i} className="dm-tag" style={tagStyles[t.color]}>
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
