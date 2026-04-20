const STATUS_CONFIG = {
  pending: { label: "ממתין", color: "#6b7280" },
  scraping: { label: "גורד נתונים", color: "#2563eb" },
  writing: { label: "כותב", color: "#7c3aed" },
  reviewing_accuracy: { label: "בודק דיוק", color: "#d97706" },
  reviewing_template: { label: "בודק תבנית", color: "#d97706" },
  approved: { label: "אושר", color: "#059669" },
  failed: { label: "נכשל", color: "#dc2626" },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "#6b7280" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        color: "#fff",
        backgroundColor: cfg.color,
        whiteSpace: "nowrap",
      }}
    >
      {cfg.label}
    </span>
  );
}
