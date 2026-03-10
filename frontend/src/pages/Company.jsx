import { SparkHeader } from "../components/Illustrations";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import IGShell from "../components/IGShell";
import MotionPage from "../components/MotionPage";
import { api } from "../lib/api";

export default function Company() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const data = await api(`/api/users/company/${id}`, { auth: false });
        setCompany(data);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [id]);

  return (
    <IGShell>
      <MotionPage>
        {!company ? (
          <div className="border rounded-3xl p-6" style={{ background: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}>
            <p className="text-xl font-black">Loading…</p>
            {err && <p className="text-sm mt-2" style={{ color: "rgb(var(--muted))" }}>{err}</p>}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="border rounded-3xl p-5" style={{ background: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}>
              <div className="flex items-center gap-4">
                <img
                  className="w-20 h-20 rounded-full object-cover border"
                  style={{ borderColor: "rgb(var(--border))" }}
                  src={company.companyLogoUrl || "https://placehold.co/120x120"}
                  alt=""
                />
                <div className="min-w-0">
                  <h2 className="text-2xl font-black truncate">{company.companyName || company.name}</h2>
                  <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>{company.email}</p>
                  <p className="text-sm mt-2">{company.companyBio || "No bio yet."}</p>
                  <div className="mt-3">
                    <Link to="/feed" className="px-4 py-2 rounded-full font-bold border inline-block"
                      style={{ borderColor: "rgb(var(--border))" }}>
                      Back to Feed
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-3xl p-5" style={{ background: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}>
              <div className="flex items-center justify-between">
                <p className="font-black text-lg">Company Feed</p>
                <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>
                  {(company.companyPhotos || []).length} posts
                </p>
              </div>

              {(company.companyPhotos || []).length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xl font-black">No posts yet</p>
                  <p className="text-sm mt-2" style={{ color: "rgb(var(--muted))" }}>
                    Recruiter can add photos from Profile.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-4">
                  {(company.companyPhotos || []).map((p) => (
                    <img key={p} src={p} alt="" className="aspect-square object-cover rounded-2xl border"
                      style={{ borderColor: "rgb(var(--border))" }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </MotionPage>
    </IGShell>
  );
}