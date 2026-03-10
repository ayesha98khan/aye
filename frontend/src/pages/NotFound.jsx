import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="max-w-md w-full text-center border rounded-3xl p-8"
        style={{
          background: "rgba(var(--card),0.9)",
          borderColor: "rgb(var(--border))",
        }}
      >
        <h1 className="text-5xl font-black">404</h1>

        <p
          className="mt-3 text-sm"
          style={{ color: "rgb(var(--muted))" }}
        >
          The page you are looking for does not exist.
        </p>

        <Link
          to="/feed"
          className="inline-block mt-6 px-5 py-3 rounded-2xl text-white font-extrabold"
          style={{ background: "rgb(var(--brand))" }}
        >
          Go to Feed
        </Link>
      </div>
    </div>
  );
}