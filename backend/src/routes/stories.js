const router = require("express").Router();
const requireAuth = require("../middleware/auth");
const Story = require("../models/Story");

router.get("/", async (req, res, next) => {
  try {
    const now = new Date();
    const stories = await Story.find({ expiresAt: { $gt: now } })
      .populate("recruiter")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(
      stories.map((s) => ({
        id: s._id,
        mediaUrl: s.mediaUrl,
        caption: s.caption,
        createdAt: s.createdAt,
        recruiter: {
          id: s.recruiter?._id,
          companyName: s.recruiter?.companyName || s.recruiter?.name,
          companyLogoUrl: s.recruiter?.companyLogoUrl,
        },
      }))
    );
  } catch (e) {
    next(e);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== "recruiter") return res.status(403).json({ message: "Recruiters only" });

    const { mediaUrl, caption } = req.body || {};
    if (!mediaUrl) return res.status(400).json({ message: "mediaUrl required" });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const story = await Story.create({ recruiter: req.user.id, mediaUrl, caption: caption || "", expiresAt });
    res.status(201).json(story);
  } catch (e) {
    next(e);
  }
});

module.exports = router;