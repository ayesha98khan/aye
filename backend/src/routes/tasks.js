const router = require("express").Router();
const Task = require("../models/Task");

// ✅ Make auth work even if middleware exports differently
const authModule = require("../middleware/auth");
const auth = authModule.auth || authModule.requireAuth || authModule;

if (typeof auth !== "function") {
  throw new Error(
    "Auth middleware is not a function. Fix backend/src/middleware/auth.js export."
  );
}

// GET my tasks
router.get("/mine", auth, async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
});

// CREATE task
router.post("/", auth, async (req, res) => {
  const { title, description, status, priority, jobId, applicationId } = req.body || {};
  if (!title) return res.status(400).json({ message: "Title required" });

  const task = await Task.create({
    title,
    description: description || "",
    status: status || "todo",
    priority: priority || "medium",
    createdBy: req.user.id,
    jobId: jobId || null,
    applicationId: applicationId || null,
  });

  res.status(201).json(task);
});

// UPDATE task
router.put("/:id", auth, async (req, res) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.id },
    { $set: req.body },
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: "Task not found" });
  res.json(updated);
});

// DELETE task
router.delete("/:id", auth, async (req, res) => {
  const out = await Task.deleteOne({ _id: req.params.id, createdBy: req.user.id });
  if (!out.deletedCount) return res.status(404).json({ message: "Task not found" });
  res.json({ ok: true });
});

module.exports = router;