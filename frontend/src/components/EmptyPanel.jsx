export default function EmptyPanel({
  title = "Nothing here yet",
  subtitle = "Try again later.",
  buttonText,
  onClick,
}) {
  return (
    <div
      className="border rounded-3xl p-10 text-center"
      style={{
        borderColor: "rgb(var(--border))",
        background: "rgba(var(--card),0.75)",
      }}
    >
      <p className="text-2xl font-black">{title}</p>
      <p className="mt-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
        {subtitle}
      </p>

      {buttonText && onClick ? (
        <button
          onClick={onClick}
          className="mt-5 px-5 py-2.5 rounded-2xl text-white font-extrabold"
          style={{ background: "rgb(var(--brand))" }}
        >
          {buttonText}
        </button>
      ) : null}
    </div>
  );
}