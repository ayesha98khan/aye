const router = require("express").Router();
const requireAuth = require("../middleware/auth");
const Application = require("../models/Application");

router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ message: "Students only" });

    const { jobId, fullName, phone, message, resumeUrl } = req.body || {};
    if (!jobId || !fullName) return res.status(400).json({ message: "jobId and fullName required" });

    const app = await Application.create({
      job: jobId,
      student: req.user.id,
      fullName,
      phone: phone || "",
      message: message || "",
      resumeUrl: resumeUrl || "",
    });

    res.status(201).json(app);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Already applied" });
    next(e);
  }
});

router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const list = await Application.find({ student: req.user.id })
      .populate("job")
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

module.exports = router;