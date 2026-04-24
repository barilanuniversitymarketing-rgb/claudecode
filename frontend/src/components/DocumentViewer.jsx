import { downloadUrl } from "../api/client";

export default function DocumentViewer({ doc, onClose }) {
  if (!doc) return null;

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
          width: "min(860px, 95vw)",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, direction: "rtl" }}>{doc.program_name}</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {doc.word_doc_path && (
              <a
                href={downloadUrl(doc.id)}
                download
                style={{
                  padding: "6px 14px",
                  background: "#1a3a5c",
                  color: "#fff",
                  borderRadius: 6,
                  textDecoration: "none",
                  fontSize: 13,
                }}
              >
                הורד Word
              </a>
            )}
            <button
              onClick={onClose}
              style={{
                padding: "6px 12px",
                background: "#f3f4f6",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              ✕
            </button>
          </div>
        </div>
        <div style={{ padding: "20px 24px", overflowY: "auto", direction: "rtl" }}>
          {doc.generated_content ? (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {doc.generated_content}
            </pre>
          ) : (
            <p style={{ color: "#6b7280" }}>התוכן עדיין לא נוצר.</p>
          )}
        </div>
      </div>
    </div>
  );
}
