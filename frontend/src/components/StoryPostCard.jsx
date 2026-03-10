import { useState } from "react";

export default function StoryPostCard({ onSubmit }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return setMsg("Choose an image first.");

    try {
      setBusy(true);
      setMsg("");
      await onSubmit?.({ file, caption, visibility: "public" });
      setFile(null);
      setCaption("");
      e.target.reset();
      setMsg("Story uploaded ✅");
    } catch (err) {
      setMsg(err.message || "Failed to post story");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-3xl p-5" style={{ borderColor: "rgb(var(--border))", background: "rgb(var(--card))" }}>
      <h3 className="text-lg font-black">Story Post</h3>
      <div className="mt-4 space-y-3">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <input
          className="w-full border rounded-2xl p-3 bg-transparent"
          style={{ borderColor: "rgb(var(--border))" }}
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 rounded-2xl text-white font-extrabold disabled:opacity-60"
          style={{ background: "rgb(var(--brand))" }}
        >
          {busy ? "Posting..." : "Post Story"}
        </button>
        {msg && <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>{msg}</p>}
      </div>
    </form>
  );
}
