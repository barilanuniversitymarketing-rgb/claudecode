import { useState, useEffect } from "react";
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from "../api/client";

function SectionRow({ section, onChange, onRemove, index }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "12px 14px",
        marginBottom: 8,
        background: "#fafafa",
        direction: "rtl",
      }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
        <span style={{ color: "#9ca3af", fontSize: 13, minWidth: 20 }}>{index + 1}.</span>
        <input
          value={section.title}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          placeholder="שם הסעיף"
          dir="rtl"
          style={inputStyle}
        />
        <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, whiteSpace: "nowrap" }}>
          <input
            type="checkbox"
            checked={section.required}
            onChange={(e) => onChange({ ...section, required: e.target.checked })}
          />
          חובה
        </label>
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            color: "#dc2626",
            cursor: "pointer",
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>
      <textarea
        value={section.description}
        onChange={(e) => onChange({ ...section, description: e.target.value })}
        placeholder="הנחיה לבינה המלאכותית (מה לכתוב בסעיף זה)"
        dir="rtl"
        rows={2}
        style={{ ...inputStyle, resize: "vertical", width: "100%", boxSizing: "border-box" }}
      />
    </div>
  );
}

const inputStyle = {
  flex: 1,
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: 13,
  fontFamily: "inherit",
};

const emptySection = () => ({ title: "", description: "", required: true });

export default function TemplateEditor({ onClose }) {
  const [templates, setTemplates] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState("");
  const [sections, setSections] = useState([emptySection()]);
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    getTemplates().then((data) => {
      setTemplates(data);
      if (data.length) loadTemplate(data.find((t) => t.is_default) || data[0]);
    });
  }, []);

  function loadTemplate(t) {
    setSelectedId(t.id);
    setName(t.name);
    setSections(t.sections.map((s) => ({ ...s })));
    setIsDefault(t.is_default);
  }

  function handleNew() {
    setSelectedId(null);
    setName("");
    setSections([emptySection()]);
    setIsDefault(false);
  }

  async function handleSave() {
    if (!name.trim() || sections.every((s) => !s.title.trim())) return;
    setSaving(true);
    setMsg(null);
    const validSections = sections.filter((s) => s.title.trim());
    try {
      if (selectedId) {
        const updated = await updateTemplate(selectedId, { name, sections: validSections, is_default: isDefault });
        setTemplates((prev) => prev.map((t) => (t.id === selectedId ? updated : t)));
        setMsg("נשמר בהצלחה");
      } else {
        const created = await createTemplate({ name, sections: validSections, is_default: isDefault });
        setTemplates((prev) => [created, ...prev]);
        setSelectedId(created.id);
        setMsg("נוצר בהצלחה");
      }
    } catch (err) {
      setMsg(`שגיאה: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedId || !confirm("למחוק תבנית זו?")) return;
    await deleteTemplate(selectedId);
    const remaining = templates.filter((t) => t.id !== selectedId);
    setTemplates(remaining);
    if (remaining.length) loadTemplate(remaining[0]);
    else handleNew();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 200,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          width: "min(680px, 96vw)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18 }}>עריכת תבניות</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Template list sidebar */}
          <div
            style={{
              width: 200,
              borderLeft: "1px solid #e5e7eb",
              overflowY: "auto",
              padding: 12,
              background: "#f9fafb",
            }}
          >
            <button
              onClick={handleNew}
              style={{
                width: "100%",
                padding: "7px 0",
                background: "#1a3a5c",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              + תבנית חדשה
            </button>
            {templates.map((t) => (
              <div
                key={t.id}
                onClick={() => loadTemplate(t)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 7,
                  cursor: "pointer",
                  background: selectedId === t.id ? "#e0e7ff" : "transparent",
                  fontWeight: selectedId === t.id ? 600 : 400,
                  fontSize: 13,
                  direction: "rtl",
                  marginBottom: 2,
                }}
              >
                {t.name}
                {t.is_default && (
                  <span style={{ fontSize: 10, color: "#6b7280", marginRight: 4 }}>★</span>
                )}
              </div>
            ))}
          </div>

          {/* Editor */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            <div style={{ direction: "rtl" }}>
              <label style={{ fontSize: 13, color: "#374151", display: "block", marginBottom: 4 }}>
                שם התבנית
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="שם התבנית"
                dir="rtl"
                style={{ ...inputStyle, flex: "unset", width: "100%", boxSizing: "border-box", marginBottom: 12 }}
              />

              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 16 }}>
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                />
                הגדר כתבנית ברירת מחדל
              </label>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>סעיפים</span>
                <button
                  onClick={() => setSections((prev) => [...prev, emptySection()])}
                  style={{
                    background: "#f0fdf4",
                    color: "#166534",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 12px",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  + הוסף סעיף
                </button>
              </div>

              {sections.map((sec, idx) => (
                <SectionRow
                  key={idx}
                  index={idx}
                  section={sec}
                  onChange={(updated) =>
                    setSections((prev) => prev.map((s, i) => (i === idx ? updated : s)))
                  }
                  onRemove={() =>
                    setSections((prev) => prev.filter((_, i) => i !== idx))
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {msg && <span style={{ fontSize: 13, color: "#059669" }}>{msg}</span>}
          <div style={{ display: "flex", gap: 8, marginRight: "auto" }}>
            {selectedId && (
              <button onClick={handleDelete} style={{ ...actionBtn("#fff1f2", "#be123c") }}>
                מחק תבנית
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              style={actionBtn("#1a3a5c", "#fff")}
            >
              {saving ? "שומר..." : "שמור"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function actionBtn(bg, color) {
  return {
    padding: "8px 18px",
    background: bg,
    color,
    border: "none",
    borderRadius: 7,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  };
}
