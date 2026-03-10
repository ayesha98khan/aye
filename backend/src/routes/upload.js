const router = require("express").Router();
const multer = require("multer");
const requireAuth = require("../middleware/auth");
const { uploadBuffer } = require("../utils/uploader");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.post("/image", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });
    if (!String(req.file.mimetype || "").startsWith("image/")) {
      return res.status(400).json({ message: "Only image files are allowed" });
    }

    const url = await uploadBuffer(req.file.buffer, {
      folder: "images",
      resourceType: "image",
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    });
    res.json({ url });
  } catch (e) {
    next(e);
  }
});

router.post("/resume", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Resume must be PDF, DOC, or DOCX" });
    }

    const url = await uploadBuffer(req.file.buffer, {
      folder: "resumes",
      resourceType: "raw",
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    });
    res.json({ url });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
