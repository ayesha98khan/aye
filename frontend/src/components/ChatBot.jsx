import { useState } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi 👋 Ask me about jobs, resumes, or how to use JobNest." },
  ]);

  async function send() {
    const t = text.trim();
    if (!t) return;

    setMsgs((m) => [...m, { from: "me", text: t }]);
    setText("");

    // If you don't have backend chatbot route yet, we do a simple local reply:
    try {
      // OPTIONAL: if you add backend route later, this will work:
      // const res = await api("/api/chat", { method: "POST", body: { message: t } });
      // const reply = res.reply;

      const reply = smartLocalReply(t);
      setMsgs((m) => [...m, { from: "bot", text: reply }]);
    } catch {
      setMsgs((m) => [...m, { from: "bot", text: "Chat is not connected yet. We'll connect it next." }]);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full text-white font-black shadow-lg"
        style={{ background: "rgb(var(--brand))" }}
        title="Chat"
      >
        ✦
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden border"
            style={{ background: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}
          >
            <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: "rgb(var(--border))" }}>
              <p className="font-black">JobNest Chat</p>
              <button className="font-bold" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="p-4 h-72 overflow-y-auto space-y-2">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[80%] px-3 py-2 rounded-2xl text-sm"
                    style={{
                      background: m.from === "me" ? "rgb(var(--brand))" : "rgba(var(--border),0.45)",
                      color: m.from === "me" ? "white" : "rgb(var(--text))",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t flex gap-2" style={{ borderColor: "rgb(var(--border))" }}>
              <input
                className="flex-1 px-3 py-2 rounded-2xl border"
                style={{ borderColor: "rgb(var(--border))", background: "transparent" }}
                placeholder="Type a message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button
                className="px-4 py-2 rounded-2xl text-white font-bold"
                style={{ background: "rgb(var(--brand))" }}
                onClick={send}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function smartLocalReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes("resume")) return "Tip: Upload your resume in Profile → Resume Upload. Keep it PDF and include projects + skills.";
  if (m.includes("apply")) return "To apply: open Feed → choose a job → Apply. Track it in Tracker page.";
  if (m.includes("recruiter") || m.includes("post job")) return "Recruiters: go to Recruiter page to post jobs and stories (24h).";
  if (m.includes("filter") || m.includes("search")) return "Use the search + filters on Feed (title, location, type, tags).";
  return "Got it. I can help with jobs, resume, applying, or recruiter posting. What do you want to do?";
}