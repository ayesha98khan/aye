import { useEffect, useState } from "react";
import IGShell from "../components/IGShell";
import MotionPage from "../components/MotionPage";
import { SparkHeader } from "../components/Illustrations";
import { api, uploadFile, user as getUser } from "../lib/api";

export default function Profile() {
  const [me, setMe] = useState(getUser());
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const fresh = await api("/api/users/me");
        localStorage.setItem("user", JSON.stringify(fresh));
        setMe(fresh);
      } catch (e) {
        setMsg(e.message);
      }
    })();
  }, []);

  async function save() {
    try {
      setBusy(true);
      setMsg("");
      const updated = await api("/api/users/me", { method: "PUT", body: me });
      localStorage.setItem("user", JSON.stringify(updated));
      setMe(updated);
      setMsg("Saved ✅");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function uploadResume() {
    try {
      if (!resumeFile) return setMsg("Choose a resume first.");
      setBusy(true);
      setMsg("Uploading resume...");
      const url = await uploadFile("/api/upload/resume", resumeFile);
      setMe((m) => ({ ...m, resumeUrl: url }));
      setMsg("Resume uploaded ✅ (click Save)");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function uploadLogo() {
    try {
      if (!logoFile) return setMsg("Choose a logo first.");
      setBusy(true);
      setMsg("Uploading logo...");
      const url = await uploadFile("/api/upload/image", logoFile);
      setMe((m) => ({ ...m, companyLogoUrl: url }));
      setMsg("Logo uploaded ✅ (click Save)");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function addPhoto() {
    try {
      if (!photoFile) return setMsg("Choose a photo first.");
      setBusy(true);
      setMsg("Uploading photo...");
      const url = await uploadFile("/api/upload/image", photoFile);
      setMe((m) => ({ ...m, companyPhotos: [...(m.companyPhotos || []), url] }));
      setMsg("Photo added ✅ (click Save)");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  const avatar =
    me?.role === "recruiter"
      ? me.companyLogoUrl || "https://placehold.co/120x120"
      : "https://placehold.co/120x120";

  return (
    <IGShell>
      <MotionPage>
        {/* ✅ ADD HEADER HERE */}
        <SparkHeader
          title="Your Profile"
          subtitle="Edit profile • Upload resume/logo • IG grid"
        />

        {/* ✅ Main profile card below header */}
        <div
          className="border rounded-3xl p-5 shadow-sm mt-5"
          style={{
            background: "rgba(var(--card),0.9)",
            borderColor: "rgb(var(--border))",
          }}
        >
          {/* Top row */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400">
              <div
                className="w-full h-full rounded-full p-[2px]"
                style={{ background: "rgb(var(--card))" }}
              >
                <img className="w-full h-full rounded-full object-cover" src={avatar} alt="" />
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="text-2xl font-black truncate">
                {me?.role === "recruiter" ? me.companyName || me.name : me?.name}
              </h2>
              <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>
                {me?.email} • {me?.role}
              </p>

              <div className="mt-3 flex gap-2 flex-wrap items-center">
                <button
                  disabled={busy}
                  onClick={save}
                  className="px-5 py-2.5 rounded-2xl text-white font-extrabold disabled:opacity-60"
                  style={{ background: "rgb(var(--brand))" }}
                >
                  Save
                </button>
                {msg && (
                  <span className="text-sm" style={{ color: "rgb(var(--muted))" }}>
                    {msg}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Field label="Name">
              <input
                className="w-full border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                value={me?.name || ""}
                onChange={(e) => setMe({ ...me, name: e.target.value })}
              />
            </Field>

            {me?.role === "recruiter" && (
              <Field label="Company Name">
                <input
                  className="w-full border rounded-2xl p-3 bg-transparent"
                  style={{ borderColor: "rgb(var(--border))" }}
                  value={me?.companyName || ""}
                  onChange={(e) => setMe({ ...me, companyName: e.target.value })}
                />
              </Field>
            )}

            <div className="md:col-span-2">
              <Field label={me?.role === "recruiter" ? "Company Bio" : "Bio"}>
                <textarea
                  className="w-full border rounded-2xl p-3 bg-transparent min-h-[110px]"
                  style={{ borderColor: "rgb(var(--border))" }}
                  value={me?.role === "recruiter" ? me?.companyBio || "" : me?.bio || ""}
                  onChange={(e) =>
                    me?.role === "recruiter"
                      ? setMe({ ...me, companyBio: e.target.value })
                      : setMe({ ...me, bio: e.target.value })
                  }
                />
              </Field>
            </div>

            {me?.role === "student" && (
              <>
                <div className="md:col-span-2">
                  <Field label="Skills (comma separated)">
                    <input
                      className="w-full border rounded-2xl p-3 bg-transparent"
                      style={{ borderColor: "rgb(var(--border))" }}
                      value={(me?.skills || []).join(", ")}
                      onChange={(e) =>
                        setMe({
                          ...me,
                          skills: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <UploadCard
                    title="Resume (PDF)"
                    subtitle={me?.resumeUrl ? "Resume linked ✅" : "Upload once, then click Save."}
                  >
                    <input className="file-input w-full border rounded-2xl p-2 bg-transparent" style={{ borderColor: "rgb(var(--border))" }} type="file" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
                    <button
                      disabled={busy}
                      className="px-4 py-2 rounded-2xl font-extrabold text-white disabled:opacity-60"
                      style={{ background: "rgb(var(--text))" }}
                      onClick={uploadResume}
                    >
                      Upload
                    </button>
                  </UploadCard>
                </div>
              </>
            )}

            {me?.role === "recruiter" && (
              <>
                <div className="md:col-span-2">
                  <UploadCard title="Company Logo" subtitle="Shows on jobs + stories.">
                    <input
                      className="file-input w-full border rounded-2xl p-2 bg-transparent" style={{ borderColor: "rgb(var(--border))" }} type="file"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    />
                    <button
                      disabled={busy}
                      className="px-4 py-2 rounded-2xl font-extrabold text-white disabled:opacity-60"
                      style={{ background: "rgb(var(--text))" }}
                      onClick={uploadLogo}
                    >
                      Upload
                    </button>
                  </UploadCard>
                </div>

                <div className="md:col-span-2">
                  <UploadCard title="Company Feed Photos (IG Grid)" subtitle="Add photos like IG posts.">
                    <input
                      className="file-input w-full border rounded-2xl p-2 bg-transparent" style={{ borderColor: "rgb(var(--border))" }} type="file"
                      accept="image/*"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    />
                    <button
                      disabled={busy}
                      className="px-4 py-2 rounded-2xl font-extrabold text-white disabled:opacity-60"
                      style={{ background: "rgb(var(--brand))" }}
                      onClick={addPhoto}
                    >
                      Add
                    </button>
                  </UploadCard>

                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-4">
                    {(me?.companyPhotos || []).map((p) => (
                      <img
                        key={p}
                        className="aspect-square object-cover rounded-2xl border"
                        style={{ borderColor: "rgb(var(--border))" }}
                        src={p}
                        alt=""
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </MotionPage>
    </IGShell>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-extrabold">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function UploadCard({ title, subtitle, children }) {
  return (
    <div className="border rounded-3xl p-4" style={{ borderColor: "rgb(var(--border))" }}>
      <p className="font-black">{title}</p>
      <p className="text-sm mt-1" style={{ color: "rgb(var(--muted))" }}>
        {subtitle}
      </p>
      <div className="mt-3 flex gap-2 items-center flex-wrap">{children}</div>
    </div>
  );
}