export default function PageLoader({ lines = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="border rounded-3xl p-5 animate-pulse"
          style={{
            borderColor: "rgb(var(--border))",
            background: "rgba(var(--card),0.75)",
          }}
        >
          <div
            className="h-5 w-2/3 rounded"
            style={{ background: "rgb(var(--border))" }}
          />
          <div
            className="mt-3 h-4 w-full rounded"
            style={{ background: "rgb(var(--border))" }}
          />
          <div
            className="mt-2 h-4 w-5/6 rounded"
            style={{ background: "rgb(var(--border))" }}
          />
        </div>
      ))}
    </div>
  );
}