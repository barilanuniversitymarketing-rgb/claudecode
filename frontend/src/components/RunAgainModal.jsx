import { useState } from "react";
import { runAgain } from "../api/client";
import ModelSelector from "./ModelSelector";
import { getModel } from "../models";

export default function RunAgainModal({ doc, onClose, onCreated }) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(doc.model || "claude-sonnet-4-6");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const originalModel = getModel(doc.model);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const newDoc = await runAgain(doc.id, prompt.trim(), model);
      onCreated(newDoc);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "min(560px, 95vw)",
          padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 4px", direction: "rtl" }}>הפעל מחדש עם תיקון</h3>
        <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: 14, direction: "rtl" }}>
          {doc.program_name}
        </p>

        {/* Current version indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 8,
            background: originalModel.bg,
            border: `1px solid ${originalModel.border}`,
            marginBottom: 16,
            direction: "rtl",
          }}
        >
          <span style={{ fontSize: 12, color: "#6b7280" }}>גרסה זו נוצרה עם</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: originalModel.color,
            }}
          >
            {originalModel.label}
          </span>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>({originalModel.sublabel})</span>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="מה צריך לתקן? (למשל: הוסף מידע על מלגות, שנה את הטון לפורמלי יותר...)"
            dir="rtl"
            rows={4}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 14,
              resize: "vertical",
              boxSizing: "border-box",
              fontFamily: "inherit",
              marginBottom: 14,
            }}
          />

          <ModelSelector
            value={model}
            onChange={setModel}
            label="הפעל מחדש עם מודל:"
          />

          {error && (
            <p style={{ color: "#dc2626", fontSize: 13, margin: "8px 0 0" }}>{error}</p>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                background: "#f3f4f6",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              style={{
                padding: "8px 16px",
                background: loading ? "#9ca3af" : "#1a3a5c",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: loading ? "default" : "pointer",
                fontWeight: 600,
              }}
            >
              {loading ? "שולח..." : "הפעל מחדש"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
