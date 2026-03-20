import { useEffect } from "react";

export default function BadgeToast({ badge, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`עיטור חדש: ${badge.title}`}
      onClick={onDismiss}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 200ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "40px 48px",
          textAlign: "center",
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
          maxWidth: 300,
          width: "90%",
        }}
      >
        <div style={{ fontSize: 60, marginBottom: 12 }}>{badge.emoji}</div>
        <div
          style={{
            fontFamily: "'Rubik', sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: "#1A1A1A",
            marginBottom: 6,
          }}
        >
          עיטור חדש! 🎖️
        </div>
        <div
          style={{
            fontFamily: "'Rubik', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            color: "#444",
            marginBottom: 4,
          }}
        >
          {badge.title}
        </div>
        <div
          style={{
            fontFamily: "'Rubik', sans-serif",
            fontSize: 14,
            color: "#888",
            marginBottom: 20,
          }}
        >
          {badge.desc}
        </div>
        <button
          onClick={onDismiss}
          style={{
            background: "#1A1A1A",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "10px 28px",
            fontFamily: "'Rubik', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            minHeight: 44,
          }}
        >
          המשך
        </button>
      </div>
    </div>
  );
}
