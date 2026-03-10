import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthBackdrop from "../components/AuthBackdrop";
import { api } from "../lib/api";

export default function Forgot() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function sendOtp() {
    try {
      setMsg("");
      if (!email.trim()) return setMsg("Enter your email");
      setBusy(true);
      const res = await api("/api/auth/forgot/request-otp", {
        method: "POST",
        auth: false,
        body: { email: email.trim() },
      });
      setStep(2);
      setMsg(`${res.message} ✅`);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    try {
      setMsg("");
      if (!otp.trim() || !newPassword.trim()) return setMsg("Enter OTP and new password");
      setBusy(true);
      await api("/api/auth/forgot/reset", {
        method: "POST",
        auth: false,
        body: { email: email.trim(), otp: otp.trim(), newPassword },
      });
      setMsg("Password updated ✅ Redirecting to login...");
      setTimeout(() => nav("/auth"), 800);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AuthBackdrop />

      <div
        className="w-full max-w-xl rounded-3xl border p-6 md:p-8 shadow-sm backdrop-blur"
        style={{ background: "rgba(var(--card),0.86)", borderColor: "rgb(var(--border))" }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Forgot Password</h1>
          <Link
            to="/auth"
            className="px-3 py-1.5 rounded-full border text-sm font-bold hover:opacity-90"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            Back to Login
          </Link>
        </div>

        <p className="mt-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
          {step === 1 ? "Enter your email to receive an OTP." : "Enter the OTP and set a new password."}
        </p>

        <div className="mt-5 flex items-center gap-2">
          <Dot active={step === 1} label="Email" />
          <div className="flex-1 h-[2px]" style={{ background: "rgb(var(--border))" }} />
          <Dot active={step === 2} label="Reset" />
        </div>

        <div className="mt-6 space-y-3">
          <input
            className="w-full border rounded-2xl p-3 bg-transparent"
            style={{ borderColor: "rgb(var(--border))" }}
            placeholder="Email"
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
              <input
                type="password"
                className="w-full border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={busy}
              />
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
            <button
              onClick={resetPassword}
              disabled={busy}
              className="w-full py-3 rounded-2xl text-white font-extrabold disabled:opacity-60 active:scale-[0.99] transition"
              style={{ background: "rgb(var(--brand))" }}
            >
              {busy ? "Updating..." : "Reset Password"}
            </button>
          )}

          {msg && <p className="text-sm mt-2" style={{ color: "rgb(var(--muted))" }}>{msg}</p>}
        </div>
      </div>
    </div>
  );
}

function Dot({ active, label }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full"
        style={{ background: active ? "rgb(var(--brand))" : "rgb(var(--border))" }}
      />
      <span className="text-xs font-bold" style={{ color: "rgb(var(--muted))" }}>
        {label}
      </span>
    </div>
  );
}
