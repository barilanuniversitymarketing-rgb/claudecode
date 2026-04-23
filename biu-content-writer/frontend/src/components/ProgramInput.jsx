import { useState, useEffect } from "react";
import { getTemplates, createRun } from "../api/client";
import ModelSelector from "./ModelSelector";
import { DEFAULT_MODEL } from "../models";

export default function ProgramInput({ onRunStarted }) {
  const [names, setNames] = useState("");
  const [templates, setTemplates] = useState([]);
  const [templateId, setTemplateId] = useState(null);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTemplates().then((data) => {
      setTemplates(data);
      const def = data.find((t) => t.is_default);
      if (def) setTemplateId(def.id);
    });
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();
    const programNames = names
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!programNames.length) return;
    setLoading(true);
    setError(null);
    try {
      await createRun({ program_names: programNames, template_id: templateId || null, model });
      setNames("");
      onRunStarted();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,.07)",
      }}
    >
      <h2 style={{ margin: "0 0 16px", fontSize: 18, direction: "rtl" }}>יצירת תוכן לתוכניות</h2>
      <form onSubmit={handleGenerate}>
        <label
          style={{ display: "block", fontSize: 13, color: "#374151", marginBottom: 6, direction: "rtl" }}
        >
          שמות תוכניות (שורה אחת לכל תוכנית)
        </label>
        <textarea
          value={names}
          onChange={(e) => setNames(e.target.value)}
          placeholder={"מדעי המחשב\nמנהל עסקים\nפסיכולוגיה"}
          dir="rtl"
          rows={6}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 14,
            resize: "vertical",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />

        <label
          style={{
            display: "block",
            fontSize: 13,
            color: "#374151",
            margin: "12px 0 6px",
            direction: "rtl",
          }}
        >
          תבנית
        </label>
        <select
          value={templateId || ""}
          onChange={(e) => setTemplateId(Number(e.target.value) || null)}
          dir="rtl"
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 14,
            background: "#fff",
            boxSizing: "border-box",
          }}
        >
          <option value="">ללא תבנית ספציפית</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
              {t.is_default ? " (ברירת מחדל)" : ""}
            </option>
          ))}
        </select>

        <div style={{ marginTop: 14 }}>
          <ModelSelector value={model} onChange={setModel} />
        </div>

        {error && <p style={{ color: "#dc2626", fontSize: 13, margin: "8px 0 0" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading || !names.trim()}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "10px 0",
            background: loading ? "#9ca3af" : "#1a3a5c",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: loading ? "default" : "pointer",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {loading ? "מעבד..." : "צור תוכן"}
        </button>
      </form>
    </div>
  );
}
