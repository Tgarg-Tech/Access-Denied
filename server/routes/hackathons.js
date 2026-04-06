const express = require("express");
const router = express.Router();
const { fetchHackathonsFromApify } = require("../services/apifyService");

// GET /api/hackathons - list hackathons from Apify/Unstop
router.get("/", async (req, res) => {
  try {
    const hackathons = await fetchHackathonsFromApify();
    res.json(hackathons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch hackathons" });
  }
});

// GET /api/hackathons/:id
router.get("/:id", async (req, res) => {
  try {
    const hackathons = await fetchHackathonsFromApify();
    const hackathon = hackathons.find((h) => h.id === req.params.id);
    if (!hackathon) return res.status(404).json({ error: "not found" });
    res.json(hackathon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch hackathon" });
  }
});

module.exports = router;
