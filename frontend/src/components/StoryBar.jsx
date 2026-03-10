import { useState } from "react";

export default function StoryBar({ stories = [] }) {
  const [active, setActive] = useState(null);

  return (
    <>
      <div
        className="border rounded-3xl p-4 shadow-sm"
        style={{ background: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}
      >
        <div className="flex gap-4 overflow-x-auto">
          {stories.length === 0 && (
            <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>
              No stories yet.
            </p>
          )}

          {stories.map((s) => (
            <button
              key={s._id || s.id}
              onClick={() => setActive(s)}
              className="min-w-[92px] text-left group"
              title="Open story"
            >
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400 group-hover:scale-[1.02] transition">
                <div className="w-full h-full rounded-full p-[2px]" style={{ background: "rgb(var(--card))" }}>
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src={s.recruiter?.companyLogoUrl || "https://placehold.co/80x80"}
                    alt=""
                  />
                </div>
              </div>
              <p className="text-xs mt-2 font-semibold truncate">
                {s.recruiter?.companyName || "Recruiter"}
              </p>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden border"
            style={{ background: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}
          >
            <div className="p-3 flex items-center justify-between border-b" style={{ borderColor: "rgb(var(--border))" }}>
              <div className="flex items-center gap-2 min-w-0">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={active.recruiter?.companyLogoUrl || "https://placehold.co/80x80"}
                  alt=""
                />
                <p className="font-black truncate">{active.recruiter?.companyName || "Recruiter"}</p>
              </div>
              <button className="font-bold" onClick={() => setActive(null)}>✕</button>
            </div>

            <div className="bg-black">
              <img className="w-full max-h-[70vh] object-contain" src={active.mediaUrl} alt="" />
            </div>

            {active.caption && <div className="p-3 text-sm">{active.caption}</div>}
          </div>
        </div>
      )}
    </>
  );
}