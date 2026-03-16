import StarRating from "./StarRating";
import { SUBJECTS } from "../data/subjects";

export default function LessonRow({ lesson, index, subjectKey, result, onClick }) {
  const subject = SUBJECTS[subjectKey];
  const isComplete = !!result;
  const pct = isComplete ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <button
      onClick={onClick}
      aria-label={`שיעור: ${lesson.title}${isComplete ? `, הושלם עם ציון ${pct}%` : ""}`}
      style={{
        width: "100%",
        background: "#fff",
        border: "none",
        borderRadius: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12,
        textAlign: "right",
        animation: `slideUp 200ms ease both`,
        animationDelay: `${index * 50}ms`,
        transition: "transform 150ms",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(-3px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          minWidth: 40,
          borderRadius: 12,
          background: isComplete ? subject.color : subject.colorLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: isComplete ? "'Rubik', sans-serif" : "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: isComplete ? 18 : 13,
          color: isComplete ? "#fff" : subject.color,
        }}
      >
        {isComplete ? "✓" : index + 1}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Rubik', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: "#1A1A1A",
            marginBottom: 2,
          }}
        >
          {lesson.title}
        </div>
        <div
          style={{
            fontFamily: "'Rubik', sans-serif",
            fontSize: 12,
            color: "#888",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {lesson.desc}
        </div>
      </div>
      {isComplete && (
        <div style={{ flexShrink: 0, textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 13,
              color: subject.color,
              marginBottom: 2,
            }}
          >
            {pct}%
          </div>
          <StarRating score={result.score} total={result.total} />
        </div>
      )}
    </button>
  );
}
