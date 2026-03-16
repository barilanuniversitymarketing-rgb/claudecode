import { useState, useCallback } from "react";

const STORAGE_KEY = "homeschool-data";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const saveResult = useCallback((childId, subject, lessonId, score, total) => {
    const key = `${childId}.${subject}.${lessonId}`;
    setProgress((prev) => {
      const existing = prev[key];
      // Only overwrite if new score is higher
      if (existing && existing.score >= score) return prev;
      const updated = {
        ...prev,
        [key]: { score, total, date: new Date().toISOString() },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({});
  }, []);

  return [progress, saveResult, resetProgress];
}
