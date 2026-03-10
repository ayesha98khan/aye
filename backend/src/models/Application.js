const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    fullName: { type: String, required: true },
    phone: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    message: { type: String, default: "" },

    status: {
      type: String,
      enum: ["applied", "reviewing", "shortlisted", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);