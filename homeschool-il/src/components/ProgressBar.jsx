export default function ProgressBar({ value, max, color }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-label={`${percent}% הושלם`}
      style={{
        width: "100%",
        height: 6,
        background: "rgba(0,0,0,0.06)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${percent}%`,
          height: "100%",
          background: color,
          borderRadius: 3,
          transition: "width 500ms cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}
