import { MODELS } from "../models";

export default function ModelSelector({ value, onChange, label = "מודל AI" }) {
  return (
    <div>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 13,
            color: "#374151",
            marginBottom: 8,
            direction: "rtl",
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {MODELS.map((m) => {
          const selected = value === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              style={{
                flex: 1,
                minWidth: 90,
                padding: "8px 10px",
                borderRadius: 8,
                border: `2px solid ${selected ? m.color : m.border}`,
                background: selected ? m.bg : "#fff",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.15s",
                outline: "none",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: selected ? m.color : "#374151",
                }}
              >
                {m.label}
              </div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>
                {m.sublabel}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
