import { Link } from "react-router-dom";
import { Briefcase, User, ListChecks, PlusCircle } from "lucide-react";

function ActionCard({ to, icon: Icon, title, subtitle }) {
  return (
    <Link
      to={to}
      className="border rounded-3xl p-4 flex items-start gap-3 hover:opacity-90 transition"
      style={{
        background: "rgba(var(--card),0.9)",
        borderColor: "rgb(var(--border))",
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(var(--brand),0.12)" }}
      >
        <Icon size={22} />
      </div>

      <div>
        <h3 className="font-black text-base">{title}</h3>
        <p className="text-sm mt-1" style={{ color: "rgb(var(--muted))" }}>
          {subtitle}
        </p>
      </div>
    </Link>
  );
}

export default function QuickActions({ me }) {
  if (me?.role === "recruiter") {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <ActionCard
          to="/recruiter"
          icon={PlusCircle}
          title="Post a Job"
          subtitle="Create a new opening for candidates"
        />
        <ActionCard
          to="/profile"
          icon={User}
          title="Update Company Profile"
          subtitle="Add logo, bio, and company photos"
        />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <ActionCard
        to="/feed"
        icon={Briefcase}
        title="Explore Jobs"
        subtitle="Browse internships and full-time roles"
      />
      <ActionCard
        to="/applications"
        icon={ListChecks}
        title="Track Applications"
        subtitle="See your current application status"
      />
      <ActionCard
        to="/profile"
        icon={User}
        title="Complete Profile"
        subtitle="Add skills, bio, and resume"
      />
    </div>
  );
}