import { useState, useCallback } from "react";
import { getXpForLesson } from "../data/gamification";

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

  const saveResult = useCallback((childId, subject, lessonId, score, total, difficulty) => {
    const key = `${childId}.${subject}.${lessonId}`;
    setProgress((prev) => {
      const existing = prev[key];
      // Only overwrite if new score is higher
      if (existing && existing.score >= score) return prev;
      const xp = difficulty ? getXpForLesson(difficulty, score, total) : 0;
      const updated = {
        ...prev,
        [key]: { score, total, date: new Date().toISOString(), xp, difficulty },
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
