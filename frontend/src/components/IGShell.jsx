import { Link, useNavigate, useLocation } from "react-router-dom";
import { user } from "../lib/api";
import { useState } from "react";
import ThemeMenu from "./ThemeMenu";
import ChatBot from "./ChatBot";
import { Home, User, Briefcase, ListChecks, Palette, LogOut } from "lucide-react";

function NavBtn({ to, icon: NavIcon, label }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold transition hover:opacity-100"
      style={{
        opacity: active ? 1 : 0.8,
        border: active ? "1px solid rgb(var(--border))" : "1px solid transparent",
      }}
      title={label}
    >
      <NavIcon size={18} />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}

export default function IGShell({ children }) {
  const nav = useNavigate();
  const me = user();
  const [showTheme, setShowTheme] = useState(false);

  return (
    <div className="min-h-screen">
      <div
        className="h-1 w-full"
        style={{
          background: "linear-gradient(90deg, rgb(var(--brand)), #ff3ea5, #ffd166)",
        }}
      />

      <header
        className="sticky top-0 z-10 backdrop-blur"
        style={{
          background: "rgba(var(--bg),0.85)",
          borderBottom: "1px solid rgb(var(--border))",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/feed" className="text-xl font-black tracking-tight">
            JobNest
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            <NavBtn to="/feed" icon={Home} label="Feed" />
            <NavBtn to="/profile" icon={User} label="Profile" />
            {me?.role === "student" && (
              <NavBtn to="/applications" icon={ListChecks} label="Tracker" />
            )}
            {me?.role === "recruiter" && (
              <NavBtn to="/recruiter" icon={Briefcase} label="Recruiter" />
            )}

            <button
              className="ml-1 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold border hover:opacity-90 transition"
              style={{ borderColor: "rgb(var(--border))" }}
              onClick={() => setShowTheme((v) => !v)}
              title="Theme"
            >
              <Palette size={18} />
              <span className="hidden md:inline">Theme</span>
            </button>

            <button
              className="ml-1 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold text-white hover:opacity-90 transition"
              style={{ background: "#ef4444" }}
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                nav("/auth");
              }}
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {showTheme && (
          <div className="max-w-5xl mx-auto px-4 pb-3">
            <ThemeMenu />
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div
          className="rounded-3xl p-4 md:p-6"
          style={{
            background: "rgba(var(--card),0.65)",
            border: "1px solid rgb(var(--border))",
          }}
        >
          {children}
        </div>
      </main>

      <ChatBot />
    </div>
  );
}