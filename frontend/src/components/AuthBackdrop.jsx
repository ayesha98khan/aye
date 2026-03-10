export default function AuthBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 800px at 10% 10%, rgba(236,72,153,0.25), transparent 60%)," +
            "radial-gradient(1000px 700px at 90% 20%, rgba(59,130,246,0.25), transparent 60%)," +
            "radial-gradient(900px 600px at 50% 90%, rgba(250,204,21,0.18), transparent 60%)," +
            "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.06))",
        }}
      />

      {/* blobs */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-40"
        style={{ background: "rgb(var(--brand))" }}
      />
      <div className="absolute top-20 -right-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-25"
        style={{ background: "rgb(var(--text))" }}
      />
      <div className="absolute -bottom-32 left-1/3 w-[520px] h-[520px] rounded-full blur-3xl opacity-20"
        style={{ background: "#ff3ea5" }}
      />

      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
    </div>
  );
}