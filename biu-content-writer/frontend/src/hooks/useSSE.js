import { useEffect, useRef } from "react";
import { streamUrl } from "../api/client";

export function useSSE(docId, onStatus) {
  const esRef = useRef(null);

  useEffect(() => {
    if (!docId) return;
    const es = new EventSource(streamUrl(docId));
    esRef.current = es;
    es.onmessage = (e) => {
      if (e.data !== "ping") onStatus(e.data);
    };
    return () => {
      es.close();
    };
  }, [docId]);
}
