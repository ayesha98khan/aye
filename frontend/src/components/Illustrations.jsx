export function SparkHeader({ title, subtitle }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border p-6"
      style={{ background: "rgba(var(--card),0.85)", borderColor: "rgb(var(--border))" }}
    >
      <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full blur-3xl opacity-40"
        style={{ background: "rgb(var(--brand))" }}
      />
      <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full blur-3xl opacity-30"
        style={{ background: "rgb(var(--text))" }}
      />

      <div className="relative flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">{title}</h1>
          <p className="mt-2 text-sm md:text-base" style={{ color: "rgb(var(--muted))" }}>
            {subtitle}
          </p>
        </div>

        <div className="hidden md:block">
          <IGBlob />
        </div>
      </div>
    </div>
  );
}

export function IGBlob() {
  return (
    <svg width="170" height="130" viewBox="0 0 170 130" fill="none" aria-hidden="true">
      <path
        d="M46 18C71 -2 111 -2 133 18C156 40 169 74 151 97C132 121 84 132 54 117C24 102 1 63 12 39C23 15 21 38 46 18Z"
        fill="url(#g)"
        opacity="0.9"
      />
      <circle cx="120" cy="50" r="10" fill="white" opacity="0.9" />
      <circle cx="95" cy="82" r="6" fill="white" opacity="0.75" />
      <defs>
        <linearGradient id="g" x1="10" y1="10" x2="160" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(236,72,153)" />
          <stop offset="0.5" stopColor="rgb(59,130,246)" />
          <stop offset="1" stopColor="rgb(250,204,21)" />
        </linearGradient>
      </defs>
    </svg>
  );
}