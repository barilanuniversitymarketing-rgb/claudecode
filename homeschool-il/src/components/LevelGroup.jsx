import { LEVEL_LABELS } from "../data/levels";
import LessonRow from "./LessonRow";

export default function LevelGroup({ level, lessons, subjectKey, progress, childId, onSelectLesson }) {
  const label = LEVEL_LABELS[level];
  let lessonIndex = 0;

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
          padding: "0 4px",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 14,
            color: "var(--subject-color)",
          }}
        >
          {label.icon}
        </span>
        <span
          style={{
            fontFamily: "'Rubik', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: "#1A1A1A",
          }}
        >
          {label.he}
        </span>
        <span
          lang="en"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: "#999",
          }}
        >
          {label.en}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {lessons.map((lesson, i) => {
          const key = `${childId}.${subjectKey}.${lesson.id}`;
          const result = progress[key] || null;
          return (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              index={i}
              subjectKey={subjectKey}
              result={result}
              onClick={() => onSelectLesson(lesson, level)}
            />
          );
        })}
      </div>
    </div>
  );
}
