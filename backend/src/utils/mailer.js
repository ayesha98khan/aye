const nodemailer = require("nodemailer");

function makeTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function sendOtp(to, otp) {
  const t = makeTransport();
  if (!t) {
    console.log("⚠️ SMTP not set. OTP (dev):", otp);
    return { delivered: false, fallback: "terminal" };
  }

  try {
    await t.verify();
    await t.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "JobNest password reset OTP",
      text: `Your OTP is ${otp}. It expires soon. Do not share.`,
    });
    return { delivered: true, fallback: null };
  } catch (error) {
    console.error("⚠️ SMTP send failed, using terminal OTP fallback:", error.message);
    console.log("🔐 OTP (dev fallback):", otp);
    return { delivered: false, fallback: "terminal" };
  }
}

module.exports = { sendOtp };
