const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendOtp } = require("../utils/mailer");

function signToken(user) {
  if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");
  return jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function safeUser(u) {
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

router.post("/register", async (req, res, next) => {
  try {
    const { role, name, email, password, companyName } = req.body || {};
    if (!role || !name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: "Email already used" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      role: role === "recruiter" ? "recruiter" : "student",
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      companyName: role === "recruiter" ? (companyName || "").trim() : "",
    });

    const token = signToken(user);
    res.status(201).json({ token, user: safeUser(user) });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({ token, user: safeUser(user) });
  } catch (e) {
    next(e);
  }
});

async function requestOtpHandler(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = await bcrypt.hash(otp, 10);
    const expMin = Number(process.env.OTP_EXP_MINUTES || 10);

    user.resetOtpHash = otpHash;
    user.resetOtpExpiresAt = new Date(Date.now() + expMin * 60 * 1000);
    await user.save();

    const mail = await sendOtp(user.email, otp);
    res.json({
      message: mail?.delivered ? "OTP sent to your email" : "OTP generated. Check backend terminal if email was not delivered.",
      delivered: Boolean(mail?.delivered),
    });
  } catch (e) {
    next(e);
  }
}

async function resetPasswordHandler(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body || {};
    if (!email || !otp || !newPassword) return res.status(400).json({ message: "Missing fields" });
    if (String(newPassword).length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.resetOtpHash || !user.resetOtpExpiresAt) return res.status(400).json({ message: "Request OTP first" });
    if (user.resetOtpExpiresAt.getTime() < Date.now()) return res.status(400).json({ message: "OTP expired" });

    const ok = await bcrypt.compare(String(otp), user.resetOtpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetOtpHash = "";
    user.resetOtpExpiresAt = null;
    await user.save();

    res.json({ message: "Password updated. Please login." });
  } catch (e) {
    next(e);
  }
}

router.post("/forgot/request-otp", requestOtpHandler);
router.post("/forgot-password", requestOtpHandler);
router.post("/forgot/reset", resetPasswordHandler);
router.post("/reset-password", resetPasswordHandler);

module.exports = router;
