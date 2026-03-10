const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true },
    location: { type: String, default: "" },
    jobType: { type: String, default: "Full-time" },
    salary: { type: String, default: "" },
    description: { type: String, default: "" },

    tags: { type: [String], default: [] }, // for filters
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);