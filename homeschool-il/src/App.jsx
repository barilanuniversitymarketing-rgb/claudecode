import { useState, useEffect, useRef } from "react";
import { CHILDREN } from "./data/children";
import { SUBJECTS } from "./data/subjects";
import { LEVELS } from "./data/levels";
import child1Math from "./data/curriculum/child1-math";
import child1English from "./data/curriculum/child1-english";
import child2Math from "./data/curriculum/child2-math";
import child2English from "./data/curriculum/child2-english";
import { useProgress } from "./hooks/useProgress";
import { useChildNames } from "./hooks/useChildNames";
import { getSubjectStats, getChildStats, getChildTotalXp } from "./utils/stats";
import { getRankForXp } from "./data/gamification";
import { getEarnedBadges } from "./data/badges";
import Header from "./components/Header";
import ChildTabs from "./components/ChildTabs";
import SubjectCard from "./components/SubjectCard";
import LevelGroup from "./components/LevelGroup";
import ExercisePlayer from "./components/ExercisePlayer";
import LevelUpToast from "./components/LevelUpToast";
import XpLeaderboard from "./components/XpLeaderboard";
import ChildSummary from "./components/ChildSummary";
import BadgeToast from "./components/BadgeToast";

const CURRICULA = {
  child1: { math: child1Math, english: child1English },
  child2: { math: child2Math, english: child2English },
};

export default function App() {
  const [view, setView] = useState("home"); // "home" | "subject" | "lesson"
  const [activeChild, setActiveChild] = useState("child1");
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);
  const [levelUpRank, setLevelUpRank] = useState(null);
  const [badgeQueue, setBadgeQueue] = useState([]);

  const [progress, saveResult, resetProgress] = useProgress();
  const [getChildName, setChildName] = useChildNames();

  const rankBeforeRef = useRef(null);
  const badgesBeforeRef = useRef(null);

  const childStats = {
    child1: getChildStats("child1", progress),
    child2: getChildStats("child2", progress),
  };

  const xpByChild = {
    child1: getChildTotalXp("child1", progress),
    child2: getChildTotalXp("child2", progress),
  };

  // Detect level-up and new badges after progress updates
  useEffect(() => {
    if (rankBeforeRef.current === null) return;
    const rankBefore = rankBeforeRef.current;
    const rankAfter = getRankForXp(getChildTotalXp(activeChild, progress));
    if (rankAfter.minXp > rankBefore.minXp) {
      setLevelUpRank(rankAfter);
    }
    rankBeforeRef.current = null;

    if (badgesBeforeRef.current !== null) {
      const before = badgesBeforeRef.current;
      const newBadges = getEarnedBadges(activeChild, progress).filter(
        (b) => !before.has(b.id)
      );
      if (newBadges.length > 0) {
        setBadgeQueue((q) => [...q, ...newBadges]);
      }
      badgesBeforeRef.current = null;
    }
  }, [progress, activeChild]);

  function handleBack() {
    if (view === "lesson") setView("subject");
    else if (view === "subject") setView("home");
  }

  function handleSelectSubject(subjectKey) {
    setActiveSubject(subjectKey);
    setView("subject");
  }

  function handleSelectLesson(lesson, level) {
    setActiveLesson(lesson);
    setActiveLevel(level);
    setView("lesson");
  }

  function handleLessonComplete(score, total) {
    rankBeforeRef.current = getRankForXp(getChildTotalXp(activeChild, progress));
    badgesBeforeRef.current = new Set(
      getEarnedBadges(activeChild, progress).map((b) => b.id)
    );
    saveResult(activeChild, activeSubject, activeLesson.id, score, total, activeLevel);
  }

  function handleBadgeDismiss() {
    setBadgeQueue((q) => q.slice(1));
  }

  function handleReset() {
    if (window.confirm("האם אתם בטוחים? כל ההתקדמות תימחק.")) {
      resetProgress();
    }
  }

  const headerTitle =
    view === "home"
      ? "שיעורי בית 📚"
      : view === "subject"
      ? SUBJECTS[activeSubject]?.label
      : activeLesson?.title || "";

  const curriculum = activeSubject ? CURRICULA[activeChild]?.[activeSubject] : null;

  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        minHeight: "100vh",
        background: "#F7F5F0",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          paddingBottom: 40,
        }}
      >
        <Header
          title={headerTitle}
          onBack={view !== "home" ? handleBack : null}
        />

        <div style={{ padding: "0 16px" }}>
          {/* HOME VIEW */}
          {view === "home" && (
            <div style={{ animation: "fadeIn 250ms ease" }}>
              <ChildTabs
                activeChild={activeChild}
                onSelect={setActiveChild}
                getChildName={getChildName}
                setChildName={setChildName}
                stats={childStats}
                xpByChild={xpByChild}
              />
              <XpLeaderboard xpByChild={xpByChild} getChildName={getChildName} />
              <ChildSummary
                childId={activeChild}
                progress={progress}
                childStats={childStats[activeChild]}
                totalXp={xpByChild[activeChild] ?? 0}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {Object.keys(SUBJECTS).map((key, i) => (
                  <SubjectCard
                    key={key}
                    subjectKey={key}
                    stats={childStats[activeChild]?.[key] || {}}
                    onClick={() => handleSelectSubject(key)}
                    animIndex={i}
                  />
                ))}
              </div>
              <button
                onClick={handleReset}
                aria-label="אפס את כל ההתקדמות"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "1.5px solid #ddd",
                  borderRadius: 12,
                  padding: "12px",
                  color: "#999",
                  fontFamily: "'Rubik', sans-serif",
                  fontSize: 13,
                  cursor: "pointer",
                  minHeight: 44,
                }}
              >
                אפס התקדמות
              </button>
            </div>
          )}

          {/* SUBJECT VIEW */}
          {view === "subject" && curriculum && (
            <div style={{ animation: "fadeIn 250ms ease" }}>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontFamily: "'Rubik', sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                    color: "#666",
                    marginBottom: 16,
                  }}
                >
                  {getChildName(activeChild)} — {SUBJECTS[activeSubject]?.label}
                </div>
              </div>
              {LEVELS.map((level) => {
                const lessons = curriculum[level];
                if (!lessons || lessons.length === 0) return null;
                return (
                  <LevelGroup
                    key={level}
                    level={level}
                    lessons={lessons}
                    subjectKey={activeSubject}
                    progress={progress}
                    childId={activeChild}
                    onSelectLesson={handleSelectLesson}
                  />
                );
              })}
            </div>
          )}

          {/* LESSON VIEW */}
          {view === "lesson" && activeLesson && (
            <div style={{ animation: "fadeIn 250ms ease" }}>
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontFamily: "'Rubik', sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                    color: "#666",
                    marginBottom: 4,
                  }}
                >
                  {getChildName(activeChild)} — {SUBJECTS[activeSubject]?.label}
                </div>
                <div
                  lang="en"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    color: "#aaa",
                  }}
                >
                  {activeLesson.titleEn}
                </div>
                <div
                  style={{
                    fontFamily: "'Rubik', sans-serif",
                    fontSize: 13,
                    color: "#888",
                    marginTop: 4,
                  }}
                >
                  {activeLesson.desc}
                </div>
              </div>
              <ExercisePlayer
                key={activeLesson.id}
                lesson={activeLesson}
                subjectKey={activeSubject}
                onComplete={handleLessonComplete}
                difficulty={activeLevel}
              />
              <div style={{ marginTop: 24, textAlign: "center" }}>
                <button
                  onClick={handleBack}
                  aria-label="חזרה לרשימת השיעורים"
                  style={{
                    background: "transparent",
                    border: "1.5px solid #ddd",
                    borderRadius: 12,
                    padding: "10px 24px",
                    color: "#666",
                    fontFamily: "'Rubik', sans-serif",
                    fontSize: 14,
                    cursor: "pointer",
                    minHeight: 44,
                  }}
                >
                  → חזרה לשיעורים
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {levelUpRank && (
        <LevelUpToast rank={levelUpRank} onDismiss={() => setLevelUpRank(null)} />
      )}
      {badgeQueue.length > 0 && !levelUpRank && (
        <BadgeToast badge={badgeQueue[0]} onDismiss={handleBadgeDismiss} />
      )}
    </div>
  );
}
