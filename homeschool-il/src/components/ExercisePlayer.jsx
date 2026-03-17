import { useState, useEffect, useRef } from "react";
import { SUBJECTS } from "../data/subjects";
import ProgressBar from "./ProgressBar";
import StarRating from "./StarRating";
import { getXpForLesson } from "../data/gamification";

export default function ExercisePlayer({ lesson, subjectKey, onComplete, difficulty }) {
  const subject = SUBJECTS[subjectKey];
  const exercises = lesson.exercises;
  const total = exercises.length;

  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | "correct" | "wrong"
  const [done, setDone] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const inputRef = useRef(null);
  const hasSpeech = typeof window !== "undefined" && "speechSynthesis" in window;

  function speak(text, lang) {
    if (!hasSpeech) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  }

  // Cancel speech when moving to next question or finishing
  useEffect(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, [current, done]);

  useEffect(() => {
    if (!done && !feedback) {
      inputRef.current?.focus();
    }
  }, [current, feedback, done]);

  function checkAnswer() {
    if (!input.trim()) return;
    const exercise = exercises[current];
    let isCorrect;
    if (exercise.type === "number") {
      isCorrect = parseFloat(input) === exercise.answer;
    } else {
      isCorrect = input.trim().toUpperCase() === String(exercise.answer).toUpperCase();
    }

    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      setFeedback(null);
      setInput("");
      if (current + 1 >= total) {
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
      }
    }, 1200);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") checkAnswer();
  }

  function getResultEmoji(s, t) {
    const pct = s / t;
    if (pct >= 0.8) return "🎉";
    if (pct >= 0.5) return "👏";
    return "💪";
  }

  function getResultMessage(s, t) {
    const pct = s / t;
    if (pct >= 0.8) return "!מצוין";
    if (pct >= 0.5) return "!כל הכבוד";
    return "נסו שוב, אתם יכולים";
  }

  useEffect(() => {
    if (done) {
      onComplete(score, total);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const exercise = exercises[current];
  const isDisabled = feedback !== null;

  const cardBg = feedback === "correct" ? "#E8F5E9" : feedback === "wrong" ? "#FFEBEE" : "#FAFAFA";
  const cardBorder = feedback === "correct" ? "#4CAF50" : feedback === "wrong" ? "#E53935" : "#eee";

  if (done) {
    const pct = Math.round((score / total) * 100);
    return (
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          animation: "fadeIn 300ms ease",
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 16 }}>
          {getResultEmoji(score, total)}
        </div>
        <div
          style={{
            fontFamily: "'Rubik', sans-serif",
            fontWeight: 700,
            fontSize: 28,
            color: subject.color,
            marginBottom: 8,
          }}
        >
          {score} / {total}
        </div>
        <div
          style={{
            fontFamily: "'Rubik', sans-serif",
            fontSize: 15,
            color: "#666",
            marginBottom: 16,
          }}
        >
          {getResultMessage(score, total)}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <StarRating score={score} total={total} />
        </div>
        {difficulty && (
          <div
            style={{
              fontFamily: "'Rubik', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: subject.color,
              marginTop: 10,
            }}
          >
            {`+${getXpForLesson(difficulty, score, total)} נק׳`}
          </div>
        )}
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            color: "#999",
            marginTop: 8,
          }}
        >
          {pct}%
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 200ms ease" }}>
      {/* Progress row */}
      <div
        style={{
          direction: "ltr",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            color: "#999",
            whiteSpace: "nowrap",
          }}
        >
          {current + 1} / {total}
        </div>
        <div style={{ flex: 1 }}>
          <ProgressBar value={current} max={total} color={subject.color} />
        </div>
      </div>

      {/* Question card */}
      <div
        style={{
          background: cardBg,
          border: `1.5px solid ${cardBorder}`,
          borderRadius: 16,
          padding: "28px 24px",
          marginBottom: 16,
          transition: "background 200ms, border-color 200ms",
          minHeight: 100,
        }}
      >
        <p
          style={{
            fontFamily: "'Rubik', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            lineHeight: 1.7,
            color: "#1A1A1A",
            margin: 0,
            direction: "rtl",
          }}
          lang={exercise.type === "text" && /[a-zA-Z]/.test(exercise.q) ? "en" : "he"}
        >
          {exercise.q}
        </p>
        {hasSpeech && (() => {
          const isEnglish = exercise.type === "text" && /[a-zA-Z]/.test(exercise.q);
          return (
            <button
              onClick={() => speak(exercise.q, isEnglish ? "en-US" : "he-IL")}
              aria-label="קרא את השאלה בקול"
              style={{
                marginTop: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: isSpeaking ? subject.color : "transparent",
                border: `1.5px solid ${isSpeaking ? subject.color : "#ddd"}`,
                borderRadius: 20,
                padding: "5px 14px",
                cursor: "pointer",
                fontFamily: "'Rubik', sans-serif",
                fontSize: 13,
                color: isSpeaking ? "#fff" : "#888",
                transition: "all 150ms",
                minHeight: 36,
              }}
            >
              <span>{isSpeaking ? "🔊" : "🔈"}</span>
              <span>הקשב לשאלה</span>
            </button>
          );
        })()}

        {feedback && (
          <div
            style={{
              marginTop: 12,
              fontFamily: "'Rubik', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: feedback === "correct" ? "#4CAF50" : "#E53935",
              animation: "pop 200ms ease",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            role="status"
            aria-live="assertive"
          >
            {feedback === "correct" ? (
              <>
                <span>✓</span>
                <span>!נכון</span>
              </>
            ) : (
              <>
                <span>✗</span>
                <span>התשובה: {exercise.answer}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Input row */}
      <div
        style={{
          direction: "ltr",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          ref={inputRef}
          type={exercise.type === "number" ? "number" : "text"}
          inputMode={exercise.type === "number" ? "numeric" : "text"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          aria-label={exercise.type === "number" ? "הכנס מספר כתשובה" : "הכנס תשובה"}
          placeholder={exercise.type === "number" ? "0" : "תשובה..."}
          style={{
            flex: 1,
            padding: "14px 18px",
            border: `1.5px solid ${isDisabled ? "#eee" : "#ddd"}`,
            borderRadius: 12,
            fontSize: 18,
            fontFamily: exercise.type === "number" ? "'Space Mono', monospace" : "'Rubik', sans-serif",
            outline: "none",
            background: "#fff",
            color: "#1A1A1A",
            transition: "border-color 150ms",
            direction: "ltr",
            textAlign: "center",
          }}
          onFocus={(e) => { e.target.style.borderColor = subject.color; }}
          onBlur={(e) => { e.target.style.borderColor = isDisabled ? "#eee" : "#ddd"; }}
        />
        <button
          onClick={checkAnswer}
          disabled={isDisabled || !input.trim()}
          aria-label="שלח תשובה"
          style={{
            padding: "14px 28px",
            borderRadius: 12,
            border: "none",
            background: isDisabled || !input.trim() ? "#ccc" : subject.color,
            color: "#fff",
            fontFamily: "'Rubik', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            cursor: isDisabled || !input.trim() ? "not-allowed" : "pointer",
            transition: "background 150ms",
            minHeight: 44,
            minWidth: 54,
          }}
        >
          ✓
        </button>
      </div>
    </div>
  );
}
