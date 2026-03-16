export default function StarRating({ score, total }) {
  const pct = total > 0 ? score / total : 0;
  let filled = 0;
  if (pct >= 0.8) filled = 3;
  else if (pct >= 0.5) filled = 2;
  else if (pct > 0) filled = 1;

  const label = `${filled} מתוך 3 כוכבים`;

  return (
    <span
      aria-label={label}
      style={{ fontSize: 14, letterSpacing: 2 }}
    >
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ opacity: i <= filled ? 1 : 0.2 }}>
          ★
        </span>
      ))}
    </span>
  );
}
