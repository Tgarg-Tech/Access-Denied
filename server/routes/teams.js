const express = require("express");
const router = express.Router();
const { db, admin } = require("../firebaseAdmin");

// POST /api/teams - create a team
router.post("/", async (req, res) => {
  try {
    const ownerUid = req.user.uid;
    const { hackathonId, name, members = [] } = req.body;
    const payload = {
      hackathonId: hackathonId || null,
      name: name || "Untitled Team",
      ownerUid,
      members: [
        {
          uid: ownerUid,
          role: "owner",
          joinedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        ...members,
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const ref = await db.collection("teams").add(payload);
    const doc = await ref.get();
    res.status(201).json({ id: ref.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to create team" });
  }
});

// GET /api/teams/:id
router.get("/:id", async (req, res) => {
  try {
    const d = await db.collection("teams").doc(req.params.id).get();
    if (!d.exists) return res.status(404).json({ error: "not found" });
    res.json({ id: d.id, ...d.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch team" });
  }
});

module.exports = router;
