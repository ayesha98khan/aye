const router = require("express").Router();
const requireAuth = require("../middleware/auth");
const Job = require("../models/Job");
const User = require("../models/User");

router.get("/", async (req, res, next) => {
  try {
    const { q = "", location = "", type = "", tag = "" } = req.query;

    const filter = { isActive: true };
    if (q) filter.title = { $regex: q, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (type) filter.jobType = type;
    if (tag) filter.tags = tag;

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(100);

    const recruiterIds = [
      ...new Set(
        jobs
          .filter((j) => j.recruiter)
          .map((j) => j.recruiter.toString())
      ),
    ];

    const recruiters = await User.find({ _id: { $in: recruiterIds } });
    const map = new Map(recruiters.map((r) => [r._id.toString(), r]));

    const result = jobs.map((j) => {
      const recruiterId = j.recruiter ? j.recruiter.toString() : null;
      const r = recruiterId ? map.get(recruiterId) : null;

      return {
        ...j.toObject(),
        company: r
          ? {
              id: r._id,
              companyName: r.companyName || r.name,
              companyLogoUrl: r.companyLogoUrl || "",
              companyBio: r.companyBio || "",
            }
          : null,
      };
    });

    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Recruiters only" });
    }

    const { title, location, jobType, salary, description, tags } = req.body || {};

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title required" });
    }

    const job = await Job.create({
      recruiter: req.user._id,
      title: title.trim(),
      location: location || "",
      jobType: jobType || "Full-time",
      salary: salary || "",
      description: description || "",
      tags: Array.isArray(tags) ? tags : [],
      isActive: true,
    });

    res.status(201).json(job);
  } catch (e) {
    next(e);
  }
});

module.exports = router;