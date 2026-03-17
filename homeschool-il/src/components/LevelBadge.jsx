import { getRankForXp } from "../data/gamification";

export default function LevelBadge({ totalXp }) {
  const rank = getRankForXp(totalXp);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "rgba(0,0,0,0.05)",
        borderRadius: 20,
        padding: "2px 8px",
        fontFamily: "'Rubik', sans-serif",
        fontSize: 11,
        color: "#555",
        marginTop: 2,
      }}
    >
      <span style={{ fontSize: 12 }}>{rank.emoji}</span>
      <span>{rank.title}</span>
    </div>
  );
}
