import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthBackdrop from "../components/AuthBackdrop";
import { useToast } from "../components/ToastProvider";
import { api } from "../lib/api";

export default function Forgot() {
  const nav = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = useMemo(() => {
    const p = newPassword || "";
    let score = 0;

    if (p.length >= 8) score += 1;
    if (/[A-Z]/.test(p)) score += 1;
    if (/[0-9]/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;

    if (!p) return { label: "", width: "0%", color: "rgb(var(--border))" };
    if (score <= 1) return { label: "Weak", width: "25%", color: "#ef4444" };
    if (score === 2) return { label: "Okay", width: "50%", color: "#f59e0b" };
    if (score === 3) return { label: "Good", width: "75%", color: "#2563eb" };
    return { label: "Strong", width: "100%", color: "#16a34a" };
  }, [newPassword]);

  async function sendOtp() {
    try {
      setMsg("");

      if (!email.trim()) {
        setMsg("Enter your email");
        return toast?.show("Enter your email", "error");
      }

      setBusy(true);

      const res = await api("/api/auth/forgot/request-otp", {
        method: "POST",
        auth: false,
        body: { email: email.trim() },
      });

      setStep(2);
      setMsg(`${res.message} ✅`);
      toast?.show("OTP sent successfully", "success");
    } catch (e) {
      setMsg(e.message || "Failed to send OTP");
      toast?.show(e.message || "Failed to send OTP", "error");
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    try {
      setMsg("");

      if (!otp.trim() || !newPassword.trim()) {
        setMsg("Enter OTP and new password");
        return toast?.show("Enter OTP and new password", "error");
      }

      if (newPassword.length < 6) {
        setMsg("New password must be at least 6 characters");
        return toast?.show("New password must be at least 6 characters", "error");
      }

      setBusy(true);

      await api("/api/auth/forgot/reset", {
        method: "POST",
        auth: false,
        body: {
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
        },
      });

      setMsg("Password updated ✅ Redirecting to login...");
      toast?.show("Password updated successfully", "success");

      setTimeout(() => nav("/auth"), 800);
    } catch (e) {
      setMsg(e.message || "Failed to reset password");
      toast?.show(e.message || "Failed to reset password", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <AuthBackdrop />

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 items-stretch">
        <div
          className="hidden md:flex flex-col justify-between rounded-3xl border p-8 overflow-hidden relative"
          style={{
            background: "rgba(var(--card),0.55)",
            borderColor: "rgb(var(--border))",
          }}
        >
          <div
            className="absolute -right-16 -top-16 w-72 h-72 rounded-full blur-3xl opacity-35"
            style={{ background: "rgb(var(--brand))" }}
          />
          <div
            className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full blur-3xl opacity-25"
            style={{ background: "#ff3ea5" }}
          />

          <div className="relative">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              ✦ JobNest
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight">
              Reset your password.
            </h1>

            <p
              className="mt-3 text-sm leading-6"
              style={{ color: "rgb(var(--muted))" }}
            >
              Secure your account with email OTP verification and create a new password in seconds.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <MiniStat title="Step 1" value="Enter email" />
              <MiniStat title="Step 2" value="Get OTP" />
              <MiniStat title="Step 3" value="Set password" />
              <MiniStat title="Access" value="Back to login" />
            </div>

            <div
              className="mt-6 rounded-3xl p-4 border"
              style={{
                background: "rgba(var(--card),0.55)",
                borderColor: "rgb(var(--border))",
              }}
            >
              <p className="text-sm font-black">Reset flow</p>
              <ul
                className="mt-3 space-y-2 text-sm"
                style={{ color: "rgb(var(--muted))" }}
              >
                <li>• Enter your registered email</li>
                <li>• Check your OTP</li>
                <li>• Create a fresh password</li>
              </ul>
            </div>
          </div>

          <p className="relative text-xs" style={{ color: "rgb(var(--muted))" }}>
            Tip: use a strong password with numbers and symbols ✨
          </p>
        </div>

        <div
          className="rounded-3xl border p-6 md:p-8 shadow-sm backdrop-blur"
          style={{
            background: "rgba(var(--card),0.86)",
            borderColor: "rgb(var(--border))",
          }}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Forgot Password
              </h1>
              <p className="mt-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
                {step === 1
                  ? "Enter your email to receive an OTP."
                  : "Enter the OTP and set a new password."}
              </p>
            </div>

            <Link
              to="/auth"
              className="px-3 py-1.5 rounded-full border text-sm font-bold hover:opacity-90 transition"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              Back to Login
            </Link>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <StepDot active={step === 1} done={step > 1} label="Email" />
            <div className="flex-1 h-[2px]" style={{ background: "rgb(var(--border))" }} />
            <StepDot active={step === 2} label="Reset" />
          </div>

          <div className="mt-6 space-y-3">
            <input
              className="w-full border rounded-2xl p-3 bg-transparent"
              style={{ borderColor: "rgb(var(--border))" }}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy || step === 2}
            />

            {step === 2 && (
              <>
                <input
                  className="w-full border rounded-2xl p-3 bg-transparent"
                  style={{ borderColor: "rgb(var(--border))" }}
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={busy}
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border rounded-2xl p-3 pr-16 bg-transparent"
                    style={{ borderColor: "rgb(var(--border))" }}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={busy}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold"
                    style={{ color: "rgb(var(--muted))" }}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {newPassword && (
                  <div>
                    <div
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ background: "rgb(var(--border))" }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: passwordStrength.width,
                          background: passwordStrength.color,
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: "rgb(var(--muted))" }}>
                      Password strength: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </>
            )}

            {step === 1 ? (
              <button
                onClick={sendOtp}
                disabled={busy}
                className="w-full py-3 rounded-2xl text-white font-extrabold disabled:opacity-60 active:scale-[0.99] transition"
                style={{ background: "rgb(var(--brand))" }}
              >
                {busy ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={resetPassword}
                  disabled={busy}
                  className="w-full py-3 rounded-2xl text-white font-extrabold disabled:opacity-60 active:scale-[0.99] transition"
                  style={{ background: "rgb(var(--brand))" }}
                >
                  {busy ? "Updating..." : "Reset Password"}
                </button>

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={busy}
                  className="w-full py-3 rounded-2xl font-bold border hover:opacity-90 transition disabled:opacity-60"
                  style={{ borderColor: "rgb(var(--border))" }}
                >
                  Resend OTP
                </button>
              </div>
            )}

            {msg && (
              <div
                className="border rounded-2xl px-4 py-3 text-sm"
                style={{
                  borderColor: "rgb(var(--border))",
                  background: "rgba(var(--card),0.7)",
                  color: "rgb(var(--muted))",
                }}
              >
                {msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepDot({ active, done, label }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full"
        style={{
          background: active || done ? "rgb(var(--brand))" : "rgb(var(--border))",
        }}
      />
      <span className="text-xs font-bold" style={{ color: "rgb(var(--muted))" }}>
        {label}
      </span>
    </div>
  );
}

function MiniStat({ title, value }) {
  return (
    <div
      className="rounded-2xl border p-3"
      style={{
        background: "rgba(var(--card),0.6)",
        borderColor: "rgb(var(--border))",
      }}
    >
      <p className="text-xs font-bold" style={{ color: "rgb(var(--muted))" }}>
        {title}
      </p>
      <p className="text-sm font-black">{value}</p>
    </div>
  );
}