import { Briefcase, FileText, UserCheck, TrendingUp } from "lucide-react";

function StatCard({ icon: Icon, title, value, sub }) {
  return (
    <div
      className="rounded-3xl p-4 md:p-5 border shadow-sm"
      style={{
        background: "rgba(var(--card),0.9)",
        borderColor: "rgb(var(--border))",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "rgb(var(--muted))" }}
          >
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl font-black mt-1">{value}</h3>
          {sub ? (
            <p
              className="text-xs mt-2"
              style={{ color: "rgb(var(--muted))" }}
            >
              {sub}
            </p>
          ) : null}
        </div>

        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(var(--brand),0.12)" }}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function StatsOverview({ me, jobs = [], applications = [] }) {
  const isRecruiter = me?.role === "recruiter";

  const totalJobs = jobs.length;
  const totalApplications = applications.length;
  const shortlisted = applications.filter(
    (a) => a.status?.toLowerCase() === "shortlisted"
  ).length;
  const hired = applications.filter(
    (a) => a.status?.toLowerCase() === "hired"
  ).length;

  const recruiterCards = [
    {
      icon: Briefcase,
      title: "Active Jobs",
      value: totalJobs,
      sub: "Open roles posted by your company",
    },
    {
      icon: FileText,
      title: "Applications",
      value: totalApplications,
      sub: "Candidates who applied",
    },
    {
      icon: UserCheck,
      title: "Shortlisted",
      value: shortlisted,
      sub: "Candidates moved forward",
    },
    {
      icon: TrendingUp,
      title: "Hired",
      value: hired,
      sub: "Successful placements",
    },
  ];

  const studentCards = [
    {
      icon: Briefcase,
      title: "Jobs Available",
      value: totalJobs,
      sub: "Roles you can explore now",
    },
    {
      icon: FileText,
      title: "My Applications",
      value: totalApplications,
      sub: "Jobs you already applied to",
    },
    {
      icon: UserCheck,
      title: "Shortlisted",
      value: shortlisted,
      sub: "Applications in next stage",
    },
    {
      icon: TrendingUp,
      title: "Profile Strength",
      value: `${Math.min(
        100,
        (me?.name ? 20 : 0) +
          (me?.email ? 20 : 0) +
          ((me?.skills || []).length ? 20 : 0) +
          (me?.bio ? 20 : 0) +
          (me?.resumeUrl ? 20 : 0)
      )}%`,
      sub: "Complete profile to improve chances",
    },
  ];

  const cards = isRecruiter ? recruiterCards : studentCards;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </section>
  );
}