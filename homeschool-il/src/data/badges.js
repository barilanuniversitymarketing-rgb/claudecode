import { getSubjectStats } from "../utils/stats";

export const BADGES = [
  {
    id: "streak_2",
    emoji: "⚡",
    title: "יום עמוס",
    desc: "השלמת 2 שיעורים ביום אחד",
    check: (stats) => stats.maxLessonsInOneDay >= 2,
  },
  {
    id: "streak_3",
    emoji: "🔥",
    title: "שריפת שיעורים",
    desc: "השלמת 3 שיעורים ביום אחד",
    check: (stats) => stats.maxLessonsInOneDay >= 3,
  },
  {
    id: "streak_5",
    emoji: "💥",
    title: "מכונת למידה",
    desc: "השלמת 5 שיעורים ביום אחד",
    check: (stats) => stats.maxLessonsInOneDay >= 5,
  },
  {
    id: "perfect_1",
    emoji: "⭐",
    title: "מושלם!",
    desc: "קיבלת 5 מתוך 5 בשיעור",
    check: (stats) => stats.perfectScores >= 1,
  },
  {
    id: "perfect_3",
    emoji: "🌟",
    title: "שלישיית כוכבים",
    desc: "קיבלת 3 ציונים מושלמים",
    check: (stats) => stats.perfectScores >= 3,
  },
  {
    id: "math_done",
    emoji: "🔢",
    title: "אלוף חשבון",
    desc: "סיימת את כל שיעורי החשבון",
    check: (stats) => stats.mathAllDone,
  },
  {
    id: "english_done",
    emoji: "🔤",
    title: "אלוף אנגלית",
    desc: "סיימת את כל שיעורי האנגלית",
    check: (stats) => stats.englishAllDone,
  },
  {
    id: "advanced_first",
    emoji: "🚀",
    title: "שיעור מתקדם",
    desc: "השלמת שיעור מתקדם בפעם הראשונה",
    check: (stats) => stats.hasAdvancedLesson,
  },
  {
    id: "milestone_5",
    emoji: "🎯",
    title: "חמישה שיעורים",
    desc: "השלמת 5 שיעורים בסך הכל",
    check: (stats) => stats.totalCompleted >= 5,
  },
  {
    id: "milestone_10",
    emoji: "🏆",
    title: "עשרה שיעורים",
    desc: "השלמת 10 שיעורים בסך הכל",
    check: (stats) => stats.totalCompleted >= 10,
  },
];

export function getBadgeStats(childId, progress) {
  const prefix = childId + ".";
  const entries = Object.entries(progress).filter(([k]) => k.startsWith(prefix));

  let perfectScores = 0;
  let hasAdvancedLesson = false;
  const lessonsByDay = {};

  for (const [, entry] of entries) {
    if (entry.score === entry.total) perfectScores++;
    if (entry.difficulty === "advanced") hasAdvancedLesson = true;
    const day = entry.date ? entry.date.slice(0, 10) : null;
    if (day) lessonsByDay[day] = (lessonsByDay[day] || 0) + 1;
  }

  const maxLessonsInOneDay = Object.values(lessonsByDay).reduce(
    (m, v) => Math.max(m, v),
    0
  );

  const mathStats = getSubjectStats(childId, "math", progress);
  const englishStats = getSubjectStats(childId, "english", progress);

  return {
    totalCompleted: entries.length,
    perfectScores,
    mathCompleted: mathStats.completed,
    mathTotal: mathStats.total,
    englishCompleted: englishStats.completed,
    englishTotal: englishStats.total,
    mathAllDone: mathStats.total > 0 && mathStats.completed === mathStats.total,
    englishAllDone: englishStats.total > 0 && englishStats.completed === englishStats.total,
    hasAdvancedLesson,
    lessonsByDay,
    maxLessonsInOneDay,
  };
}

export function getEarnedBadges(childId, progress) {
  const stats = getBadgeStats(childId, progress);
  return BADGES.filter((b) => b.check(stats));
}
