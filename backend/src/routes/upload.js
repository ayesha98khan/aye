const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const requireAuth = require("../middleware/auth");
const User = require("../models/User");

const uploadDir = path.join(__dirname, "..", "uploads", "resumes");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Only PDF, DOC, DOCX files are allowed"));
    }
    cb(null, true);
  },
});

router.post("/resume", requireAuth, upload.single("resume"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file required" });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resumeUrl },
      { new: true }
    );

    res.json({
      message: "Resume uploaded successfully",
      resumeUrl,
      user,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
