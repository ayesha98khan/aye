const router = require("express").Router();
const requireAuth = require("../middleware/auth");
const User = require("../models/User");

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const u = await User.findById(req.user.id);
    res.json(safe(u));
  } catch (e) {
    next(e);
  }
});

router.put("/me", requireAuth, async (req, res, next) => {
  try {
    const updates = req.body || {};
    const allowed = [
      "name",
      "bio",
      "skills",
      "resumeUrl",
      "companyName",
      "companyLogoUrl",
      "companyBio",
      "companyPhotos",
    ];
    const safeUpdates = {};
    for (const k of allowed) if (k in updates) safeUpdates[k] = updates[k];

    const u = await User.findByIdAndUpdate(req.user.id, safeUpdates, { new: true });
    res.json(safe(u));
  } catch (e) {
    next(e);
  }
});

router.get("/company/:id", async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u || u.role !== "recruiter") return res.status(404).json({ message: "Company not found" });
    res.json(safe(u));
  } catch (e) {
    next(e);
  }
});

function safe(u) {
  return {
    id: u._id,
    role: u.role,
    name: u.name,
    email: u.email,
    bio: u.bio,
    skills: u.skills,
    resumeUrl: u.resumeUrl,
    companyName: u.companyName,
    companyLogoUrl: u.companyLogoUrl,
    companyBio: u.companyBio,
    companyPhotos: u.companyPhotos,
  };
}

module.exports = router;