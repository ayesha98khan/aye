import { SparkHeader } from "../components/Illustrations";
import { useEffect, useState } from "react";
import IGShell from "../components/IGShell";
import MotionPage from "../components/MotionPage";
import { api, user } from "../lib/api";

export default function Applications() {
  const me = user();
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if (me?.role !== "student") return setMsg("Only students have tracker.");
        const data = await api("/api/applications/mine");
        setList(data);
      } catch (e) {
        setMsg(e.message);
      }
    })();
  }, []);

  return (
    <IGShell>
      <MotionPage>
        <div
          className="border rounded-3xl p-5 shadow-sm"
          style={{ background: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}
        >
          <h2 className="text-2xl font-black">Application Tracker</h2>
          {msg && <p className="text-sm mt-2" style={{ color: "rgb(var(--muted))" }}>{msg}</p>}

          <div className="mt-4 space-y-3">
            {list.map((a) => (
              <div key={a._id} className="border rounded-3xl p-4" style={{ borderColor: "rgb(var(--border))" }}>
                <p className="font-extrabold">{a.job?.title}</p>
                <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>
                  {a.job?.location} • {a.job?.jobType}
                </p>
                <p className="text-sm mt-2">
                  Status: <span className="font-black">{a.status}</span>
                </p>
              </div>
            ))}

            {list.length === 0 && !msg && (
              <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>No applications yet.</p>
            )}
          </div>
        </div>
      </MotionPage>
    </IGShell>
  );
}