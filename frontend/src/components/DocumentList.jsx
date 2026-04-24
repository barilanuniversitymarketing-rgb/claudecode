import { useState, useEffect } from "react";
import DocumentCard from "./DocumentCard";
import { getDocuments } from "../api/client";

export default function DocumentList({ refreshTrigger, onView, onRunAgain }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDocuments()
      .then((data) => setDocs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  function handleDeleted(deletedId) {
    setDocs((prev) => prev.filter((d) => d.id !== deletedId));
  }

  function handleChildCreated(newDoc) {
    setDocs((prev) => {
      const parentIdx = prev.findIndex((d) => d.id === newDoc.parent_id);
      if (parentIdx === -1) return [newDoc, ...prev];
      const updated = [...prev];
      const parent = { ...updated[parentIdx] };
      parent.children = [...(parent.children || []), newDoc];
      updated[parentIdx] = parent;
      return updated;
    });
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>טוען מסמכים...</div>
    );
  }

  if (docs.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 60,
          color: "#9ca3af",
          border: "2px dashed #e5e7eb",
          borderRadius: 12,
          direction: "rtl",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
        <p>אין מסמכים עדיין. הזן שמות תוכניות והפעל יצירה.</p>
      </div>
    );
  }

  return (
    <div>
      {docs.map((doc) => (
        <div key={doc.id}>
          <DocumentCard
            doc={doc}
            onView={onView}
            onRunAgain={(d) => onRunAgain(d, handleChildCreated)}
            onDeleted={handleDeleted}
          />
          {(doc.children || []).map((child) => (
            <DocumentCard
              key={child.id}
              doc={child}
              onView={onView}
              onRunAgain={(d) => onRunAgain(d, handleChildCreated)}
              onDeleted={(id) => {
                setDocs((prev) =>
                  prev.map((parent) =>
                    parent.id === doc.id
                      ? {
                          ...parent,
                          children: (parent.children || []).filter((c) => c.id !== id),
                        }
                      : parent
                  )
                );
              }}
              isChild
            />
          ))}
        </div>
      ))}
    </div>
  );
}
