const express = require("express");
const router = express.Router();
const { db, admin } = require("../firebaseAdmin");

// GET /api/profiles/:uid
router.get("/:uid", async (req, res) => {
  try {
    const doc = await db.collection("profiles").doc(req.params.uid).get();
    if (!doc.exists) return res.status(404).json({ error: "not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch profile" });
  }
});

// PUT /api/profiles/:uid - authenticated; only owner may update
router.put("/:uid", async (req, res) => {
  const uid = req.params.uid;
  if (!req.user || req.user.uid !== uid)
    return res.status(403).json({ error: "forbidden" });
  try {
    const payload = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection("profiles").doc(uid).set(payload, { merge: true });
    const doc = await db.collection("profiles").doc(uid).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to update profile" });
  }
});

module.exports = router;
