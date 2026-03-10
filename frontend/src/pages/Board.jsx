import { useEffect, useMemo, useState } from "react";
import IGShell from "../components/IGShell";
import MotionPage from "../components/MotionPage";
import { SparkHeader } from "../components/Illustrations";
import { api } from "../lib/api";

const COLUMNS = [
  { key: "todo", title: "To Do" },
  { key: "inprogress", title: "In Progress" },
  { key: "done", title: "Done" },
];

function Pill({ text }) {
  return (
    <span
      className="text-[11px] font-black px-2 py-1 rounded-full border"
      style={{ borderColor: "rgb(var(--border))" }}
    >
      {text}
    </span>
  );
}

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [msg, setMsg] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  async function load() {
    const data = await api("/api/tasks/mine");
    setTasks(data);
  }

  useEffect(() => {
    load().catch((e) => setMsg(e.message));
  }, []);

  async function createTask() {
    try {
      setMsg("");
      if (!title.trim()) return setMsg("Title required");
      const t = await api("/api/tasks", {
        method: "POST",
        body: { title, description, priority },
      });
      setTasks((prev) => [t, ...prev]);
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function updateTask(id, patch) {
    const updated = await api(`/api/tasks/${id}`, { method: "PUT", body: patch });
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
  }

  async function removeTask(id) {
    await api(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t._id !== id));
  }

  const byCol = useMemo(() => {
    const map = { todo: [], inprogress: [], done: [] };
    for (const t of tasks) map[t.status || "todo"].push(t);
    return map;
  }, [tasks]);

  return (
    <IGShell>
      <MotionPage>
        <SparkHeader
          title="Jira Board"
          subtitle="Plan your work like Jira • Drag & drop later • Works with your DB now"
        />

        {/* Create */}
        <div
          className="mt-5 border rounded-3xl p-5"
          style={{ background: "rgba(var(--card),0.9)", borderColor: "rgb(var(--border))" }}
        >
          <div className="grid md:grid-cols-4 gap-3">
            <input
              className="border rounded-2xl p-3 bg-transparent md:col-span-2"
              style={{ borderColor: "rgb(var(--border))" }}
              placeholder="Task title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              className="border rounded-2xl p-3 bg-transparent"
              style={{ borderColor: "rgb(var(--border))" }}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button
              onClick={createTask}
              className="rounded-2xl font-extrabold text-white"
              style={{ background: "rgb(var(--brand))" }}
            >
              Create
            </button>
          </div>

          <textarea
            className="mt-3 w-full border rounded-2xl p-3 bg-transparent min-h-[90px]"
            style={{ borderColor: "rgb(var(--border))" }}
            placeholder="Description (optional)…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {msg && <p className="text-sm mt-2" style={{ color: "rgb(var(--muted))" }}>{msg}</p>}
        </div>

        {/* Columns */}
        <div className="mt-5 grid md:grid-cols-3 gap-4">
          {COLUMNS.map((c) => (
            <div
              key={c.key}
              className="border rounded-3xl p-4"
              style={{ background: "rgba(var(--card),0.75)", borderColor: "rgb(var(--border))" }}
            >
              <div className="flex items-center justify-between">
                <p className="font-black">{c.title}</p>
                <Pill text={`${byCol[c.key].length}`} />
              </div>

              <div className="mt-3 space-y-3">
                {byCol[c.key].map((t) => (
                  <div
                    key={t._id}
                    className="border rounded-3xl p-4 hover:opacity-95 transition"
                    style={{ borderColor: "rgb(var(--border))", background: "rgba(var(--card),0.92)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-extrabold truncate">{t.title}</p>
                        {t.description && (
                          <p className="text-sm mt-1 line-clamp-2" style={{ color: "rgb(var(--muted))" }}>
                            {t.description}
                          </p>
                        )}
                      </div>
                      <Pill text={t.priority} />
                    </div>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      {c.key !== "todo" && (
                        <button
                          className="px-3 py-1 rounded-full font-bold border text-sm"
                          style={{ borderColor: "rgb(var(--border))" }}
                          onClick={() =>
                            updateTask(t._id, { status: c.key === "done" ? "inprogress" : "todo" })
                          }
                        >
                          ←
                        </button>
                      )}

                      {c.key !== "done" && (
                        <button
                          className="px-3 py-1 rounded-full font-bold border text-sm"
                          style={{ borderColor: "rgb(var(--border))" }}
                          onClick={() =>
                            updateTask(t._id, { status: c.key === "todo" ? "inprogress" : "done" })
                          }
                        >
                          →
                        </button>
                      )}

                      <button
                        className="ml-auto px-3 py-1 rounded-full font-bold border text-sm"
                        style={{ borderColor: "rgb(var(--border))" }}
                        onClick={() => removeTask(t._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {byCol[c.key].length === 0 && (
                  <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>
                    No tasks here.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </MotionPage>
    </IGShell>
  );
}