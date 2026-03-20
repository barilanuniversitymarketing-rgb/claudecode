import { getEarnedBadges } from "../data/badges";

function BadgePill({ badge }) {
  return (
    <div
      title={badge.desc}
      aria-label={badge.title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "#F7F5F0",
        border: "1.5px solid #E8E6E0",
        borderRadius: 20,
        padding: "4px 10px",
        fontFamily: "'Rubik', sans-serif",
        fontSize: 12,
        color: "#1A1A1A",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 14 }}>{badge.emoji}</span>
      <span>{badge.title}</span>
    </div>
  );
}

export default function ChildSummary({ childId, progress, childStats, totalXp }) {
  const earnedBadges = getEarnedBadges(childId, progress);

  const mathStats = childStats?.math || { completed: 0, avgScore: 0 };
  const englishStats = childStats?.english || { completed: 0, avgScore: 0 };

  const totalCompleted = mathStats.completed + englishStats.completed;
  const totalW = mathStats.completed + englishStats.completed;
  const overallAvgScore =
    totalW > 0
      ? Math.round(
          (mathStats.avgScore * mathStats.completed +
            englishStats.avgScore * englishStats.completed) /
            totalW
        )
      : 0;

  return (
    <section
      aria-label="סיכום התקדמות"
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1.5px solid #eee",
        padding: "16px 16px",
        marginBottom: 24,
        animation: "slideUp 300ms ease both",
      }}
    >
      {/* Stats Row */}
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {/* Column 1: Lessons */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            borderRight: "1px solid #eee",
            paddingRight: 16,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1A1A1A",
              fontFamily: "'Rubik', sans-serif",
            }}
          >
            {totalCompleted}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#888",
              fontFamily: "'Rubik', sans-serif",
              marginTop: 2,
            }}
          >
            שיעורים הושלמו
          </div>
        </div>

        {/* Column 2: Avg Score */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            borderRight: "1px solid #eee",
            paddingRight: 16,
            paddingLeft: 16,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1A1A1A",
              fontFamily: "'Rubik', sans-serif",
            }}
          >
            {overallAvgScore}%
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#888",
              fontFamily: "'Rubik', sans-serif",
              marginTop: 2,
            }}
          >
            ציון ממוצע
          </div>
        </div>

        {/* Column 3: XP */}
        <div style={{ flex: 1, textAlign: "center", paddingLeft: 16 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1A1A1A",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {totalXp}
            <span
              style={{
                fontSize: 13,
                fontFamily: "'Rubik', sans-serif",
                fontWeight: 600,
                marginRight: 2,
              }}
            >
              {" "}XP
            </span>
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#888",
              fontFamily: "'Rubik', sans-serif",
              marginTop: 2,
            }}
          >
            נקודות ניסיון
          </div>
        </div>
      </div>

      {/* Badge Shelf */}
      {earnedBadges.length > 0 && (
        <div
          style={{
            borderTop: "1px solid #F0F0F0",
            paddingTop: 12,
            marginTop: 12,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#888",
              fontFamily: "'Rubik', sans-serif",
              marginBottom: 8,
            }}
          >
            עיטורים שהרווחת
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {earnedBadges.map((badge) => (
              <BadgePill key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
