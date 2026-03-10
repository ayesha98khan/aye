import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  MapPin,
  Briefcase,
  Clock3,
  Heart,
  Bookmark,
  Share2,
  Building2,
  IndianRupee,
} from "lucide-react";

function formatTimeLabel(createdAt) {
  if (!createdAt) return "New";
  const created = new Date(createdAt).getTime();
  if (!created) return "New";

  const diff = Math.max(0, Date.now() - created);
  const hours = Math.max(1, Math.floor(diff / (1000 * 60 * 60)));

  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function JobCard({ job, onApply, canApply }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const companyId = job.company?.id || job.company?._id || job.recruiter;
  const companyName = job.company?.companyName || "Company";
  const logo = job.company?.companyLogoUrl || "https://placehold.co/80x80";
  const title = job.title || "Untitled Job";
  const description = job.description || "No description provided.";
  const location = job.location || "Location not specified";
  const jobType = job.jobType || "Not specified";
  const salary = job.salary || "";
  const timeLabel = useMemo(() => formatTimeLabel(job.createdAt), [job.createdAt]);

  return (
    <div
      className="border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition"
      style={{
        background: "rgb(var(--card))",
        borderColor: "rgb(var(--border))",
      }}
    >
      <div className="p-4 md:p-5 flex items-start justify-between gap-3">
        <Link
          to={companyId ? `/company/${companyId}` : "#"}
          className="flex items-center gap-3 min-w-0 hover:opacity-90 transition"
          title="Open company"
        >
          <img
            className="w-12 h-12 rounded-full object-cover border"
            style={{ borderColor: "rgb(var(--border))" }}
            src={logo}
            alt={companyName}
          />

          <div className="min-w-0">
            <p className="font-black truncate">{companyName}</p>

            <div
              className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
              style={{ color: "rgb(var(--muted))" }}
            >
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} />
                {location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Briefcase size={13} />
                {jobType}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 size={13} />
                {timeLabel}
              </span>
            </div>
          </div>
        </Link>

        <button
          className="px-2 py-1 rounded-full text-lg font-bold hover:opacity-80 transition"
          title="More"
        >
          ⋯
        </button>
      </div>

      <div className="px-4 md:px-5 pb-5">
        <h3 className="text-xl md:text-2xl font-black leading-tight">{title}</h3>

        <p
          className="text-sm mt-3 line-clamp-3 leading-6"
          style={{ color: "rgb(var(--text))" }}
        >
          {description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(job.tags || []).slice(0, 6).map((t) => (
            <span
              key={t}
              className="text-xs font-bold px-2.5 py-1 rounded-full border"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgba(var(--bg),0.55)",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-3"
            style={{ background: "rgba(var(--bg),0.55)" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "rgb(var(--muted))" }}
            >
              Company
            </p>
            <p className="text-sm font-semibold mt-1 inline-flex items-center gap-2">
              <Building2 size={15} />
              {companyName}
            </p>
          </div>

          <div
            className="rounded-2xl p-3"
            style={{ background: "rgba(var(--bg),0.55)" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "rgb(var(--muted))" }}
            >
              Salary
            </p>
            <p className="text-sm font-semibold mt-1 inline-flex items-center gap-2">
              <IndianRupee size={15} />
              {salary || "Not disclosed"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setLiked((v) => !v)}
              className="p-2 rounded-full hover:scale-105 transition"
              title="Like"
              style={{
                color: liked ? "#ef4444" : "rgb(var(--text))",
                background: liked ? "rgba(239,68,68,0.10)" : "transparent",
              }}
            >
              <Heart size={20} fill={liked ? "#ef4444" : "none"} />
            </button>

            <button
              className="p-2 rounded-full hover:scale-105 transition"
              title="Share"
            >
              <Share2 size={20} />
            </button>
          </div>

          <button
            onClick={() => setSaved((v) => !v)}
            className="p-2 rounded-full hover:scale-105 transition"
            title="Save"
            style={{
              color: saved ? "rgb(var(--brand))" : "rgb(var(--text))",
              background: saved ? "rgba(var(--brand),0.10)" : "transparent",
            }}
          >
            <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 flex-wrap">
          {canApply ? (
            <button
              onClick={() => onApply(job)}
              className="px-5 py-2.5 rounded-2xl text-white font-extrabold active:scale-[0.99] hover:opacity-95 transition"
              style={{ background: "rgb(var(--brand))" }}
            >
              Apply Now
            </button>
          ) : (
            <span
              className="text-sm font-semibold"
              style={{ color: "rgb(var(--muted))" }}
            >
              Recruiters can’t apply
            </span>
          )}

          <span
            className="text-sm font-semibold ml-auto"
            style={{ color: "rgb(var(--muted))" }}
          >
            {timeLabel}
          </span>
        </div>
      </div>
    </div>
  );
}