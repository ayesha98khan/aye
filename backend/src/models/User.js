const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["student", "recruiter"], required: true },

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    // student
    resumeUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },

    // recruiter/company
    companyName: { type: String, default: "" },
    companyLogoUrl: { type: String, default: "" },
    companyBio: { type: String, default: "" },
    companyPhotos: { type: [String], default: [] }, // instagram feed style

    // forgot password OTP
    resetOtpHash: { type: String, default: "" },
    resetOtpExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);