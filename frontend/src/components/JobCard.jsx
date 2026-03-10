import { Link } from "react-router-dom";
import { useState } from "react";

export default function JobCard({ job, onApply, canApply }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const createdAt = job.createdAt ? new Date(job.createdAt) : null;
  const elapsedMs = createdAt ? Math.max(0, new Date(createdAt).getTime() ? Date.now() - createdAt.getTime() : 0) : 0;
  const elapsedHours = Math.max(1, Math.floor(elapsedMs / (1000 * 60 * 60)));
  const timeLabel = createdAt ? (elapsedHours < 24 ? `${elapsedHours}h` : `${Math.floor(elapsedHours / 24)}d`) : "New";

  const companyId = job.company?.id || job.company?._id || job.recruiter;

  return (
    <div
      className="border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition"
      style={{ background: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}
    >
      <div className="p-4 flex items-center justify-between">
        <Link
          to={companyId ? `/company/${companyId}` : "#"}
          className="flex items-center gap-3 min-w-0 hover:opacity-90 transition"
          title="Open company"
        >
          <img
            className="w-10 h-10 rounded-full object-cover border"
            style={{ borderColor: "rgb(var(--border))" }}
            src={job.company?.companyLogoUrl || "https://placehold.co/80x80"}
            alt=""
          />
          <div className="min-w-0">
            <p className="font-black truncate">{job.company?.companyName || "Company"}</p>
            <p className="text-xs truncate" style={{ color: "rgb(var(--muted))" }}>
              {job.location || "—"} • {job.jobType || "—"} • {timeLabel}
            </p>
          </div>
        </Link>

        <button className="text-xl px-2" title="More">⋯</button>
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-xl font-black">{job.title}</h3>

        <p className="text-sm mt-2 line-clamp-3" style={{ color: "rgb(var(--text))" }}>
          {job.description || "No description provided."}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {(job.tags || []).slice(0, 6).map((t) => (
            <span
              key={t}
              className="text-xs font-bold px-2.5 py-1 rounded-full border"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiked((v) => !v)}
              className="text-2xl hover:scale-105 transition"
              title="Like"
              style={{ color: liked ? "rgb(var(--brand))" : "rgb(var(--text))" }}
            >
              ♥
            </button>
            <button className="text-2xl hover:scale-105 transition" title="Comment">💬</button>
            <button className="text-2xl hover:scale-105 transition" title="Share">↗</button>
          </div>

          <button
            onClick={() => setSaved((v) => !v)}
            className="text-2xl hover:scale-105 transition"
            title="Save"
            style={{ color: saved ? "rgb(var(--brand))" : "rgb(var(--text))" }}
          >
            ⌁
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {canApply ? (
            <button
              onClick={() => onApply(job)}
              className="px-5 py-2.5 rounded-2xl text-white font-extrabold active:scale-[0.99] transition"
              style={{ background: "rgb(var(--brand))" }}
            >
              Apply Now
            </button>
          ) : (
            <span className="text-sm font-semibold" style={{ color: "rgb(var(--muted))" }}>
              Recruiters can’t apply
            </span>
          )}

          <div className="ml-auto text-sm font-semibold" style={{ color: "rgb(var(--muted))" }}>
            {job.salary ? `💰 ${job.salary}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
