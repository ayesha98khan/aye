import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthBackdrop from "../components/AuthBackdrop";
import { api } from "../lib/api";

export default function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState("login"); // login | register
  const isLogin = mode === "login";

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "student",
    companyName: "",
    password: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    if (!form.email || !form.password) return setMsg("Email and password are required.");
    if (!isLogin) {
      if (!form.name) return setMsg("Name is required.");
      if (form.password !== form.confirmPassword) return setMsg("Passwords do not match.");
      if (form.role === "recruiter" && !form.companyName) return setMsg("Company name is required.");
    }

    try {
      setBusy(true);

      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin
        ? { email: form.email, password: form.password }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
            companyName: form.role === "recruiter" ? form.companyName : "",
          };

      const res = await api(endpoint, { method: "POST", body });

      // assumes backend returns { token, user }
      if (res?.token) localStorage.setItem("token", res.token);
      if (res?.user) localStorage.setItem("user", JSON.stringify(res.user));

      nav("/feed");
    } catch (e2) {
      setMsg(e2.message);
    } finally {
      setBusy(false);
    }
  }

  function socialNotReady(provider) {
    setMsg(`${provider} login UI added ✅ (real login needs OAuth setup in backend)`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AuthBackdrop />

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 items-stretch">
        {/* Left: brand panel */}
        <div
          className="hidden md:flex flex-col justify-between rounded-3xl border p-8 overflow-hidden relative"
          style={{ background: "rgba(var(--card),0.55)", borderColor: "rgb(var(--border))" }}
        >
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full blur-3xl opacity-35"
            style={{ background: "rgb(var(--brand))" }}
          />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full blur-3xl opacity-25"
            style={{ background: "#ff3ea5" }}
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              ✦ JobNest
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight">
              {isLogin ? "Welcome back." : "Create your account."}
            </h1>
            <p className="mt-3 text-sm leading-6" style={{ color: "rgb(var(--muted))" }}>
              Instagram-style job feed • Recruiter stories • Apply in one tap • Track applications
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <MiniStat title="Jobs" value="Fast apply" />
              <MiniStat title="Stories" value="24h updates" />
              <MiniStat title="Profile" value="Resume + grid" />
              <MiniStat title="Tracker" value="Status view" />
            </div>
          </div>

          <p className="relative text-xs" style={{ color: "rgb(var(--muted))" }}>
            Tip: Use theme switch to make it look even more premium ✨
          </p>
        </div>

        {/* Right: auth card */}
        <div
          className="rounded-3xl border p-6 md:p-8 shadow-sm backdrop-blur"
          style={{ background: "rgba(var(--card),0.82)", borderColor: "rgb(var(--border))" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">{isLogin ? "Login" : "Register"}</h2>

            <button
              type="button"
              className="px-3 py-1.5 rounded-full font-bold border text-sm"
              style={{ borderColor: "rgb(var(--border))" }}
              onClick={() => setMode(isLogin ? "register" : "login")}
            >
              {isLogin ? "New? Register" : "Have account? Login"}
            </button>
          </div>

          {/* Social buttons */}
          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={() => socialNotReady("Google")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-extrabold border hover:opacity-95 transition"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              <span className="text-lg">G</span> Continue with Google
            </button>

            <button
              type="button"
              onClick={() => socialNotReady("Facebook")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-extrabold text-white hover:opacity-95 transition"
              style={{ background: "#1877F2" }}
            >
              <span className="text-lg">f</span> Continue with Facebook
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgb(var(--border))" }} />
              <span className="text-xs font-bold" style={{ color: "rgb(var(--muted))" }}>
                OR
              </span>
              <div className="flex-1 h-px" style={{ background: "rgb(var(--border))" }} />
            </div>
          </div>

          <form onSubmit={submit} className="mt-4 space-y-3">
            {!isLogin && (
              <input
                className="w-full border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                placeholder="Full name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            )}

            <input
              className="w-full border rounded-2xl p-3 bg-transparent"
              style={{ borderColor: "rgb(var(--border))" }}
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />

            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="w-full border rounded-2xl p-3 bg-transparent"
                  style={{ borderColor: "rgb(var(--border))" }}
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="recruiter">Recruiter</option>
                </select>

                <input
                  className="w-full border rounded-2xl p-3 bg-transparent"
                  style={{ borderColor: "rgb(var(--border))" }}
                  placeholder="Company (recruiter only)"
                  value={form.companyName}
                  onChange={(e) => set("companyName", e.target.value)}
                  disabled={form.role !== "recruiter"}
                />
              </div>
            )}

            <input
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              className="w-full border rounded-2xl p-3 bg-transparent"
              style={{ borderColor: "rgb(var(--border))" }}
              placeholder="Password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />

            {!isLogin && (
              <input
                type="password"
                autoComplete="new-password"
                className="w-full border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
              />
            )}

            {isLogin && (
              <div className="flex justify-end">
                <Link to="/forgot" className="text-sm font-bold hover:underline" style={{ color: "rgb(var(--brand))" }}>
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              disabled={busy}
              className="w-full py-3 rounded-2xl text-white font-extrabold disabled:opacity-60 active:scale-[0.99] transition"
              style={{ background: "rgb(var(--brand))" }}
            >
              {busy ? "Please wait..." : isLogin ? "Login" : "Create account"}
            </button>

            {msg && <p className="text-sm mt-2" style={{ color: "rgb(var(--muted))" }}>{msg}</p>}
          </form>

          <p className="mt-6 text-xs" style={{ color: "rgb(var(--muted))" }}>
            Social login buttons are UI right now. If you want them to really work, we’ll add OAuth in backend.
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ title, value }) {
  return (
    <div
      className="rounded-2xl border p-3"
      style={{ background: "rgba(var(--card),0.6)", borderColor: "rgb(var(--border))" }}
    >
      <p className="text-xs font-bold" style={{ color: "rgb(var(--muted))" }}>{title}</p>
      <p className="text-sm font-black">{value}</p>
    </div>
  );
}