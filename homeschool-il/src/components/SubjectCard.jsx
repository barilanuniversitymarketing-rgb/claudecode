import { SUBJECTS } from "../data/subjects";
import ProgressBar from "./ProgressBar";

export default function SubjectCard({ subjectKey, stats, onClick, animIndex }) {
  const subject = SUBJECTS[subjectKey];
  if (!subject) return null;

  const { completed = 0, total = 0, percent = 0 } = stats || {};

  return (
    <button
      onClick={onClick}
      aria-label={`פתח נושא ${subject.label}`}
      style={{
        width: "100%",
        background: "#fff",
        border: "none",
        borderRadius: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        padding: "20px 20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 16,
        textAlign: "right",
        animation: `slideUp 300ms ease both`,
        animationDelay: `${animIndex * 100}ms`,
        transition: "transform 150ms, box-shadow 150ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.01)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: subject.colorLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: subject.color,
          flexShrink: 0,
          fontFamily: "'Space Mono', monospace",
        }}
      >
        {subject.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
          <span
            style={{
              fontFamily: "'Rubik', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: "#1A1A1A",
            }}
          >
            {subject.label}
          </span>
          <span
            lang="en"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: "#999",
              direction: "ltr",
            }}
          >
            {subject.labelEn}
          </span>
        </div>
        <ProgressBar value={completed} max={total} color={subject.color} />
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: "#999",
            marginTop: 4,
            direction: "ltr",
            textAlign: "right",
          }}
        >
          {completed}/{total} · {percent}%
        </div>
      </div>
      <div
        style={{
          fontSize: 20,
          color: "#999",
          flexShrink: 0,
        }}
      >
        ←
      </div>
    </button>
  );
}
