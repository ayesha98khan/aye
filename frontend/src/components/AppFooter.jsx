export default function AppFooter() {
  return (
    <footer
      className="mt-8 border rounded-3xl px-5 py-4 text-sm"
      style={{
        background: "rgba(var(--card),0.7)",
        borderColor: "rgb(var(--border))",
        color: "rgb(var(--muted))",
      }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="font-semibold">JobNest • Student & Recruiter Hiring Platform</p>
        <p>Built with React, Node.js, Express, MongoDB</p>
      </div>
    </footer>
  );
}