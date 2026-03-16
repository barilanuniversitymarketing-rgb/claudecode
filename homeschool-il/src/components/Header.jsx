export default function Header({ title, onBack }) {
  return (
    <div
      style={{
        background: "#1A1A1A",
        borderRadius: "0 0 28px 28px",
        padding: "20px 20px 24px",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: 3,
          color: "#999",
          marginBottom: 10,
          textTransform: "uppercase",
        }}
      >
        HOMESCHOOL IL
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h1
          style={{
            fontFamily: "'Rubik', sans-serif",
            fontWeight: 800,
            fontSize: 26,
            color: "#fff",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {title}
        </h1>
        {onBack && (
          <button
            onClick={onBack}
            aria-label="חזרה לדף הקודם"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: 20,
              padding: "8px 16px",
              color: "#fff",
              fontFamily: "'Rubik', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              cursor: "pointer",
              whiteSpace: "nowrap",
              minHeight: 44,
              minWidth: 44,
            }}
          >
            → חזרה
          </button>
        )}
      </div>
    </div>
  );
}
