import { CHILDREN } from "../data/children";
import { getRankForXp, XP_RANKS } from "../data/gamification";

export default function XpLeaderboard({ xpByChild, getChildName }) {
  const sorted = [...CHILDREN].sort(
    (a, b) => (xpByChild[b.id] ?? 0) - (xpByChild[a.id] ?? 0)
  );
  const medals = ["🥇", "🥈"];

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
      {sorted.map((child, i) => {
        const xp = xpByChild[child.id] ?? 0;
        const rank = getRankForXp(xp);
        const rankIndex = XP_RANKS.indexOf(rank);
        const nextRank = XP_RANKS[rankIndex + 1] ?? null;
        const progress = nextRank
          ? Math.min(1, (xp - rank.minXp) / (nextRank.minXp - rank.minXp))
          : 1;

        return (
          <div
            key={child.id}
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: 16,
              padding: "14px 14px 12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "1.5px solid #eee",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>{medals[i]}</span>
              <span style={{ fontSize: 18 }}>{child.emoji}</span>
              <span
                style={{
                  fontFamily: "'Rubik', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#1A1A1A",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {getChildName(child.id)}
              </span>
            </div>

            {/* Rank */}
            <div
              style={{
                fontFamily: "'Rubik', sans-serif",
                fontSize: 13,
                color: "#444",
                marginBottom: 6,
              }}
            >
              {rank.emoji} {rank.title}
            </div>

            {/* XP progress bar */}
            <div
              style={{
                height: 6,
                background: "#eee",
                borderRadius: 4,
                overflow: "hidden",
                marginBottom: 5,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.round(progress * 100)}%`,
                  background: "#1A1A1A",
                  borderRadius: 4,
                  transition: "width 400ms ease",
                }}
              />
            </div>

            {/* XP label */}
            <div
              dir="ltr"
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: "#999",
              }}
            >
              <span>{xp} XP</span>
              <span>
                {nextRank ? `→ ${nextRank.minXp} XP` : "MAX ⭐"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
