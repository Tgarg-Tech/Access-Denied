const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");

const yearIndex = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4, Graduate: 5 };

function normalizeIdentifier(v) {
  return (v || "").trim().toLowerCase();
}

function roleBoost(myRole, theirRole) {
  const complementary = {
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
  const list = complementary[myRole] || [];
  return list.includes(theirRole) ? 15 : 8;
}

function computeRating(me, candidate) {
  const mySkillSet = new Set(
    (me.technicalSkills || []).map((s) => s.toLowerCase()),
  );
  const theirSkillSet = new Set(
    (candidate.technicalSkills || []).map((s) => s.toLowerCase()),
  );
  const myInterestSet = new Set(
    (me.projectTypes || []).map((i) => i.toLowerCase()),
  );

  const complement = (candidate.technicalSkills || []).filter(
    (s) => !mySkillSet.has(s.toLowerCase()),
  );
  const skillComplement = Math.min(complement.length, 5);

  const shared = (candidate.projectTypes || []).filter((i) =>
    myInterestSet.has(i.toLowerCase()),
  );
  const commonInterests = Math.min(shared.length, 5);

  const reverse = (me.technicalSkills || []).filter(
    (s) => !theirSkillSet.has(s.toLowerCase()),
  );
  const reverseComplement = Math.min(reverse.length, 5);

  const myYr = yearIndex[me.collegeYear] || 3;
  const theirYr = yearIndex[candidate.collegeYear] || 3;
  const diff = Math.abs(myYr - theirYr);
  const expScore = diff === 0 ? 3 : diff === 1 ? 2 : diff === 2 ? 1 : 0;

  const collegeBonus =
    normalizeIdentifier(me.college) === normalizeIdentifier(candidate.college)
      ? 1
      : 0;

  const extraSkills = Math.min(complement.length, 5);

  const projBoost = roleBoost(
    me.preferredRole || "",
    candidate.preferredRole || "",
  );

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
    score,
    raw,
    skillComplement,
    commonInterests,
    reverseComplement,
    experienceMatch: expScore,
    sameCollege: collegeBonus,
    extraSkills,
    projectBoost: projBoost,
  };
}

// POST /api/match/:uid - compute matches for uid
router.post("/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const meDoc = await db.collection("profiles").doc(uid).get();
    if (!meDoc.exists)
      return res.status(404).json({ error: "profile not found" });
    const me = meDoc.data();

    // fetch candidates
    const snap = await db.collection("profiles").get();
    const candidates = snap.docs
      .filter((d) => d.id !== uid)
      .map((d) => ({ id: d.id, ...d.data() }));

    const scored = candidates.map((c) => ({
      id: c.id,
      ...computeRating(me, c),
      candidate: c,
    }));
    scored.sort((a, b) => b.score - a.score);
    res.json({ top: scored.slice(0, 20) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "match computation failed" });
  }
});

module.exports = router;
