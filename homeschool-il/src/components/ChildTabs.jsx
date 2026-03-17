import { useState, useRef } from "react";
import { CHILDREN } from "../data/children";
import ProgressBar from "./ProgressBar";
import LevelBadge from "./LevelBadge";

export default function ChildTabs({ activeChild, onSelect, getChildName, setChildName, stats, xpByChild }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef(null);

  function startEdit(childId, currentName) {
    setEditingId(childId);
    setEditValue(currentName);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commitEdit(childId) {
    const trimmed = editValue.trim();
    if (trimmed) setChildName(childId, trimmed);
    setEditingId(null);
  }

  function handleKeyDown(e, childId) {
    if (e.key === "Enter") commitEdit(childId);
    if (e.key === "Escape") setEditingId(null);
  }

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      {CHILDREN.map((child) => {
        const isActive = child.id === activeChild;
        const name = getChildName(child.id);
        const childStats = stats[child.id];
        const totalCompleted = (childStats?.math?.completed || 0) + (childStats?.english?.completed || 0);
        const totalLessons = (childStats?.math?.total || 0) + (childStats?.english?.total || 0);
        const subjectColor = "#1A1A1A";

        return (
          <button
            key={child.id}
            onClick={() => onSelect(child.id)}
            aria-label={`בחר ${name}`}
            aria-pressed={isActive}
            style={{
              flex: 1,
              background: isActive ? "#fff" : "rgba(255,255,255,0.5)",
              border: isActive ? "2px solid #1A1A1A" : "2px solid transparent",
              borderRadius: 16,
              padding: "14px 14px",
              cursor: "pointer",
              boxShadow: isActive ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
              textAlign: "right",
              minHeight: 44,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{child.emoji}</span>
              <div style={{ flex: 1 }}>
                {editingId === child.id ? (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      ref={inputRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, child.id)}
                      aria-label="שינוי שם הילד"
                      style={{
                        flex: 1,
                        fontFamily: "'Rubik', sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        border: "1.5px solid #1A1A1A",
                        borderRadius: 8,
                        padding: "2px 6px",
                        outline: "none",
                        width: "100%",
                      }}
                    />
                    <button
                      onClick={() => commitEdit(child.id)}
                      aria-label="שמור שם"
                      style={{
                        background: "#1A1A1A",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "2px 8px",
                        cursor: "pointer",
                        fontSize: 12,
                        minHeight: 44,
                        minWidth: 44,
                      }}
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); startEdit(child.id, name); }}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); startEdit(child.id, name); } }}
                    aria-label={`ערוך שם: ${name}`}
                    style={{
                      fontFamily: "'Rubik', sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#1A1A1A",
                      cursor: "text",
                      outline: "none",
                    }}
                  >
                    {name}
                  </div>
                )}
                <div style={{ fontFamily: "'Rubik', sans-serif", fontSize: 11, color: "#888", marginTop: 1 }}>
                  {child.grade}
                </div>
                <LevelBadge totalXp={xpByChild?.[child.id] ?? 0} />
              </div>
            </div>
            <ProgressBar value={totalCompleted} max={totalLessons} color={subjectColor} />
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: "#888",
                marginTop: 4,
                direction: "ltr",
                textAlign: "right",
              }}
            >
              {totalCompleted} / {totalLessons} שיעורים
            </div>
          </button>
        );
      })}
    </div>
  );
}
