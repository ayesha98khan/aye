const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["todo", "inprogress", "done"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },

    // who created it
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // optional links
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);