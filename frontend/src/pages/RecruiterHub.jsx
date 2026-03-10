import { SparkHeader } from "../components/Illustrations";
import { useEffect, useState } from "react";
import IGShell from "../components/IGShell";
import MotionPage from "../components/MotionPage";
import StatsOverview from "../components/StatsOverview";
import QuickActions from "../components/QuickActions";
import AppFooter from "../components/AppFooter";
import { useToast } from "../components/ToastProvider";
import { api, uploadFile, user } from "../lib/api";

export default function RecruiterHub() {
  const me = user();
  const toast = useToast();

  const [msg, setMsg] = useState("");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [busyJob, setBusyJob] = useState(false);
  const [busyStory, setBusyStory] = useState(false);

  const [job, setJob] = useState({
    title: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    description: "",
    tags: [],
  });

  const [storyFile, setStoryFile] = useState(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDashboardData() {
    try {
      setLoadingStats(true);

      const [jobsData, appsData] = await Promise.all([
        api("/api/jobs"),
        api("/api/applications/company"),
      ]);

      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setApplications(Array.isArray(appsData) ? appsData : []);
    } catch (e) {
      setJobs([]);
      setApplications([]);
      toast?.show(e.message || "Failed to load dashboard data", "error");
    } finally {
      setLoadingStats(false);
    }
  }

  async function createJob() {
    try {
      if (me?.role !== "recruiter") {
        setMsg("Recruiters only.");
        return toast?.show("Recruiters only", "error");
      }

      if (!job.title.trim()) {
        setMsg("Please enter job title.");
        return toast?.show("Please enter job title", "error");
      }

      if (!job.location.trim()) {
        setMsg("Please enter location.");
        return toast?.show("Please enter location", "error");
      }

      if (!job.description.trim()) {
        setMsg("Please enter description.");
        return toast?.show("Please enter description", "error");
      }

      setBusyJob(true);
      setMsg("");

      await api("/api/jobs", { method: "POST", body: job });

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

      loadDashboardData();
    } catch (e) {
      setMsg(e.message);
      toast?.show(e.message || "Failed to post job", "error");
    } finally {
      setBusyJob(false);
    }
  }

  async function postStory() {
    try {
      if (me?.role !== "recruiter") {
        setMsg("Recruiters only.");
        return toast?.show("Recruiters only", "error");
      }

      if (!storyFile) {
        setMsg("Pick an image for story.");
        return toast?.show("Pick an image for story", "error");
      }

      setBusyStory(true);
      setMsg("Uploading story...");

      const mediaUrl = await uploadFile("/api/upload/image", storyFile);

      await api("/api/stories", {
        method: "POST",
        body: { mediaUrl, caption },
      });

      setMsg("Story posted ✅");
      toast?.show("Story posted successfully", "success");

      setStoryFile(null);
      setCaption("");
    } catch (e) {
      setMsg(e.message);
      toast?.show(e.message || "Failed to post story", "error");
    } finally {
      setBusyStory(false);
    }
  }

  return (
    <IGShell>
      <MotionPage>
        <div className="space-y-5">
          <SparkHeader
            title="Recruiter Hub"
            subtitle="Post jobs, upload story updates, and manage your hiring brand"
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

          <div className="grid md:grid-cols-2 gap-4">
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
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Remote</option>
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
                  onClick={createJob}
                  disabled={busyJob}
                  className="w-full py-3 rounded-2xl text-white font-extrabold hover:opacity-95 transition disabled:opacity-60"
                  style={{ background: "rgb(var(--brand))" }}
                >
                  {busyJob ? "Posting..." : "Post Job"}
                </button>
              </div>
            </div>

            <div
              className="border rounded-3xl p-5 shadow-sm"
              style={{
                background: "rgb(var(--card))",
                borderColor: "rgb(var(--border))",
              }}
            >
              <h2 className="text-xl font-black">Post Story (24h)</h2>

              <div className="mt-4 space-y-3">
                <input
                  className="w-full border rounded-2xl p-2 bg-transparent"
                  style={{ borderColor: "rgb(var(--border))" }}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setStoryFile(e.target.files?.[0] || null)}
                />

                <input
                  className="w-full border rounded-2xl p-3 bg-transparent"
                  style={{ borderColor: "rgb(var(--border))" }}
                  placeholder="Caption (optional)"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />

                <button
                  onClick={postStory}
                  disabled={busyStory}
                  className="w-full py-3 rounded-2xl text-white font-extrabold hover:opacity-95 transition disabled:opacity-60"
                  style={{ background: "#2563eb" }}
                >
                  {busyStory ? "Posting..." : "Post Story"}
                </button>
              </div>
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