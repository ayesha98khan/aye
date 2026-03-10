import { useTheme } from "../lib/theme";

export default function ThemeMenu() {
  const { mode, setMode, accent, setAccent } = useTheme();

  return (
    <div className="p-3 rounded-2xl border"
      style={{ background: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold">Theme</p>

        <button
          className="px-3 py-1.5 rounded-full text-sm font-bold border"
          style={{ borderColor: "rgb(var(--border))" }}
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        >
          {mode === "dark" ? "Dark" : "Light"}
        </button>
      </div>

      <div className="mt-3">
        <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>Accent</p>
        <div className="mt-2 flex gap-2 flex-wrap">
          {["blue", "pink", "green", "purple"].map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-bold border ${accent === c ? "opacity-100" : "opacity-70"}`}
              style={{ borderColor: "rgb(var(--border))" }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}