import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { useSSE } from "../hooks/useSSE";
import { downloadUrl, deleteDocument } from "../api/client";
import { getModel } from "../models";

function ModelBadge({ modelId }) {
  const m = getModel(modelId);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "1px 7px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        color: m.color,
        background: m.bg,
        border: `1px solid ${m.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {m.label}
    </span>
  );
}

export default function DocumentCard({ doc, onView, onRunAgain, onDeleted, isChild = false }) {
  const [status, setStatus] = useState(doc.status);
  const [deleted, setDeleted] = useState(false);

  useSSE(
    status !== "approved" && status !== "failed" ? doc.id : null,
    (newStatus) => setStatus(newStatus)
  );

  async function handleDelete() {
    if (!confirm("האם למחוק את המסמך?")) return;
    await deleteDocument(doc.id);
    setDeleted(true);
    onDeleted?.(doc.id);
  }

  if (deleted) return null;

  const isRunning = !["approved", "failed"].includes(status);

  return (
    <div
      style={{
        background: isChild ? "#f9fafb" : "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: isChild ? 8 : 10,
        padding: "14px 16px",
        marginBottom: 8,
        marginRight: isChild ? 24 : 0,
        boxShadow: isChild ? "none" : "0 1px 3px rgba(0,0,0,.07)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, direction: "rtl", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{doc.program_name}</span>
            {doc.label === "edited" && (
              <span
                style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  borderRadius: 6,
                  padding: "1px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                ערוך v{doc.version}
              </span>
            )}
            <ModelBadge modelId={doc.model} />
            <StatusBadge status={status} />
          </div>
          {doc.faculty && (
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, direction: "rtl" }}>
              {doc.faculty}
              {doc.department ? ` · ${doc.department}` : ""}
            </div>
          )}
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
            {new Date(doc.created_at).toLocaleString("he-IL")}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0, marginRight: 12 }}>
          {status === "approved" && (
            <>
              <button
                onClick={() => onView(doc)}
                style={btnStyle("#f0fdf4", "#166534")}
              >
                צפה
              </button>
              <a
                href={downloadUrl(doc.id)}
                download
                style={{ ...btnStyle("#eff6ff", "#1e40af"), textDecoration: "none" }}
              >
                הורד
              </a>
            </>
          )}
          {!isRunning && (
            <button onClick={() => onRunAgain(doc)} style={btnStyle("#faf5ff", "#7c3aed")}>
              הפעל מחדש
            </button>
          )}
          <button onClick={handleDelete} style={btnStyle("#fff1f2", "#be123c")}>
            מחק
          </button>
        </div>
      </div>
    </div>
  );
}

function btnStyle(bg, color) {
  return {
    padding: "5px 12px",
    background: bg,
    color,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
  };
}
