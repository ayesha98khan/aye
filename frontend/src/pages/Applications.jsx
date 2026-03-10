import { SparkHeader } from "../components/Illustrations";
import { useEffect, useMemo, useState } from "react";
import IGShell from "../components/IGShell";
import MotionPage from "../components/MotionPage";
import StatsOverview from "../components/StatsOverview";
import QuickActions from "../components/QuickActions";
import AppFooter from "../components/AppFooter";
import PageLoader from "../components/PageLoader";
import EmptyPanel from "../components/EmptyPanel";
import { api, user } from "../lib/api";

function getStatusStyles(status = "") {
  const s = status.toLowerCase();

  if (s === "shortlisted") {
    return {
      bg: "rgba(37, 99, 235, 0.12)",
      color: "#2563eb",
      label: "Shortlisted",
    };
  }

  if (s === "hired") {
    return {
      bg: "rgba(22, 163, 74, 0.12)",
      color: "#16a34a",
      label: "Hired",
    };
  }

  if (s === "rejected") {
    return {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#ef4444",
      label: "Rejected",
    };
  }

  return {
    bg: "rgba(245, 158, 11, 0.12)",
    color: "#d97706",
    label: status || "Applied",
  };
}

export default function Applications() {
  const me = user();
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setMsg("");

        if (me?.role !== "student") {
          setMsg("Only students have tracker.");
          setList([]);
          return;
        }

        const data = await api("/api/applications/mine");
        setList(Array.isArray(data) ? data : []);
      } catch (e) {
        setMsg(e.message || "Failed to load applications");
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [me]);

  const sortedList = useMemo(() => {
    return [...list].sort((a, b) => {
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return bDate - aDate;
    });
  }, [list]);

  return (
    <IGShell>
      <MotionPage>
        <div className="space-y-5">
          <SparkHeader
            title="Application Tracker"
            subtitle="Track every application, check status updates, and stay organized"
          />

          <QuickActions me={me} />

          <StatsOverview me={me} jobs={[]} applications={list} />

          <div
            className="border rounded-3xl p-5 shadow-sm"
            style={{
              background: "rgb(var(--card))",
              borderColor: "rgb(var(--border))",
            }}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-2xl font-black">My Applications</h2>
                <p className="text-sm mt-1" style={{ color: "rgb(var(--muted))" }}>
                  See where you applied and what happened next.
                </p>
              </div>

              <div
                className="px-4 py-2 rounded-2xl text-sm font-bold"
                style={{
                  background: "rgba(var(--brand),0.12)",
                  color: "rgb(var(--text))",
                }}
              >
                Total: {list.length}
              </div>
            </div>

            {msg && (
              <div
                className="mt-4 border rounded-2xl px-4 py-3 text-sm"
                style={{
                  borderColor: "rgb(var(--border))",
                  background: "rgba(var(--card),0.7)",
                  color: "rgb(var(--muted))",
                }}
              >
                {msg}
              </div>
            )}

            <div className="mt-5">
              {loading ? (
                <PageLoader lines={4} />
              ) : sortedList.length === 0 && !msg ? (
                <EmptyPanel
                  title="No applications yet"
                  subtitle="Start applying from the jobs feed and your tracker will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {sortedList.map((a) => {
                    const statusUI = getStatusStyles(a.status);

                    return (
                      <div
                        key={a._id}
                        className="border rounded-3xl p-4 md:p-5"
                        style={{ borderColor: "rgb(var(--border))" }}
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0">
                            <h3 className="text-lg font-black truncate">
                              {a.job?.title || "Untitled Job"}
                            </h3>
                            <p
                              className="text-sm mt-1"
                              style={{ color: "rgb(var(--muted))" }}
                            >
                              {a.job?.location || "Location not available"} •{" "}
                              {a.job?.jobType || "Type not available"}
                            </p>
                            {a.job?.company?.companyName && (
                              <p
                                className="text-sm mt-1"
                                style={{ color: "rgb(var(--muted))" }}
                              >
                                {a.job.company.companyName}
                              </p>
                            )}
                          </div>

                          <span
                            className="px-3 py-1.5 rounded-full text-sm font-extrabold"
                            style={{
                              background: statusUI.bg,
                              color: statusUI.color,
                            }}
                          >
                            {statusUI.label}
                          </span>
                        </div>

                        <div className="mt-4 grid sm:grid-cols-2 gap-3">
                          <div
                            className="rounded-2xl p-3"
                            style={{ background: "rgba(var(--bg),0.6)" }}
                          >
                            <p
                              className="text-xs font-bold uppercase tracking-wide"
                              style={{ color: "rgb(var(--muted))" }}
                            >
                              Resume
                            </p>
                            <p className="text-sm font-semibold mt-1">
                              {a.resumeUrl ? "Attached" : "Not attached"}
                            </p>
                          </div>

                          <div
                            className="rounded-2xl p-3"
                            style={{ background: "rgba(var(--bg),0.6)" }}
                          >
                            <p
                              className="text-xs font-bold uppercase tracking-wide"
                              style={{ color: "rgb(var(--muted))" }}
                            >
                              Applied On
                            </p>
                            <p className="text-sm font-semibold mt-1">
                              {a.createdAt
                                ? new Date(a.createdAt).toLocaleDateString()
                                : "Recently"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <AppFooter />
        </div>
      </MotionPage>
    </IGShell>
  );
}