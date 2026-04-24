import { useState } from "react";
import ProgramInput from "./components/ProgramInput";
import DocumentList from "./components/DocumentList";
import DocumentViewer from "./components/DocumentViewer";
import RunAgainModal from "./components/RunAgainModal";
import TemplateEditor from "./components/TemplateEditor";

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [viewDoc, setViewDoc] = useState(null);
  const [runAgainDoc, setRunAgainDoc] = useState(null);
  const [runAgainCallback, setRunAgainCallback] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);

  function handleRunStarted() {
    setRefreshTrigger((n) => n + 1);
  }

  function handleRunAgain(doc, onCreated) {
    setRunAgainDoc(doc);
    setRunAgainCallback(() => onCreated);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <header
        style={{
          background: "#1a3a5c",
          color: "#fff",
          padding: "0 32px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => setShowTemplates(true)}
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ניהול תבניות
        </button>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, direction: "rtl" }}>
          כותב תוכן תוכניות לימודים — אוניברסיטת בר-אילן
        </h1>
      </header>

      {/* Main content */}
      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "28px 24px",
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <ProgramInput onRunStarted={handleRunStarted} />
        <div>
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: 17,
              color: "#374151",
              direction: "rtl",
            }}
          >
            מסמכים שנוצרו
          </h2>
          <DocumentList
            refreshTrigger={refreshTrigger}
            onView={setViewDoc}
            onRunAgain={handleRunAgain}
          />
        </div>
      </main>

      {viewDoc && <DocumentViewer doc={viewDoc} onClose={() => setViewDoc(null)} />}
      {runAgainDoc && (
        <RunAgainModal
          doc={runAgainDoc}
          onClose={() => setRunAgainDoc(null)}
          onCreated={(newDoc) => {
            if (runAgainCallback) runAgainCallback(newDoc);
            setRefreshTrigger((n) => n + 1);
          }}
        />
      )}
      {showTemplates && <TemplateEditor onClose={() => setShowTemplates(false)} />}
    </div>
  );
}
