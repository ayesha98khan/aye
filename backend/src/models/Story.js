const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    expiresAt: { type: Date, required: true }, // 24 hrs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);