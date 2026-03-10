import { useEffect, useMemo, useRef, useState } from "react";
import IGShell from "../components/IGShell";
import MotionPage from "../components/MotionPage";
import StoryBar from "../components/StoryBar";
import JobCard from "../components/JobCard";
import { api, user } from "../lib/api";
import { SparkHeader } from "../components/Illustrations";
import { mockJobsBLR } from "../data/mockJobs";

const TAGS = ["Internship", "Frontend", "Backend", "Design", "Remote", "MERN", "QA"];

export default function Feed() {
  const me = user();

  const [stories, setStories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [msg, setMsg] = useState("");

  const [loadingStories, setLoadingStories] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [q, setQ] = useState("");
  const [location, setLocation] = useState("Bengaluru");
  const [type, setType] = useState("");
  const [tag, setTag] = useState("");

  // Apply modal state (instead of prompt)
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyJob, setApplyJob] = useState(null);
  const [fullName, setFullName] = useState("");

  // Debounce timer
  const tRef = useRef(null);

  const tagOptions = useMemo(() => TAGS, []);

  async function loadStories() {
    try {
      setLoadingStories(true);
      const s = await api("/api/stories", { auth: false });
      setStories(Array.isArray(s) ? s : []);
    } catch {
      setStories([]);
    } finally {
      setLoadingStories(false);
    }
  }

  async function loadJobs(params = { q, location, type, tag }) {
    try {
      setLoadingJobs(true);
      setMsg("");

      const query = new URLSearchParams({
        q: params.q || "",
        location: params.location || "",
        type: params.type || "",
        tag: params.tag || "",
      }).toString();

      const j = await api(`/api/jobs?${query}`, { auth: false });
      setJobs(Array.isArray(j) ? j : []);
    } catch (e) {
      setJobs([]);
      setMsg(e.message || "Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  }

  // Initial load
  useEffect(() => {
    loadStories();
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth auto-search (debounced) when filters change
  useEffect(() => {
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = setTimeout(() => {
      loadJobs({ q, location, type, tag });
    }, 350);

    return () => {
      if (tRef.current) clearTimeout(tRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, location, type, tag]);

  // Premium fallback list (Bangalore) if API gives 0 jobs
  const displayJobs = useMemo(() => {
    const fromApi = Array.isArray(jobs) ? jobs : [];
    if (fromApi.length > 0) return fromApi;

    return mockJobsBLR.filter((j) => {
      const okQ = !q || j.title.toLowerCase().includes(q.toLowerCase());
      const okLoc = !location || j.location.toLowerCase().includes(location.toLowerCase());
      const okType = !type || j.jobType === type;
      const okTag = !tag || (j.tags || []).includes(tag);
      return okQ && okLoc && okType && okTag;
    });
  }, [jobs, q, location, type, tag]);

  function resetFilters() {
    setQ("");
    setType("");
    setTag("");
    setLocation("Bengaluru");
  }

  function openApply(job) {
    setApplyJob(job);
    setFullName(me?.name || "");
    setApplyOpen(true);
    setMsg("");
  }

  async function confirmApply() {
    try {
      if (!applyJob?._id) return;
      if (!fullName.trim()) return setMsg("Please enter full name");

      await api("/api/applications", {
        method: "POST",
        body: { jobId: applyJob._id, fullName, resumeUrl: me?.resumeUrl || "" },
      });

      setApplyOpen(false);
      setApplyJob(null);
      setMsg("Applied ✅ Open Tracker to see status");
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <IGShell>
      <MotionPage>
        <div className="space-y-5">
          <SparkHeader
            title="Bengaluru Jobs Feed"
            subtitle="Premium IG-style job feed • Stories • Apply in one tap"
          />

          {/* Stories */}
          <div
            className="border rounded-3xl p-3"
            style={{ background: "rgba(var(--card),0.75)", borderColor: "rgb(var(--border))" }}
          >
            {loadingStories ? (
              <div className="flex gap-3 overflow-auto">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-full border animate-pulse"
                    style={{ borderColor: "rgb(var(--border))" }}
                  />
                ))}
              </div>
            ) : (
              <StoryBar stories={stories} />
            )}
          </div>

          {/* Search Panel */}
          <div
            className="border rounded-3xl p-4 md:p-5 shadow-sm"
            style={{ background: "rgba(var(--card),0.85)", borderColor: "rgb(var(--border))" }}
          >
            <div className="grid md:grid-cols-4 gap-3">
              <input
                className="border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                placeholder="Search title…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />

              <input
                className="border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                placeholder="Location…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <select
                className="border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Any type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>

              <select
                className="border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="">Any tag</option>
                {tagOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => loadJobs({ q, location, type, tag })}
                className="px-5 py-2.5 rounded-2xl text-white font-extrabold hover:opacity-95 active:scale-[0.99] transition"
                style={{ background: "rgb(var(--brand))" }}
                disabled={loadingJobs}
              >
                {loadingJobs ? "Searching..." : "Search"}
              </button>

              <button
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-2xl font-bold border hover:opacity-90 transition"
                style={{ borderColor: "rgb(var(--border))" }}
                disabled={loadingJobs}
              >
                Reset
              </button>

              {msg && (
                <p className="text-sm ml-auto" style={{ color: "rgb(var(--muted))" }}>
                  {msg}
                </p>
              )}
            </div>

            <p className="text-xs mt-3" style={{ color: "rgb(var(--muted))" }}>
              If database has no jobs, we still show curated Bengaluru jobs (premium fallback list).
            </p>
          </div>

          {/* Feed */}
          {loadingJobs ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="border rounded-3xl p-5 animate-pulse"
                  style={{ borderColor: "rgb(var(--border))", background: "rgba(var(--card),0.75)" }}
                >
                  <div className="h-5 w-2/3 rounded" style={{ background: "rgb(var(--border))" }} />
                  <div className="mt-3 h-4 w-full rounded" style={{ background: "rgb(var(--border))" }} />
                  <div className="mt-2 h-4 w-5/6 rounded" style={{ background: "rgb(var(--border))" }} />
                </div>
              ))}
            </div>
          ) : displayJobs.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <div className="space-y-4">
              {displayJobs.map((j) => (
                <JobCard
                  key={j._id}
                  job={j}
                  canApply={me?.role === "student"}
                  onApply={() => openApply(j)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Apply Modal */}
        {applyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setApplyOpen(false)} />
            <div
              className="relative w-full max-w-lg border rounded-3xl p-5 shadow-xl"
              style={{ background: "rgba(var(--card),0.92)", borderColor: "rgb(var(--border))" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold" style={{ color: "rgb(var(--muted))" }}>
                    Applying to
                  </p>
                  <h3 className="text-xl font-black truncate">{applyJob?.title}</h3>
                  <p className="text-sm truncate" style={{ color: "rgb(var(--muted))" }}>
                    {applyJob?.company?.companyName || "Company"} • {applyJob?.location || "Bengaluru"}
                  </p>
                </div>
                <button
                  className="px-3 py-1.5 rounded-full border font-bold"
                  style={{ borderColor: "rgb(var(--border))" }}
                  onClick={() => setApplyOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="mt-4">
                <label className="text-sm font-extrabold">Full name</label>
                <input
                  className="mt-1 w-full border rounded-2xl p-3 bg-transparent"
                  style={{ borderColor: "rgb(var(--border))" }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <p className="text-xs mt-2" style={{ color: "rgb(var(--muted))" }}>
                  Resume will be attached automatically if you uploaded it in Profile.
                </p>
              </div>

              <div className="mt-5 flex gap-2 justify-end">
                <button
                  className="px-4 py-2.5 rounded-2xl font-bold border"
                  style={{ borderColor: "rgb(var(--border))" }}
                  onClick={() => setApplyOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2.5 rounded-2xl text-white font-extrabold"
                  style={{ background: "rgb(var(--brand))" }}
                  onClick={confirmApply}
                >
                  Confirm Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </MotionPage>
    </IGShell>
  );
}

function EmptyState({ onReset }) {
  return (
    <div
      className="border rounded-3xl p-10 text-center"
      style={{ borderColor: "rgb(var(--border))", background: "rgba(var(--card),0.75)" }}
    >
      <p className="text-2xl font-black">No jobs found</p>
      <p className="mt-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
        Try changing filters or reset to Bengaluru defaults.
      </p>
      <button
        onClick={onReset}
        className="mt-5 px-5 py-2.5 rounded-2xl text-white font-extrabold"
        style={{ background: "rgb(var(--brand))" }}
      >
        Reset filters
      </button>
    </div>
  );
}