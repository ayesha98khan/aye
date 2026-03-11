import { SparkHeader } from "../components/Illustrations";
import { useEffect, useState } from "react";
import IGShell from "../components/IGShell";
import MotionPage from "../components/MotionPage";
import StatsOverview from "../components/StatsOverview";
import QuickActions from "../components/QuickActions";
import AppFooter from "../components/AppFooter";
import { useToast } from "../components/ToastProvider";
import { api, user } from "../lib/api";

export default function RecruiterHub() {
  const me = user();
  const toast = useToast();

  const [msg, setMsg] = useState("");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [busyJob, setBusyJob] = useState(false);

  const [job, setJob] = useState({
    title: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    description: "",
    tags: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoadingStats(true);
      setMsg("");

      const [jobsData, appsData] = await Promise.all([
        api("/api/jobs"),
        api("/api/applications/company"),
      ]);

      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setApplications(Array.isArray(appsData) ? appsData : []);
    } catch (e) {
      setJobs([]);
      setApplications([]);
      const text = e?.message || "Failed to load dashboard data";
      setMsg(text);
      toast?.show(text, "error");
    } finally {
      setLoadingStats(false);
    }
  }

  async function createJob() {
    try {
      if (!me) {
        const text = "Please login again.";
        setMsg(text);
        toast?.show(text, "error");
        return;
      }

      if (me.role !== "recruiter") {
        const text = "Recruiters only.";
        setMsg(text);
        toast?.show(text, "error");
        return;
      }

      if (!job.title.trim()) {
        const text = "Please enter job title.";
        setMsg(text);
        toast?.show(text, "error");
        return;
      }

      if (!job.location.trim()) {
        const text = "Please enter location.";
        setMsg(text);
        toast?.show(text, "error");
        return;
      }

      if (!job.description.trim()) {
        const text = "Please enter description.";
        setMsg(text);
        toast?.show(text, "error");
        return;
      }

      setBusyJob(true);
      setMsg("Posting job...");

      await api("/api/jobs", {
        method: "POST",
        body: {
          title: job.title.trim(),
          location: job.location.trim(),
          jobType: job.jobType || "Full-time",
          salary: job.salary.trim(),
          description: job.description.trim(),
          tags: Array.isArray(job.tags) ? job.tags : [],
        },
        auth: true,
      });

      setMsg("Job posted ✅");
      toast?.show("Job posted successfully", "success");

      setJob({
        title: "",
        location: "",
        jobType: "Full-time",
        salary: "",
        description: "",
        tags: [],
      });

      await loadDashboardData();
    } catch (e) {
      const text = e?.message || "Failed to post job";
      console.error("POST JOB ERROR:", e);
      setMsg(text);
      toast?.show(text, "error");
    } finally {
      setBusyJob(false);
    }
  }

  return (
    <IGShell>
      <MotionPage>
        <div className="space-y-5">
          <SparkHeader
            title="Recruiter Hub"
            subtitle="Post jobs and manage your hiring dashboard"
          />

          <QuickActions me={me} />

          {loadingStats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl p-5 border animate-pulse"
                  style={{
                    background: "rgba(var(--card),0.9)",
                    borderColor: "rgb(var(--border))",
                  }}
                >
                  <div
                    className="h-4 w-24 rounded"
                    style={{ background: "rgb(var(--border))" }}
                  />
                  <div
                    className="h-8 w-16 rounded mt-3"
                    style={{ background: "rgb(var(--border))" }}
                  />
                  <div
                    className="h-3 w-32 rounded mt-3"
                    style={{ background: "rgb(var(--border))" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <StatsOverview me={me} jobs={jobs} applications={applications} />
          )}

          <div
            className="border rounded-3xl p-5 shadow-sm"
            style={{
              background: "rgb(var(--card))",
              borderColor: "rgb(var(--border))",
            }}
          >
            <h2 className="text-xl font-black">Upload Job</h2>

            <div className="mt-4 space-y-3">
              <input
                className="w-full border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                placeholder="Job Title"
                value={job.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
              />

              <input
                className="w-full border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                placeholder="Location"
                value={job.location}
                onChange={(e) => setJob({ ...job, location: e.target.value })}
              />

              <select
                className="w-full border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                value={job.jobType}
                onChange={(e) => setJob({ ...job, jobType: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>

              <input
                className="w-full border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                placeholder="Salary (optional)"
                value={job.salary}
                onChange={(e) => setJob({ ...job, salary: e.target.value })}
              />

              <textarea
                className="w-full border rounded-2xl p-3 bg-transparent min-h-[120px]"
                style={{ borderColor: "rgb(var(--border))" }}
                placeholder="Description"
                value={job.description}
                onChange={(e) => setJob({ ...job, description: e.target.value })}
              />

              <input
                className="w-full border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                placeholder="Tags (comma separated)"
                value={(job.tags || []).join(", ")}
                onChange={(e) =>
                  setJob({
                    ...job,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />

              <button
                type="button"
                onClick={createJob}
                disabled={busyJob}
                className="w-full py-3 rounded-2xl text-white font-extrabold hover:opacity-95 transition disabled:opacity-60"
                style={{ background: "rgb(var(--brand))" }}
              >
                {busyJob ? "Posting..." : "Post Job"}
              </button>
            </div>
          </div>

          {msg && (
            <div
              className="border rounded-2xl px-4 py-3 text-sm font-medium"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgba(var(--card),0.75)",
                color: "rgb(var(--muted))",
              }}
            >
              {msg}
            </div>
          )}

          <AppFooter />
        </div>
      </MotionPage>
    </IGShell>
  );
}